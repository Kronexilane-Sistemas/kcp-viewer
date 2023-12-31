/*************************************/
/* DEFINICIÓN DINÁMICA DE ITEMS      */
/************************************/


/**
 * KCP-ITEM estándar
 */
export class kcp_item {
  iitem!: number;
  name!: string;
  title!: string;
  subtitle!: string;
  date!: Date;
  urlimg!: string;
  itemtype!: number;
  hide!: boolean;
  html!: string;
  documentflow!:any;
  href!: string;
  router!: string;
  tags!: any; //string[];
  plugins!: string;
  password!: string;
  fkprofile!:number;
  fkpreviousparent!:number;
  itemorder!:number;
  parentid!:number;
  subitems!: kcp_item[];
}

/**
 * Definición de DOCUMENTO (CAMPO TAG)
 */
export class kcp_doc {
  iitem!: number;
  name!: string;
  title!: string;
  subtitle!: string;
  date!: Date;
  urlimg!: string;
  itemtype!: number;
  hide!: boolean;
  html!: string;
  documentflow!: any;
  href!: string;
  router!: string;
  tags!: string;
  plugins!: string;
  password!: string;
  fkprofile!: number;
  fkpreviousparent!: number;
  itemorder!: number;
  parentid!: number;
  subitems!: kcp_item[];
}

// Tipos de ITEM
export enum eItems{
  dWEB=0,
  dPRESENTATION=1,
  dWORK=2,
  dLINK=3,
  dDOWNLOAD=4,
  cCONTAINER=5,
  cLINK_GROUP=6,
  cLINK_COLLECTION=7
}

// Estructura simple que soporta las estadísticas de contenedor
export class ContainerStatistics{
  public container:number=0;
  public web:number=0;
  public presentation:number=0;
  public work:number=0;
  public links:number=0;
  public download:number=0;
  public allempty:boolean=false;
  public total:number=0;
}
