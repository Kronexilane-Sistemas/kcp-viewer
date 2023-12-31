import { MsgFromNavigator } from './../../header/header.component';
import { MessengerService, msgType } from './../../services/messenger.service';


import { Component, Input, OnInit, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { KrnPaginatorComponent } from 'src/app/plugins/krn-paginator/krn-paginator.component';
import { kcp_item, eItems, ContainerStatistics } from './categories.model';
import { Router } from '@angular/router';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';
import { SearchEngineService } from '../search/search-engine.service';
import { KCP_Path_To_Objects_Format } from '../objects/objects.component';
import { PortfolioHeaderService } from 'src/app/services/portfolio/portfolio-header.service';

declare var $: any;


// Enumeración con los tipos de ITEM
export enum item {
  container = 0,
  web,
  link,
  download,
  work,
  document,
  menu = 10,
  menubar,
  linkcollection
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
    '(window:maximize)': 'onMaximize($event)'
  }
})
export class CategoriesComponent
  implements
  OnInit,
  AfterViewInit, OnDestroy {

  // Origen de datos desde el exterior
  @Input() DataSource!: kcp_item[];
  @Input() InitialPath!: string;
  @Input() ResumeTo!: string
  @Input() SearchElement!:string;

  @Output() ExitNavigator: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() PathChange: EventEmitter<string> = new EventEmitter<string>();


  // Controles visuales
  public pageSize!: number;
  public msgLoad: string = "Cargando árbol de items...";

  // Nombre elemento seleccionado
  public selectedElement: string = "";

  // Datos de navegación
  public msg_order: string = "";
  public navegacion: kcp_item[] = [];
  public selCat!: kcp_item;
  public selCatDialog!: kcp_item;
  public clickInfo: boolean = false;
  public statisc!: ContainerStatistics;
  public pagecurrent!: number;
  public categoryName: String = "INICIO";
  public categoryTitle: string = "Raíz del portafolio";
  public categoryImg: string = "assets/home-big.png"


  // Variables de localización
  public portfolio: string = "Portafolio";
  public path: string = "/";
  public rutaURL: string = "";
  public refresh: boolean = true;


  public stackPath: kcp_item[] = [];
  public stackPage: number[] = [];


  // Mensaje al Header
  public msgToHeader: MsgFromNavigator = new MsgFromNavigator();

  // Comunicación con componentes y con el exterior
  @ViewChild('paginator') paginador!: KrnPaginatorComponent;

  // Ajusta el número de iconos a visualizar en función del ratio de pantalla
  //  16:9 -> 8 iconos
  //  4:3  ->  6 iconos
  onResize(event: any) {
    // Calcular ratio de aspecto de pantalla
    let ratio: number = screen.width / screen.height;
    // Si es una pantalla de 16:9 8 iconos en caso contrario 6
    if (ratio >= 1.7) this.pageSize = 8; else this.pageSize = 6;

  }
  /*** CONSTRUCTOR ****/
  constructor(private msg2: MessengerService, private r: Router,private e: SearchEngineService,private pf:PortfolioHeaderService) {
    this.r.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  /**  Función cambio estado de lectura (progresión) de items **/
  public ChangeProgress(msg: string, activate: boolean) {
    this.msgLoad = msg;
    if (activate) {
      $("#msgLoad").show();
    } else {
      $("#msgLoad").hide();
    }

  }
  /**  EVENTOS DE INICIALIZACIÓN **/
  ngOnDestroy(): void { this.ReSendOldHeaderData(); }

  // En este evento, podemos ya hacer cosas porque la vista está totalmente cargada
  // e inicializada con todo como si fueramos a navegar.
  public ngAfterViewInit(): void {
    if (this.InitialPath != undefined) {
      var x = setTimeout(async () => {
        this.GoToPath(this.InitialPath);
        this.ChangeProgress("Seleccione objeto o contenedor", false);
      }, 500);
    }

    this.msg2.getMessage(msgType.TEXT).subscribe(data => {
      if (data != "/") {
        this.GoToPath(data);
      }
      else {
        this.Home();
      }
    })

  }

  /*** EVENTOS DE CONTROL COMPONENTE *****/
  ngOnInit(): void {


    // Path inicial
    // Calcular ratio de aspecto de pantalla
    let ratio: number = screen.width / screen.height;
    // Si es una pantalla de 16:9 10 iconos en caso contrario 8
    if (ratio >= 1.7) this.pageSize = 8; else this.pageSize = 6;

    // Seleccionar primer elemento
    this.selCat = this.DataSource[0]; //this.getNotHide(datos);
    this.selCatDialog = this.selCat;
    this.selectedElement = this.selCat.name;
    if (this.selCat.itemtype >= 5 && this.selCat.itemtype <= 7) {
      this.statisc = this.getStatistics(this.selCat.subitems);
    }
    window.scroll(0, 0);

  }

  // Selecciona un elemento y lo marca (Para búsquedas)
  public SelectedElement(item: string, search:kcp_item[]): void {
    this.selectedElement = item;
    let selItem: any = search.find(e => e.name == item);
    if (selItem != undefined) {
      this.CatInfo(selItem);
    }
  }
  /*** ------ PAGINACIÓN ------------ */
  // Evento de paginación general
  public paginar(datos: any) {
    this.selCat = datos[0];
    this.OrderBy("name", datos);
    this.navegacion = datos;
    this.OrderBy("orderitem", this.navegacion);
    this.SelectedElement("Documento", this.navegacion);
  }

  public PageCurrent(page: any) {
    this.pagecurrent = page;
  }

  // Abrir categoria
  public OpenCategory(cat: kcp_item): void {
    this.RemoveHide(cat.subitems);
    if ((cat.subitems.length == 1 && cat.subitems[0].name == '.') || cat.itemtype < eItems.cCONTAINER){
      return;
    }
    if (this.getStatistics(cat.subitems).allempty) return;


    // Titulo e imagen
    this.categoryName = cat.name;
    this.categoryTitle = this.ChoiceTitle(cat.title);
    this.categoryImg = cat.urlimg == '' ? 'assets/categories/' + cat.itemtype + '.png' : cat.urlimg;
    this.selectedElement = cat.name;

    // 1º Guarda en la pila el contenedor donde entramos
    this.stackPath.push(cat);
    /*
      2º Genera el PATH actual, fusionando los contenedores
      donde hemos entrado apilados y muestra el PATH
    */
    this.path = this.getPath(this.stackPath);

    this.navegacion = cat.subitems;
    this.paginador.DataSource = this.navegacion;
    this.paginador.InitPaginator();
    this.paginador.setCurrentPage(1);
    this.selCat = cat.subitems[0];
    this.selectedElement = this.selCat.name;
    this.stackPage.push(this.pagecurrent);
    this.statisc = this.getStatistics(this.selCat.subitems);


    // Enviar datos al header
    this.SendMsgToHeader(cat);

    this.PathChange.next(this.path);
  }

  // Volver a la categoria anterior
  public PreviousCategory(): void {
    switch (this.stackPath.length) {
      case 1:  // Si tiene el último elemento previo al raiz, carga raiz
        this.stackPath = [];
        this.navegacion = this.DataSource;
        this.paginador.DataSource = this.navegacion;
        this.paginador.InitPaginator();
        this.paginador.setCurrentPage(this.stackPage.pop()!);
        this.path = this.getPath(this.stackPath);
        this.stackPage = [];
        this.selCat = this.DataSource[0];
        this.statisc = this.getStatistics(this.selCat.subitems);
        this.selectedElement = this.selCat.name;
        this.categoryName = "Inicio"
        this.categoryTitle = "Raíz del portafolio"
        this.categoryImg = "assets/home-big.png"
        this.ReSendOldHeaderData();
        break;
      default: // Resto de anidamientos es el anterior y lo quita de la plila
        let nav: kcp_item;
        nav = this.stackPath[this.stackPath.length - 2];
        this.navegacion = nav.subitems; //this.stackPath[this.stackPath.length - 2].subitems;
        this.categoryName = nav.name; //this.stackPath[this.stackPath.length-2].name;ç
        this.categoryTitle = this.ChoiceTitle(nav.title); //this.stackPath[this.stackPath.length-2].name;ç
        this.categoryImg = nav.urlimg == '' ? 'assets/categories/' + nav.itemtype + '.png' : nav.urlimg;
        this.stackPath.pop();
        this.path = this.getPath(this.stackPath);
        this.paginador.DataSource = this.navegacion;
        this.selCat = this.navegacion[0];
        this.statisc = this.getStatistics(this.selCat.subitems);
        this.selectedElement = this.selCat.name;
        this.paginador.InitPaginator();
        this.paginador.setCurrentPage(this.stackPage.pop()!);
        // Enviar datos al header
        this.SendMsgToHeader(nav);
    }
    this.PathChange.next(this.path);
  }

  // Ir al inicio de la jerarquía de objetos del portafolios
  public Home(): void {
    while (this.stackPage.length != 0) this.PreviousCategory();
  }

  // Seleccionar categoria
  public CatInfo(cat: kcp_item): void {

    this.statisc = this.getStatistics(cat.subitems);
    this.selCat = cat;
    this.selectedElement = cat.name;


  }

  /*** ----------------- GESTIÓN DE PATHS (RUTAS) -------- */

  // Genera el path a partir de una pila de navegación
  public getPath(navegation: kcp_item[]): string {
    let result: string = "/";
    let names: string[] = [];
    if (navegation != undefined) {
      navegation.map(e => names.push(e.name));
      result = names.join("/");
    }
    return "/".concat(result);
  }

  // Ir a un path especificado
  public GoToPath(path: string) {

    let data: kcp_item[] = this.DataSource;
    let initPath: string = path.concat("/");
    let parts: string[] = initPath.split("/");
    let enterTo: kcp_item;

    try {
      this.stackPage = [];
      this.stackPath = [];
      // Navegar hasta el último elemento de la ruta
      parts.forEach(element => {
        if (element != '') {
          enterTo = data.filter(key => key.name == element)[0];
          if (enterTo != undefined) this.OpenCategory(enterTo);
          data = enterTo.subitems;
        }
      });


    } catch (error) { }

  }

  // Devuelve las estadistiscas de contenedor
  public getStatistics(cat: kcp_item[]): ContainerStatistics {
    let resultst: ContainerStatistics = new ContainerStatistics();
    cat.forEach(result => {
      if (!result.hide) {
        switch (result.itemtype) {
          case 5:
          case 6:
          case 7:
            if (result.name != '.') resultst.container++;
            break;
          case 0:
            resultst.web++;
            break;
          case 3:
            resultst.links++;
            break;
          case 1:
            resultst.presentation++;
            break;
          case 2:
            resultst.work++;
            break;
          case 4:
            resultst.download++;
            break;
        }
      }
    });
    resultst.allempty = (resultst.container == 0 && resultst.web == 0 && resultst.presentation == 0 && resultst.work == 0 && resultst.links == 0 && resultst.download == 0);
    resultst.total = resultst.container + resultst.web + resultst.presentation + resultst.work + resultst.links + resultst.download;
    return resultst;
  }

  /*
    Devuelve el ICONO correspondiente al item
    sea icono estándar o la imagen seleccionada
    desde el programa de administrador
  */
  public createIcon(element: kcp_item) {
    let result: string = "";
    let assets: string = 'assets/categories/';

    if (element.urlimg !== '') {
      result = element.urlimg;
    } else {
      if (element.itemtype >= eItems.cCONTAINER && element.itemtype <= eItems.cLINK_COLLECTION) {
        if (element.subitems.length == 1 && element.subitems[0].name == '.') {
          result = assets + element.itemtype + ".png";
        } else {
          if(element.subitems.length==0){
            result = assets + element.itemtype + ".png";
          }else{
            result = assets + element.itemtype + "f.png";
          }

        }
      } else {
        result = assets + element.itemtype + ".png";
      }
    }
    return result;
  }

  // Devuelve un string indicando el tipo de item
  public getItemType(element: kcp_item): string {
    let ret: string = "";
    switch (element.itemtype) {
      case 0:
        ret = "Página web";
        break;
      case 1:
        ret = "Presentación";
        break;
      case 2:
        ret = "Trabajo del portafolio";
        break;
      case 3:
        ret = "Enlace"
        break;
      case 4:
        ret = "Descarga"
        break;
      case 5:
      case 6:
      case 7:
        ret = "Contenedor de objetos"
        break;
    }
    return ret;
  }

  // Devuelve TRUE si es un contenedor
  public isContainer(element: kcp_item): boolean {
    return element.itemtype >= 5 && element.itemtype <= 7;
  }

  /*
    Devuelve un ICONO de assets específico para el
    botón de selección de ITEM
  */
  public getIconButton(element: kcp_item): string {
    let icons: string[] =
      [
        'assets/webb.png',   // 0 Web
        'assets/preb.png',   // 1 Presentation
        'assets/workb.png',  // 2 Trabajo
        'assets/enlace0.png',  // 3 Enlace
        'assets/downb.png'   // 4 Descarga
      ];
    return icons[element.itemtype];
  }

  public SendMsgToHeader(item: kcp_item): void {
    // Mensaje al header
    this.msgToHeader.name = item.name
    this.msgToHeader.title = this.ChoiceTitle(item.title, true, true);
    this.msgToHeader.path = this.path;

    // Crear la imagen de icono
    if (item.urlimg == '') {
      if (item.subitems.length == 0) {
        this.msgToHeader.ilustration = "assets/categories/" + item.itemtype + ".png";
      }
      else {
        this.msgToHeader.ilustration = "assets/categories/" + item.itemtype + "f.png"
      }
    } else
      this.msgToHeader.ilustration = item.urlimg;
    {

    }

    this.msg2.Emit(this.msgToHeader, msgType.ADDITIONAL);
  }

  public ReSendOldHeaderData(): void {
    let data: string[] = [];
    data.push(sessionStorage.getItem("title")!);
    data.push(sessionStorage.getItem("subtitle")!);
    data.push(sessionStorage.getItem("author")!);
    data.push(sessionStorage.getItem("image")!);
    this.msg2.Emit(data, msgType.ADDITIONAL);
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
    return ret;
  }

  public Exit(): void { this.ExitNavigator.emit(true); }

  /**
   * Ordena un kcp_item[] según un criterio
   * @param field Campo: orderitem, type o name
   * @param matrix  Matriz a ordenar de tipo kcp_item
   */
  public OrderBy(field: string, matrix: kcp_item[]) {
    switch (field) {
      case "orderitem":
        matrix.sort((a, b) => { return a.itemorder - b.itemorder });
        this.msg_order = "Objetos ordenados por el índice del ítem";
        break;
      case "name":
        this.msg_order = "Objetos ordenados por el nombre";
        matrix.sort((a, b) => {
          let result: number = 0;
          if (a.name == b.name) result = 0;
          if (a.name > b.name) result = 1;
          if (a.name < b.name) result = -1;
          return result;
        });
        break;
      case "type":
        this.msg_order = "Objetos ordenados por el tipo de ítem";
        matrix.sort((a, b) => { return a.itemtype - b.itemtype });
        break;
    }
  }



  public getRandomID(maxLen: number): string {
    let aleatoriedad: number = 7;
    let data: string[] = ['a', 'B', 'c', 's', 'y', 'x', 'Z', '9'];
    let result: string = "";
    for (let i: number = 0; i < maxLen; i++) {
      let car: number = Math.floor(Math.random() * aleatoriedad);
      result = result.concat(data[car]);
    }
    return result;
  }

  /**
   * Borra de un Array de kcp_item el elemento que este con HIDE=true
   * @param items
   */
  private RemoveHide(items: kcp_item[]) {
    let count: number = 0;
    items.forEach(e => {
      if (e.hide) {
        items.splice(count, 1);

      }
      count++;
    });


  }



  public async ShowDocument(item: kcp_item) {
    // Obtiene el PATH de un documento y se lo pasa el componente OBJECTS
    let docPath: string = "";
    await this.pf.GetItemPath(item.iitem).then(data => {
      docPath = data[0]
    });

    this.r.navigate([CNWithOutParams(RUTAS.OBJECTS), KCP_Path_To_Objects_Format(docPath)]);
  }

  // ----------- "Infla" un JSON tags en un array de String ------
  public InflateTags(text: string): string[] {
    let ret: string[] = [];
    if (text != '') ret = JSON.parse(text);
    return ret
  }

  /**
   * Saltar a la búsqueda de un TAG
   * @param tag
   */
  public SearchFromTag(tag:string){
    $('#infoItem').modal('hide');

    // -- Lanzar la búsqueda --
    let keySearch:string="";
    keySearch = this.e.MakeKeySearchForTag(tag);
    this.r.navigate([CNWithOutParams(RUTAS.SEARCH), keySearch]);
  }
}
