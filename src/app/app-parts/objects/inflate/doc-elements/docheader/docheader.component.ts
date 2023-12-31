import { kcp_item } from './../../../../categories/categories.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Key } from 'readline';

/**
 * Task list de este componente:
 * 1. Combinación adecuada de formato para el modo PRESENTATION o WORK:
 * 2. Fecha/Hora y enlaces TAG con evento de salto en modo WORK:
 * 3. Adecuación Responsive:
/**
 *
 *
 * @export
 * @class DocheaderComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-docheader',
  templateUrl: './docheader.component.html',
  styleUrls: ['./docheader.component.scss']
})
export class DocheaderComponent implements OnInit {

 @Input("kcp-item") docitem: kcp_item | undefined;
 @Input("parameters") data!:any;
 @Output("jumpheader") jumpdata:EventEmitter<string>=new EventEmitter<string>();

 public parameters!:Map<string,any>;;



 constructor() { }

 ngOnInit(): void {
      // Pone los parámetros en un objeto map
      //const res=Object.entries(this.data);
      //this.parameters=new Map<string,any>(res);
      this.parameters=this.data;
  }

  /**
   * Salta al exterior con un dato del header
   * separado con el carácter |
   * Campo 0 (izquierda) especificador (date/tag ...)
   * Campo 1 (derecho), dato en sí
   * @param data
   */
  public JumpTo(data:string):void{
    this.jumpdata.emit(data);
  }

  /**
   * Selecciona la imagen del docHeader
   * Si en la posicion 1 del documentflow existe el docresume
   * utilizará la imagen definida en el campo img, de lo contrario
   * utilizará la imagen definida en kcpitem mediante urlimg
   * @param docitem
   */
  public SelectImage(docitem:kcp_item):string{
    let result:string="";
    let documentflow:Map<string,any>[] = docitem.documentflow;
    let resume:any=documentflow.find(e=>e.has('name') && e.get('name')=='docresume');

    if(resume!=undefined){
      let res:Map<string,any>=(resume as Map<string,any>)
      if(res.has('img') && res.get('img')!=''){
        result=res.get('img');
      }else{
        result = docitem.urlimg;
      }
    }else{
      result=docitem.urlimg;
    }
    return result;
  }

  // Formateo simple de Fecha
  public getSimpleDate(data: Date): string {
    let dato = new Date(data);
    return dato.toLocaleString();
  }
}

