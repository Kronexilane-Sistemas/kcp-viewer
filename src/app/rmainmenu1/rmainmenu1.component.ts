import { kcp_item } from './../app-parts/categories/categories.model';
import { Component, Input, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { PluginSearchComponent } from '../plugins/plugin-search/plugin-search.component';
import { LogoutComponent } from '../plugins/logout/logout.component';
import { PortfolioHeaderService } from '../services/portfolio/portfolio-header.service';
import { STValue } from '../global.data';

// Declaramos las variables para jQuery
declare var $: any;

@Component({
  selector: 'app-rmainmenu1',
  templateUrl: './rmainmenu1.component.html',
  styleUrls: ['./rmainmenu1.component.scss']
})
export class Rmainmenu1Component implements OnInit,AfterViewChecked {

  public kcpmenu!: kcp_item;
  public menures!: string;
  public MenuActivate: boolean = true;
  public allLinks: boolean = false;
  public statusM:boolean=false;

  // Variables para mantener los efectos de expandir/contraer
  private capasEC: string[] = [];

  private countDeploy: number = 0;
  private countMenus: number = 0;

  @Input() public menutext: string | undefined;
  @Input() public idtext: string = "";
  @Input() public title: string = "Kronexilane Sistemas";
  @Input() public subtitle: string = "Programación y desarrollo"

  constructor(private pfheader: PortfolioHeaderService) {}

  ngAfterViewChecked(): void {
    this.title = STValue("title", "KRONEXILANE SISTEMAS");
    this.subtitle = STValue("subtitle", "Diseño Web y Programación");
  }

  // Lee asincronicamente el menu
  async ngOnInit(): Promise<void> {
    this.menures = "#" + this.idtext;

    if (this.menutext != '' && this.menutext != null) {
      await this.pfheader.getMenu(this.menutext).then(
        async data => {
          if (data != null) {
            let i: number = 0;
            this.kcpmenu = data;
            this.kcpmenu.subitems.forEach(
              item => {
                /*
                  Cuenta el nº de capas desplegables y
                  las apila para el efecto de plega/desplegar todo.
                */
                if (item.itemtype >= 5) {
                  this.countMenus++;
                  let capa: string = "#" + this.idtext + i;
                  this.capasEC.push(capa);
                }
                i++;
              }
            );
            this.allLinks = this.countMenus == 0;
          }
        }
      );
    } else {
      this.MenuActivate = false;
    }

  }

  // Estados del botón de expandir/contraer todo

  private imgExpandStatus: string[] = ["assets/expandir.png", "assets/contraer.png"];
  private txtExpandStatus: string[] = ["Contraer todo", "Expandir todo"];

  // Estados (imagenes) del botón de despliegue de cada menú
  private imgMenuStatus: string[] = ["assets/menudown.png", "assets/menuup.png"];

  /**
   * Expandir/Contraer todas las capas desplegables
   */
  public Expand(): void {

    let imgE: any = $("#rexpand" + this.idtext).attr("src");
    let txtE: any = $("#rtexpand" + this.idtext).text();

    // Cambia los datos del botón de expansión/contracción
    $("#rexpand" + this.idtext).attr("src", this.changeBinaryStatus(imgE, this.imgExpandStatus));
    $("#rtexpand" + this.idtext).text(this.changeBinaryStatus(txtE, this.txtExpandStatus, (status: boolean) => {

      this.capasEC.forEach(data => {
        // Cambia el estado de los botones de las capas desplegadas
        // y cierra las capas desplegadas
        let capadd: string = data.replace("#", "#dd");
        let imgE: string = $(capadd).find("img").attr("src");
        if (!status) {
          $(data).slideUp("fast");
          this.countDeploy = 0;
        } else {
          $(data).slideDown("fast");
          this.countDeploy = this.countMenus;

        }
        $(capadd).find("img").attr("src", this.changeBinaryStatus(imgE, this.imgMenuStatus, undefined, !status));
      });
    }));


  }

  /**
   * Abre el menú responsive
   */
  public OpenMenu(): void {
    let open:string=$("#ftoggle").attr("src");
    let status:string[]=['assets/mrdown.png','assets/mrup.png']
    $(this.menures).fadeToggle();
    $("#ftoggle").attr("src", this.changeBinaryStatus(open,status));
    $(this.menures).css("display", "grid");
  }
  /**
   * Cierro del menú responsive
   * cerrando todas las posibles capas abiertas
   */
  public CloseMenu(): void {
    $(this.menures).fadeOut();
    let open:string=$("#ftoggle").attr("src");
    $("#ftoggle").attr("src","assets/mrdown.png");

  }
  public CerrarMenu(event:any):void{
      if(event){
        this.CloseMenu();
      }
  }

  /**
   * Despliegue de cada menú o "capa abierta"
   * @param indice
   */
  public Slide(indice: number) {
    // Obtiene el ID de la capa y el ID del titulo de menú que lo abre
    let capa: string = "#" + this.idtext + indice;
    let capad: string = "#dd" + this.idtext + indice;
    let imgslide: string = $(capad).find("img").attr("src");
    let imgE: any = $("#rexpand" + this.idtext).attr("src");
    let txtE: any = $("#rtexpand" + this.idtext).text();

    $(capa).slideToggle("fast");

    // Cambia la imagen de estado
    $(capad).find("img").attr("src", this.changeBinaryStatus(imgslide, this.imgMenuStatus,
      estado => {
        if (!estado) this.countDeploy++; else this.countDeploy--;
      }
    ));

    // Cambia el estado del botón de expandir/contraer todo
    // si se han abierto todas las capas o si se han cerrado todas

    if (this.countDeploy == 0) {
      $("#rexpand" + this.idtext).attr("src", this.changeBinaryStatus(imgE, this.imgExpandStatus));
      $("#rtexpand" + this.idtext).text(this.changeBinaryStatus(txtE, this.txtExpandStatus));
    }
    if (this.countMenus == this.countDeploy) {
      $("#rexpand" + this.idtext).attr("src", this.changeBinaryStatus(imgE, this.imgExpandStatus));
      $("#rtexpand" + this.idtext).text(this.changeBinaryStatus(txtE, this.txtExpandStatus));
    }


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

  // Selecciona una imagen para el elemento del menú responsible
  public getLinkImg(item: kcp_item): string {
    let img: string = "";
    let itemtype: number = item.itemtype;
    switch (itemtype) {
      case 0:
        img = "assets/webb.png"
        break;
      case 1:
        img = "assets/categories/1.png";
        break;
      case 2:
        img = "assets/categories/2.png";
        break;
      case 3:
        img = "assets/enlace0.png";
        break;
      case 4:
        img = "assets/downc.png";
        break;
      case 5:
      case 6:
      case 7:
        img = "assets/menudown.png";
        break;
      default:
        img = "assets/enlace0.png";
    }
    return img;
  }
  /**
   * Cambia el estado de un item del DOM con JQUERY
   * @param state Estado: (Texto o ruta de imagen actual)
   * @param status  Matriz de estados: Textos a cambiar o rutas de imagenes
   * @param expandfn Función a realizar en caso de que estemos en cambio a EXPAND(true) o CONTRAER(FALSE)
   * @returns
   */
  public changeBinaryStatus(
    state: string,
    status: string[],
    expandfn?: (status: boolean) => void,
    currentstatus: any = undefined
  ): string {
    let indice: number = 0;
    if (currentstatus == undefined) {
      if (status.includes(state)) {
        indice = status.findIndex(e => e == state);
        if (indice - 1 < 0) {
          indice = 1;
        } else {
          indice = 0
        };
      }
    } else {
      if (!currentstatus) indice = 1; else indice = 0;
    }
    /*
      Si se define un CALLBACK para definir la acción en curso
      (EXPANDIR=true, CONTRAER=FALSE) se ejecuta
   */
    if (expandfn != undefined) expandfn(indice == 0);
    return status[indice];
  }

}
