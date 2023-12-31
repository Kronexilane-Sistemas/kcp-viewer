/**
 *                 StringCodify
 * Codificación de cadenas para almacenamiento seguro
 */

// Tipos de funciones de codificación
type CodifyFunction = (str: string) => string;
// Codificador de cadenas extraño
// mediante patrón Singletron
export class UglyString {
  private static instance: UglyString;
  private source!: string;
  private fCodify!: CodifyFunction;
  private fDecodify!: CodifyFunction;
  private CodifyOnly!:string[];
  private field!:string;

  // Singletron (instancia única);
  private constructor() { }
  public static getInstance(): UglyString {
    if (!this.instance) {
      this.instance = new UglyString();
    }
    return this.instance;
  }

  // Establece el nombre de campo que se codificará
  public setField(f:string){
    this.field=f;
  }
  // Sólo se codifican los campos pasados a setField
  // contenidos en este ARRAY.
  public setCodifyOnly(v:string[]){
    this.CodifyOnly=v;
  }


  public setSource(src: string): void {
    this.source = src;
  }

  // Poner las funciones que codifican/descodifican
  public setFunctions(a: CodifyFunction, b: CodifyFunction) {
    this.fCodify = a;
    this.fDecodify = b;
  }

  // Codificación y decodificación
  public Codify(): string {
    let result!:string;
    let CodOnly:string[]=this.CodifyOnly.filter(e=>e==this.field);

    if(CodOnly.length!=0){
      result=this.fCodify(this.source);
    }else{
      result=this.source;
    }
    return result;
  }

  public Decodify(): string {
    let result!:string;
    let CodOnly:string[]=this.CodifyOnly.filter(e=>e==this.field);

    if(CodOnly.length!=0){
      result=this.fDecodify(this.source);
    }else{
      result=this.source;
    }
    return result;
  }
}

