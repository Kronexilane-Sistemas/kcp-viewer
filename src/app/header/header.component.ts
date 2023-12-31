import { CNWithOutParams } from 'src/app/app-routing.module';
import { APPSettings, PortfolioSettings } from './../services/config.app.service';
import { PortfolioHeaderService } from './../services/portfolio/portfolio-header.service';

import { Component, OnInit } from '@angular/core';


import { MessengerService, msgType } from '../services/messenger.service';
import { kcp_portfolio } from '../services/portfolio/portfolio-model';
import { kcp_item } from '../app-parts/categories/categories.model';
import { RUTAS } from '../app-routing.module';
import { KCP_Path_To_Objects_Format } from '../app-parts/objects/objects.component';


// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  }
})
export class HeaderComponent implements OnInit {


  // Indica si es titulo de web o titulo desde el navegador de categorias
  public navigator: boolean = false;

  // Imagenes del HEADER
  public fondo: string = "";
  public imagen: string = "";
  public frame: string = "";
  public image: string = "";

  // Titulo
  public titulo: string = ""
  public subtitulo: string = ""
  public autor: string = "";
  public images: string[] = ['assets/header.jpg', ''];
  public titleComposed: string = "";
  public data: any[] = []; // Datos de titulo previos (principales)
  public links!: string[];

  onResize(event: any) { }

  constructor(
    private portfolio: PortfolioHeaderService,
    private message: MessengerService,
    private cfg: APPSettings
  ) { }


  async ngOnInit(): Promise<void> {
    // Lectura de datos de cabecera
     await this.portfolio.getPortFolioHeader().then
      (
         async data => {
          let header: kcp_portfolio = data as kcp_portfolio;
          // Asignar fondo de header e imagen ilustrativa
          this.images = [header.headerbackground, header.headerimg];

          // Titulo y subtitulo
          this.titulo = this.ChoiceTitle(header.title);
          this.subtitulo = this.ChoiceTitle(header.subtitle);
          this.autor = this.ChoiceTitle(header.author);
          this.message.Emit(header.copyright, msgType.COPYRIGHT);
          this.message.Emit(header.title.concat("|").concat(header.subtitle), msgType.TEXT);




          // Analiza el item KCP y envia el componente con los parámetros adecuados
          // como salto para navigate (lo que permite opciones de salto interesantes)
          await this.portfolio.getMenu(header.mainpage).then(async item => {
            header.mainpage = this.AnalizeMainPage(item, header.mainpage);
          })
          this.message.Emit(header.mainpage, msgType.INITIAL_PAGE);


          this.data[0] = header.title;
          this.data[1] = header.subtitle;
          this.data[2] = header.author;
          this.data[3] = header.headerimg;
          this.titleComposed = header.title.concat("/").concat(header.subtitle);
          sessionStorage.setItem("title", header.title);
          sessionStorage.setItem("subtitle", header.subtitle);
          sessionStorage.setItem("author", header.author);
          sessionStorage.setItem("image", header.headerimg);
          sessionStorage.setItem("titleComposed", this.titleComposed);
          sessionStorage.setItem("portfolioname", header.name);
          this.cfg.GetPortfolioSettings(header.name).then(data => {
            this.message.Emit(data, msgType.PARAMETERS);
          });

        }
      ).finally(() => {
        $("body").fadeIn(1000);
      });

    // Recibir datos de mensajeria desde el componente navegador de categorias
    this.message.getMessage(msgType.ADDITIONAL).subscribe(data => {
      if (data instanceof MsgFromNavigator) {
        this.navigator = true;
        let msg: MsgFromNavigator = (data as MsgFromNavigator);
        this.titulo = msg.name;
        this.subtitulo = this.ChoiceTitle(msg.title, false, true);
        this.autor = msg.path;
        this.images[1] = msg.ilustration;
        this.links = msg.path.split("/");
        this.titleComposed = sessionStorage.getItem("titleComposed")!;

        this.cfg.GetPortfolioSettings(sessionStorage.getItem("portfolioname")!).then(data => {
          this.message.Emit(data, msgType.PARAMETERS);
        });

      } else {

        this.navigator = false;
        this.titulo = this.ChoiceTitle(data[0]);
        this.subtitulo = this.ChoiceTitle(data[1]);
        this.autor = this.ChoiceTitle(data[2]);
        this.images[1] = data[3];

      }
    });

    // Recibir Parámetros
    this.message.getMessage(msgType.PARAMETERS).subscribe(data => {
      this.frame = (data as PortfolioSettings).headerframe;
      this.image = (data as PortfolioSettings).navigatorimg;
    });
  }
  /**
  * Si hay dos campos separados por | elige el de la izquierda (largo) frente
  * al corto (derecha) en función del ratio de pantalla (pequeña o grande)
  * @param title
  * @returns
  */
  public ChoiceTitle(title: string, forRatio: boolean = true, defaultLong = true): string {
    let titles: string[];
    let ratio: number = screen.width / screen.height;
    let ret: string = title;

    try {
      if (title.includes("|")) {
        titles = title.split("|");
        if (forRatio) {
          if (ratio < 1.77) {
            ret = titles[1]; // titulo corto (ratio<1)
          } else {
            ret = titles[0]; // Titulo largo (ratio>1)
          }
        } else {
          if (defaultLong)
            ret = titles[0];
          else
            ret = titles[1];
        }
      }
    } catch {
      ret = title;
    }
    return ret;
  }

  /**
   * Analiza una ruta de tipo KCP://elemento1/elemento2/elementoN...
   * para el campo MainPage (Página principal) y toma decisiones para
   * devolver el componente ANGULAR
   *
   *   1º Si el item es de tipo WORK/PRESENTATION/DOCHTML:
   *      Devuelve ComponenteVisualizador d
   *
   *
   * @param i
   */
  public AnalizeMainPage(i: kcp_item, path: string): string {
    let jump: string = "";
    if(i!=null){
      switch (i.itemtype) {
        case 0: // Web
        case 1: // Presentación
        case 2: // Trabajo
          jump = CNWithOutParams(RUTAS.OBJECTS).concat("/").concat(KCP_Path_To_Objects_Format(path));
          break;
        case 4: // Descarga
        case 5: // Contenedor
        case 6: // G. Enlaces
        case 7: // Colección enlaces
          jump = CNWithOutParams(RUTAS.NAVIGATOR).concat("/.");
          break;
        case 3: // Enlace
          if (i.router != '' || i.router != null) {
            jump = i.router
          } else {
            jump = CNWithOutParams(RUTAS.NAVIGATOR).concat("/.");
          }
      }
    }else{
      jump=CNWithOutParams(RUTAS.NAVIGATOR).concat("/.");
    }
    return jump;
  }
}

/**
 * Objeto mensaje que puede recibir desde el navegador
 * para colocar en el header: Imagen de fondo, de ilustración,
 * nombre de objeto, titulo y ruta del objeto
 */
export class MsgFromNavigator {
  public ilustration!: string;
  public background!: string;
  public name!: string;
  public title!: string;
  public path!: string;
}



