import { ConversionUtils } from "turbocommons-ts";

/**
 * Estructura devuelta por el API del motor de búsqueda
 */
export class kcp_item_result_founded{
  public id!:number;
  public name!:string;
  public itemtype!: number;
  public itemdescription!: string;
  public title!: string;
  public subtitle!: string;
  public title_resume!: string;
  public subtitle_resume!: string;
  public text_resume!: string;
  public img!: string;
  public img_resume!: string;
  public tags!: string[];
  public date!: string;
}





