import { PortfolioHeaderService } from './../../services/portfolio/portfolio-header.service';

import { ActivatedRoute, Router } from '@angular/router';
import { eItems } from './../categories/categories.model';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { kcp_item } from '../categories/categories.model';
import { MessengerService, msgType } from 'src/app/services/messenger.service';
import { APPLoginService } from 'src/app/services/login/app.login.service';
import { RUTAS } from 'src/app/app-routing.module';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnChanges {

  public datos: kcp_item[] = [];
  public ruta: string = "/";
  public PathParam: string = "/";
  public searchE!:string;


  // Categorias de ejemplo ARRAY Arborescente (LAS QUE DEVOLVERA EL BACKEND)

  // Objeto inicial vacio que será reemplazado.
  public categorias: kcp_item[] = [
    {
      "iitem": -1,
      "name": "Sin contenido",
      "title": "Navegador de objetos sin contenido",
      "subtitle": "Actualmente el portafolio no tiene ningún contenido. Espere a que el administrador empiece a crear contenedores, trabajos, presentaciones y enlaces a contenido.",
      "date": new Date(),
      "urlimg": "",
      "itemtype": eItems.cCONTAINER,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": []
    }
  ]

  constructor(
    private items: PortfolioHeaderService,
    private msg: MessengerService,
    private login: APPLoginService,
    private route: ActivatedRoute,
    private r: Router
  ) {
    // Reactualización de RUTAS angular
    this.r.routeReuseStrategy.shouldReuseRoute = () => false;

  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  // Lectura asincrónica de la lista de items
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(data => {
      this.PathParam = this.RebuildSimpleKCPPath(data.path);
      if(data.elemento!=undefined) this.searchE=data.elemento;
    });

    await this.items.getPortFolioItems().then(
      data => {
        this.RemoveHide(data);
        this.categorias = data
      }
    );
    // Si no hay ningún item sale con mensaje de PORTAFOLIO VACIO
    if (this.categorias.length == 0) {
      sessionStorage.clear();
      this.login.setErrorMessage(999);
      this.msg.Emit(true, msgType.LOGOUT);
    }
  }

  private RemoveHide(items:kcp_item[]){
    let count:number=0;
    items.forEach(e=>{
      if(e.hide){
          items=items.slice(count,1);
      }
      count++;
    });
  }
  /**
  * Reconstruye una dirección de parámetro desde el url
  * a una dirección de estilo KCP
  * De:   "portafolio.contenedor.contenedor.objeto pasa a otra de
  * tipo: "portafolio://contenedor/contenedor/objeto"
  * @param path
  */
  public RebuildKCPPath(path: string) {
    let result: string = "";
    let elements: string[] = path.split(".");
    result = elements.join("/");
    result = result.replace("/", "://");
    return result.toUpperCase();
  }

  public RebuildSimpleKCPPath(path: string) {
    let result: string = "";

    if (path == "" || path != undefined) {
      let elements: string[] = path.split(".");
      result = elements.join("/");
    }
    return result;
  }

  /**
   * Evento que devuelve cuando el PATH ha cambiado
   * @param newPath
   */
  public PathHasChange(newPath: string) {
    let retransform: string[] = newPath.split("/");
    let correct: string = retransform.join(".");
    let navigateComponent: string = RUTAS.NAVIGATOR.replace(":path", "");
    let url: string = navigateComponent.concat(correct);
    /**
     * La siguiente linea en TRUE (No actualiza el componente)
     * al usar navigateByURL en FALSE SÍ
    */
    //this.r.routeReuseStrategy.shouldReuseRoute = () => true;

    this.r.navigateByUrl(url);
    //this.r.routeReuseStrategy.shouldReuseRoute = () => false;

  }
}
