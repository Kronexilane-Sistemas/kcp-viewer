import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

// Declaramos las variables para jQuery
declare var $: any;


@Component({
  selector: 'app-doccontent',
  templateUrl: './doccontent.component.html',
  styleUrls: ['./doccontent.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
    '(window:maximize)': 'onMaximize($event)'
  }
})

export class DoccontentComponent implements OnInit {

  // Inyección de parámetros de inflado.
  @Input("parameters") data!: any;
  @Output("linkto") LinkTo:EventEmitter<string>=new EventEmitter<string>();

  public parameters!: Map<string, any>;
  public currentwidth:number=screen.width/2;
  public currentheigth:number=screen.width/3;

  constructor() { }

  onResize(event:any){
    if(this.parameters.has('mediatype') && this.parameters.get('mediatype')=='youtube-video' && !this.parameters.get('text')){
      this.currentwidth=screen.width/2;
      this.currentheigth = screen.width / 3;
    }
  }
  ngOnInit(): void {
    // Pone los parámetros en un objeto map
    const res = Object.entries(this.data);
    this.parameters = new Map<string, any>(res);
  }

  // Salto si el bloque de texto (o de contenido) tiene un href
  public JumpTo(url:string):void{
    if(url==undefined || url=='') return;
    this.LinkTo.emit(url);
  }

  // Separación de dos cadenas de texto
  public getPartOf(source:string,index:number,separator:string):string{
    return source.split(separator)[index];
  }
}
