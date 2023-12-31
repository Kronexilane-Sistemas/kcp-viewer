
import { ActivatedRoute, Router } from '@angular/router';
import { kcp_item } from './../categories/categories.model';
import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PortfolioHeaderService } from 'src/app/services/portfolio/portfolio-header.service';
import { KRNAPIResponse } from 'src/app/services/model/global.entity';
import * as shajs from 'sha.js';
import { AppProgressComponent } from 'src/app/plugins/app-progress/app-progress.component';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';
import { SearchEngineService } from '../search/search-engine.service';

declare var $: any;

/**
 * Función global JAVASCRIPT/TYPSCRIPT
 * Transforma un PATH de KCP (Portafolio://elemento1/elemento2) en otro
 * entendible por el componente objects (Portafolio.elemento1.elemento2.elementoN)
 * @param path
 */
export function KCP_Path_To_Objects_Format(path: string) {

  let result: string = '';

  let part1 = path.split("://");
  if (part1.length >= 0) {
    result = result.concat(part1[0]).concat(".");
    path = path.replace(part1[0].concat("://"), "");
    let part2 = path.split("/");
    result = result + part2.join(".");
  }

  return result == '' ? path : result;
}

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.scss']
})
export class ObjectsComponent implements OnInit {

  public error: string = "";
  public identify!: string;
  public docOK: boolean = false;
  public msgPassword: string = "Introduzca la clave de acceso"

  @ViewChild('progress1') progreso!: AppProgressComponent;

  constructor(
    private route: ActivatedRoute,
    private items: PortfolioHeaderService,
    private router: Router,
    private e:SearchEngineService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  // El item que vamos a pasar
  public item!: kcp_item;


  /**
   * Inicio del componente, lectura de los datos del DOC
   */
  async ngOnInit(): Promise<void> {
    window.scroll(0,0);
    let docPath: any;

    // Lectura del parámetro de ruta desde el enrutador angular
    this.route.params.subscribe(async data => {
      this.identify = data.identificador;
    });


      // Composición ruta del documento
      // Paso de formato PORTAFOLIO.Elemento1.Elemento2.ElementoN
      // al formato de kcp PORTAFOLIO://Elemento1/Elemento2/ElementoN
      docPath = this.RebuildKCPPath(this.identify);

      // Lectura de los datos

      await this.items.getDoc(docPath).then(data => {

        // Si el API devuelve un error de lectura salta el componente de
        // mostrar errores
        if (data.error) {
          this.error = (data.error as KRNAPIResponse).msg;
          this.router.navigate([CNWithOutParams(RUTAS.OBJECT_ERROR), this.error]);

        } else {
          // Si no hay cabecera (recien creado) salta error y deja el flujo, en caso
          // contrario sigue con la carga del documento
          if(data.jsontext==null){
            this.router.navigate([CNWithOutParams(RUTAS.OBJECT_ERROR), "El documento está vacio."])
            return;
          }

          this.item = data;
          this.item.documentflow = JSON.parse((data as any).jsontext, this.MapDeserializer);
          this.item.tags = JSON.parse(this.item.tags);
          this.docOK = (this.item.password == '' || this.item.password == null);

        }
      }).finally(() => {
      });


    if (this.item?.password != '' && this.item?.password!=null) {
      setTimeout(() => {
        $("#passwordPetition").removeClass("d-none");
      }, 100);

    }

  }

  /**
   * Recepción de información de los elementos activos
   * elemento [0]: Tipo de información
   *               url   = url de salto directo (href)
   *               app   = url de salto de aplicación angular (routing)
   *               date  = fecha (se hizo click en la fecha del docheader - work -)
   *               tag   = tag de palabra clave (click en algún tag del docheader - work -)
   * @param data
   */
  public getDocumentInfo(data: string[]): void {

    switch (data[0]) {

      case "href":
        alert(data[1]);
        //window.location.href = data[1];
        break;
      case "app":
        alert(data[1]);
        //this.r.navigate([data[1]]);
        break;
      case "tag":
        // -- Lanzar la búsqueda --
        let keySearchTag:string="";
        keySearchTag = this.e.MakeKeySearchForTag(data[1]);

        this.router.navigate([CNWithOutParams(RUTAS.SEARCH), keySearchTag]);
        break;
      case "date":
        let keySearchDate: string = "";
        let fecha:Date=new Date(data[1]);
        let trans1:string[]=fecha.toLocaleDateString().split("/");
        for(let i:number=0;i<trans1.length;i++){
          if(trans1[i].length==1){
            trans1[i]=`0${trans1[i]}`;
          }
        };
        keySearchDate = this.e.MakeKeySearchForDate(trans1.join("-"));

        this.router.navigate([CNWithOutParams(RUTAS.SEARCH), keySearchDate]);
        break;
      default:
        alert(JSON.stringify(data))
    }
  }

  /**
   * Reconstruye una dirección de parámetro desde el url
   * a una dirección de estilo KCP
   * De:   "portafolio.contenedor.contenedor.objeto pasa a otra de
   * tipo: "portafolio://contenedor/contenedor/objeto"
   * @param path
   */
  public RebuildKCPPath(path: string) {
    if (path == '' || path == undefined) return;
    let result: string = "";
    let elements: string[] = path.split(".");
    result = elements.join("/");
    result = result.replace("/", "://");
    return result.toUpperCase();
  }

  /**
  * Deserializa un texto JSON de MAP
  * Funcion auxiliar para JSON.Parse
  * @param key
  * @param value
  * @returns
  */

  private MapDeserializer(key: any, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  /**
   * Introducción in VIVO de la clave de acceso.
   * @param keyevent
   * @param item
   */
  public ActivateLink(keyevent: any, item: kcp_item): void {
    let ok: boolean = shajs('sha1').update($("#clavePN").val()).digest('hex') == item.password;
    if (ok) {
      this.docOK = true;
      this.msgPassword = "Contraseña correcta";
    } else {
      if ($("#clavePN").val() != '') {
        this.msgPassword = "Contraseña incorrecta"
      } else {
        this.msgPassword = "Introduzca la clave de acceso";

      }
    }
  }
}
