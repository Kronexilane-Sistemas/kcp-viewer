/**
 * KRNAPIResponse
 * Respuesta estructurada de la API de Kronexilane Sistemas
 */

export class KRNAPIResponse{
  public msgid:number=0;
  public title: string = "";
  public msg: string = "";
  public data: string = "";
}
/**
 * Tipo de Error estándar codificado por las
 * funciones WEB Rest del núcleo SPRINGBoot
 */
export class HTTPBackEndError {
  public error: string = "";
  public message: string = "";
  public path: string = "";
  public status: number | undefined;
  public timestamp: string = "";
}


/* ------------------------------------
       CLASES DE DATOS GENERALES
   ------------------------------------
*/

// Objeto soporte para Login de usuario
export class kcp_user_login {
  public username: string | undefined;
  public password: string | undefined;
  constructor(user: string, password: string) {
    this.username = user;
    this.password = password;
  }
}

/* --------------------------------------
     SOPORTE PARA GESTIÓN DE PARÁMETROS
   --------------------------------------
*/
export class kcp_setting {
  public settingname: string | undefined;
  public settingvalue: string | undefined;
  constructor(name: string, value: string) {
    this.settingname = name;
    this.settingvalue = value;
  }
}

/* ------------------------------------
    SOPORTE PARA GESTIÓN DE AUDITORIAS
   ------------------------------------
*/

export class audit_description {
  public view: string = "";
  public description: string = "";
}

export class view_column {
  public column_name: string = "";
  public data_type: string = "";

  public constructor(column:string,datatype:string){
    this.column_name=column;
    this.data_type=datatype;
  }
}

export class audit_parameters {
  public viewName:string="";
  public columns:string="*";//|undefined;
  public beginDate:string|undefined;
  public endDate:string|undefined;
  public searchColumn:string|undefined;
  public searchContent:string|undefined;
  public orderColumn:string|undefined;
  public descendingOrder:boolean|undefined;

  public constructor(view:string){
    this.viewName=view;
  }

  public setColumns(value:string){
    this.columns=value;
  }

  public setBeginDate(value:string){
    this.beginDate=value;
  }
  public setEnDate(value:string){
    this.endDate=value;
  }
  public setSearchColumn(value:string){
    this.searchColumn=value;
  }
  public setSearchContent(value:string){
    this.searchContent=value;
  }
  public setOrderColumn(value:string){
    this.orderColumn=value;
  }
  public setDescendingOrder(value:boolean){
    this.descendingOrder=value;
  }

}

/*------------------------------------------------*/
/* Información de múltiples portafolios al inicio */
/* -----------------------------------------------*/
export class morePortfolio{
  public name!:string;
  public user!:string;
  public password!:string;
  public description!:string;
  public img!:string;
  public default!:boolean;
}
