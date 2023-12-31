import { Key } from 'readline';
import { PluginComponent } from './../plugins/plugin/plugin.component';
import { kcp_item } from './../app-parts/categories/categories.model';
import { FooterComponent } from './../footer/footer.component';
import { HeaderComponent } from './../header/header.component';
import { CategoriesComponent } from './../app-parts/categories/categories.component';
import { LogoutComponent } from './../plugins/logout/logout.component';
import { PluginSearchComponent } from './../plugins/plugin-search/plugin-search.component';

import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, OnInit, AfterContentChecked } from '@angular/core';
import { PortfolioHeaderService } from '../services/portfolio/portfolio-header.service';
import { menumain } from '../global.data';
import { JSDocComment } from '@angular/compiler';

// Declaramos las variables para jQuery
declare var $: any;
declare var Menus: any;


@Component({
  selector: 'app-mainmenu1',
  templateUrl: './mainmenu1.component.html',
  styleUrls: ['./mainmenu1.component.scss']
})

export class Mainmenu1Component implements OnInit {

  public kcpmenu!:kcp_item;
  public MenuActivate:boolean=true;
  public capas:string[]=[];

  @Input() public menutext:string|undefined;
  @Input() public idtext:string="";

    // Lista de componentes usables

  constructor(private pfheader:PortfolioHeaderService){}


  // Lee asincronicamente el menu
  async ngOnInit(): Promise<void>{

    if(this.menutext!=undefined){
      await this.pfheader.getMenu(this.menutext).then(
        async data=>
        {
          this.kcpmenu=data;
        }
      ).finally(()=>{
        $("#"+this.idtext).hide();
      });
    }else{
      this.MenuActivate=false;
    }

 }

 // Abre la capa del menú con JQUERY y hace algunos ajustes
  public Abrir(indice:number){
    // Obtiene el ID de la capa y el ID del titulo de menú que lo abre
    let capa: string = "#" + this.idtext + indice;
    let data2: string = "#d" + this.idtext + indice;

    // Si la pila de últimos abiertos esta llena la vacia y cierra las capas
    if (this.capas.length != 0) {
      $(this.capas.pop()).hide();
    }

    // Hace ajustes del ancho de la capa del menu de JQUERY.
    $(capa).fadeIn();

    let menu:number=$(capa).find("ul").width();
    let button:number=$(data2).width();
    if(menu<button){
      $(capa).find("ul").width(button+50);
    }
    //alert("button:"+button+"---menu:"+menu);


    // Abre la capa y guarda su ID en la pila de abiertos

    this.capas.push(capa);
  }

  // Cierra la capa del menu JQUERY
  public Cerrar():void {
    $(this.capas.pop()).hide();
  }

  // Inyectar componente mediante el campo plugin
  public InyectarComponente(componentString: any): any {
    switch (componentString) {
      case "busqueda":
        return PluginSearchComponent;
      case "logout":
        return LogoutComponent;
    }
  }

  /**
   * Cambia el estado binario (ACTIVADO/DESACTIVADO)
   * @param state VALOR ACTUAL
   * @param status Matriz de estados (Cerrado 0 Abierto 1)
   * @returns El nuevo valor-
   */
  public changeBinaryStatus(state: string, status: string[]): string {
    let indice: number = 0;
    if (status.includes(state)) {
      indice = status.findIndex(e => e == state);
      if (indice - 1 < 0) {
        indice = 1;
      } else {
        indice = 0
      };
    }
    return status[indice];
  }

}
