
import { Router } from '@angular/router';
import { kcp_item } from './app-parts/categories/categories.model';
import { MessengerService, msgType } from './services/messenger.service';
import { Component, OnInit } from '@angular/core';
import { SearchEngineService, SearchMessages } from './app-parts/search/search-engine.service';
import { PluginParameters } from './plugins/plugin/plugin.parameters';

// Declaramos las variables para jQuery
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit {
  title = 'viewer';

  public msgComponent: string | undefined;

  /* --------------- Parámetros vía "settings.json" -----------------*/

  public logout: boolean = false; // Activa el cerrar sesión para ir a otro portafolio
  public search: boolean = false; // Plugin de búsqueda en el menú superior
  public visitcounter:boolean=true; // Contador de visitas
  public orderfootermenu: string = "down"; // Menú de página (Arriba o Abajo del footer)
  public logo: boolean = true; // Activar logo de Kronexilane Sistemas en parte superior
  public menucenter: boolean = false; // Centrar menú superior
  public specialfunctions: boolean = false; // Activación de funciones especiales de búsqueda
  public cookiesWarning: boolean = false; // Advertencia de Cookies
  public cookiesText: string = "Aviso de seguimiento"; // Cookies mensaje
  public cookiesTitle: string = "Avisor de seguimiento;" // Cookies título
  public AllPlugins!:PluginParameters[];

  // Variables generales del inicio
  public login: boolean = true;
  public intro: boolean = true;
  public portfoliotitle:any="Kronexilane Sistemas";
  public portfoliosubtitle: any = "Programación y Desarrollo";
  public message: string = "";
  public imagenes: string[] = ["/img/header.jpg", "/img/computer.png"];

  // Menú principal y menú de Footer
  public mainmenu: kcp_item | undefined;
  public footer_menu: kcp_item | undefined;
  public swFooterMenu: boolean = true;

  // Mensaje de Copyrigth y estado
  public copyrigth: string = "(c) 2022";
  public msgstatus: string = "sin datos";


  public plugdata: string[] = [];
  images: any;


  // La palabra clave main carga el menú principal
  // desde el backend
  public principal:String="main";

  constructor(
    private msg: MessengerService,
    private r:Router,
    private searchEngine:SearchEngineService
  ) {}

  async ngOnInit(): Promise<void> {

    // Si se ha echo un cierre de sesión
    // Guarda un Switch para utilizar la pantalla de login
    if (localStorage.getItem("sw") == "1") {
      this.intro = false;
      localStorage.clear();
    };



    /** RECEPCION DE MENSAJES DE OTROS COMPONENTES */

    // -- ** Salida ** --
    this.msg.getMessage(msgType.LOGOUT).subscribe
      (
        () => {
          localStorage.setItem("sw", "1");
          location.reload();
        }
    );
    // -- ** Texto de Copyrigth ** --
    this.msg.getMessage(msgType.COPYRIGHT).subscribe(msg => this.copyrigth = msg);
    // -- ** Página inicial ** --
    this.msg.getMessage(msgType.INITIAL_PAGE).subscribe(msg=>{
      if(msg!='' && msg!=null){
        this.r.navigateByUrl(msg);
      }
    });
    // -- ** Parámetros del portfolio mediante el fichero JSON -- **
    this.msg.getMessage(msgType.PARAMETERS).subscribe(data=>{
        this.logout=data.logout;
        this.search=data.search;
        this.logo=data.logo;
        this.menucenter=data.menucenter;
        this.cookiesWarning=data.cookieswarning;
        this.cookiesText=data.cookiestext;
        this.cookiesTitle=data.cookiestitle;
        this.orderfootermenu=data.footermenuposition;
        this.visitcounter=data.visitcounter;

        // Usuario que establece funciones especiales de búsqueda
        let user:any=sessionStorage.getItem("currentUser");
        let suser: any = data.userspecialfunctions;
        if(suser!=undefined && user!=undefined){
          let u1:string=user;
          let u2:string=suser;
          this.specialfunctions=(u1.toUpperCase() === u2.toUpperCase());
        }

        // Envia el parámetro de cacheado de búsqueda al sessionstorage
        sessionStorage.setItem("search_caching",data.search_caching?'true':'false');

        // Recolección de parámetros PLUGINS
        if(data.plugins.length!=0){
          this.AllPlugins=data.plugins;
        }
    });

    // -- ** Matriz de BOOLEANOS ** -- //
    // [0] - Presencia de menú FOOTER
    // [1] - Presencia de menú principal
    this.msg.getMessage(msgType.REFRESH).subscribe(
      (data:boolean[])=>{
        this.swFooterMenu=data[0];
      }
    );

  }

  // Cambio de Login a Principal
  Cambio($event: boolean) {
    this.login = !$event;
  }

}
