
import { APPSettings } from 'src/app/services/config.app.service';
import { kcp_item_result_founded } from './search.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { STD } from 'src/app/services/global.data';
import { API } from 'src/app/services/global.api';
import { APPLoginService } from 'src/app/services/login/app.login.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchMAPS } from './search-map';
import { Observable, Subject } from 'rxjs';

/**
 * Servicio del Motor de Búsqueda del Contenedor de Portafolios
 * @export
 * @class SearchEngineService
 */

export enum SearchTYPES {
  simple = 0,
  advanced,
  tag,
  date
}

export enum SearchMessages {
  close_advanced_search = 0,
}

@Injectable({
  providedIn: 'root'
})
export class SearchEngineService {


  // Servicio de mensajeria
  private message: Subject<SearchMessages> = new Subject<SearchMessages>();

  /** --------------------------------------------------------------------- */
  //  MAPEADO DE PARÁMETROS DE BÚSQUEDA CON CAMPOS DE FORMULARIO REACTIVO -
  /** --------------------------------------------------------------------- */

  // -- FORMULARIO DE BÚSQUEDA AVANZADA --
  public AdvancedSearchMAP =
    {
      Text: "text",
      Tags: {
        value: "tags",
        transform: (data: string[]) => data.join(",")
      },
      Types: {
        value: "items",
        translate: [
          ["Web", 0],
          ["Presentación", 1],
          ["Trabajo", 2],
          ["Enlace", 3],
          ["Descarga", 4],
          ["Contenedor", 5],
          ["Grupo", 6],
          ["Colección", 7]
        ],
        transform: (data: string[]) => data.join(",")
      },
      Dates: "initD,finalD",
      Title: "title",
      Type: "type"
    }

  // -- FORMULARIO DE BÚSQUEDA SIMPLE (SOLO TEXTO)

  public SimpleSearchMAP =
    {
      Text: "textFilter",
      TextIncludeJSON: true,
      TextIncludeTAGS: true,
      TextIncludeHTML: true,
    }

  /** ------------------------------------------------------------------ */
  //  FIN DE MAPEADO DE PARÁMETROS DE BÚSQUEDA  DE FORMULARIO REACTIVO -
  /** ------------------------------------------------------------------ */
  constructor
    (
      private config: APPSettings,
      private http: HttpClient,
      private logOn: APPLoginService
    )
    {}

  /**
   * LLama a la API de búsqueda
   * @param Parameters
   * @returns
   *
   * Parameters: Hashmap con el siguiente formato -
   *
   */
  async SearchItems(Parameters: Map<string, any>): Promise<kcp_item_result_founded[]> {
    let urlBackend: string = "";
    let result!: any;
    await this.config.BACKEND(STD).then(url => { urlBackend = url })
    await this.http.post<kcp_item_result_founded>(urlBackend.concat(API.SEARCH_ITEMS), Parameters, this.logOn.HeaderSettingsPUT()
    ).toPromise().then(data => { result = data }).catch(error => { result = error });
    return result;
  }

  /**
   * Devuelve los tags de un portafolio
   * @param path
   * @returns
   */
  async getTags(portfolio: string): Promise<any> {
    let urlBackend: string = "";
    let result!: any;
    await this.config.BACKEND(STD).then(url => { urlBackend = url })
    await this.http.get<string[]>(urlBackend.concat(API.GET_ITEM_TAGS), this.logOn.HeaderSettingsGET({ Portfolio: portfolio })
    ).toPromise().then(data => { result = data }).catch(error => { result = error });
    return result;
  }

  /* ------- PROPIEDADES ESPECÍFICAS ---------------- */

  /**
   * Devuelve si esta activo o no el caché de búsqueda
   * @returns
   */
  public getCached(): boolean {
    let value: any = sessionStorage.getItem("search_caching");
    return value != undefined && value == "true";;
  }

  /** ----------------- MENSAJERIA ------------------------- */
  /**
   * Envio de un mensaje hacía otro componente
   * @param msg
   */
  public SendMessage(msg: SearchMessages) {
    this.message.next(msg);
  }

  /**
   * Recepción del mensaje desde el componente destino (suscripción)
   * @returns
   */
  public getMessage(): Observable<SearchMessages> {
    return this.message.asObservable();
  }

  /*
    ---------------------------------------------
    Funciones de construcción del KEY de búsqueda
    ---------------------------------------------
  */

  /**
   * MakeKeySearch genera el KEY de búsqueda para el componente SEARCH
   * @param tipo  Tipo de búsqueda que preselecciona la tabla de equivalencias con el form
   * @param Form  Formulario de búsqueda
   * @returns
   */
  public MakeKeySearch(tipo: SearchTYPES, Form: FormGroup): string {
    let _keyGenerate: string = "";
    let _dataTransform!: any;
    let _form!: FormGroup;
    let _mapApiParameter: any = new ArrayBuffer(1024);

    _form = Form;


    // -- Selección de los parámetros en función del tipo de búsqueda
    switch (tipo) {
      case SearchTYPES.simple:
        _dataTransform = SearchMAPS.SSimple;
        break;
      case SearchTYPES.advanced:
        _dataTransform = SearchMAPS.SAdvanced;
        break;
      case SearchTYPES.tag:
        _dataTransform = SearchMAPS.STag;
        break;
      case SearchTYPES.date:
        _dataTransform = SearchMAPS.SDate;
        break;
    }


    try {
      for (let e in _dataTransform) {
        let Ovalue: any = (_dataTransform[e]);
        let value: string = "";
        if (typeof (Ovalue) == "object") {
          value = Ovalue.value;
        } else {
          value = (Ovalue as string);
        }
        let subField: string[] = value.split(",");
        let subValues: string[] = [];
        if (subField.length > 1) {
          for (let e of subField) {
            if (_form.controls[e].value !== '')
              subValues.push(_form.controls[e].value);
          }
          if (subValues.length != 0) {
            let result: string = subValues.length == 1 ? subValues[0] : subValues.join(",");

            if (typeof Ovalue === 'object') result = Ovalue.transform(result);
            _mapApiParameter[e] = result;
          }
        }
        else {
          let MapaT!: Map<any, any>;
          if (typeof (Ovalue) == "object") {
            let valor = _form.controls[value].value;
            if (Ovalue.translate != undefined) {
              MapaT = new Map<any, any>(Ovalue.translate);
            }
            if (_form.controls[value].value != '') {
              if (MapaT != undefined && typeof valor === 'object') {
                let newValue: any[] = [];
                for (let x of valor) {
                  newValue.push(MapaT.get(x));
                }
                valor = newValue;
              }
              if (Ovalue.transform != undefined) {
                _mapApiParameter[e] = Ovalue.transform(valor);
              }
              else {
                _mapApiParameter[e] = valor;
              }
            }
          }
          else {
            if (_form.controls[value].value != '')
              _mapApiParameter[e] = _form.controls[value].value;
          }

        }
        Ovalue = null;
      }
      _keyGenerate = this.URLEncodeParams(_mapApiParameter);


    } catch (error) {
            console.error("Error en MakeKeySearch: La correspondencia parámetros de búsqueda <-> Campos de FormGroup no es válida.", error);
    }
    return _keyGenerate;
  }

  /**
   * Genera el Key Search de búsqueda para un TAG
   * @param tag
   */
  public MakeKeySearchForTag(tag: string): string {

    // Formulario "Virtual"
    let formulario: FormGroup = new FormGroup({
      tag: new FormControl(tag),
      Title: new FormControl(`Resultados para '${tag}'`),
      Type: new FormControl(1)
    });
    return this.MakeKeySearch(SearchTYPES.tag, formulario);
  }

  /**
   * Genera el Key Search de búsqueda para un TAG
   * @param tag
   */
  public MakeKeySearchForDate(date: string): string {

    // Formulario "Virtual"
    let formulario: FormGroup = new FormGroup({
      date: new FormControl(date),
      Title: new FormControl(`Búsqueda para la fecha ${date}`),
      Type: new FormControl(1)
    });
    return this.MakeKeySearch(SearchTYPES.date, formulario);
  }

  //  -- Funciones auxiliares --

  /**
   * Codificar un objeto de parámetros de búsqueda para la URL del componente SEARCH
   * @param params
   * @returns
   */
  public URLEncodeParams(params: any): string {
    let code: string = encodeURI(btoa(JSON.stringify(params)));
    return code;
  }

  /**
   * Deodifica un objeto de parámetros de búsqueda para la URL del componente SEARCH
   * @param params
   * @returns
   */
  public URLDecodeParams(params: string): any {
    let decode1 = decodeURI(params);
    let decode2: string = atob(decode1);
    let decode3: any = JSON.parse(decode2);
    return decode3;
  }
}



