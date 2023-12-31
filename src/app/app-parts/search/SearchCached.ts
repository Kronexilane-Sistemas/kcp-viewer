import { ConversionUtils } from "turbocommons-ts";
import { kcp_item_result_founded } from "./search.model";

// -- Caché de búsqueda --
export class SearchCached {

  private _Time!: any;
  private _Page!: any;
  private _Data!: any;
  private _Parameters!: any;

  public constructor() {
    this._Time = sessionStorage.getItem("sc_time");
    this._Page = sessionStorage.getItem("sc_page");
    this._Data = sessionStorage.getItem("sc_data");
    this._Parameters = sessionStorage.getItem("sc_keysearch");
  }

  // -- Devuelve fecha/hora de la Caché
  public get DateTime(): Date {
    let result!: Date;
    if (this._Time != undefined) {
      result = this._Time;
    }
    return result;
  }

  // -- Devuelve el Array de datos
  public get Data(): kcp_item_result_founded[] {
    let result!: kcp_item_result_founded[];
    if (this._Data != undefined) {
      result = JSON.parse(ConversionUtils.base64ToString(this._Data));
    }
    return result;
  }

  // -- Devuelve la página en la que te quedaste
  public get Page(): number {
    let result!: number;
    if (this._Page != undefined) {
      result = this._Page;
    }
    return result;
  }

  public get KeySearch(): string {
    let result!: string;
    if (this._Parameters != undefined) {
      result = this._Parameters
    }
    return result;
  }
  // -- Devuelve True, si la caché es válida --

  public get isValid(): boolean {
    return this._Page != undefined && this.DateTime != undefined && this._Data != undefined;
  }

  // -- Método estático, devuelve TRUE si la caché esta activa -- //
  public static get CacheStatus():boolean{
    let sw: any = sessionStorage.getItem("search_caching");
    let status:boolean=false;
    if(sw!=undefined){
      if(sw=='true') status=true; else status=false;
    }else{
      status=false;
    }
    return status;
  }
}
