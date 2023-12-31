import { Component, Input, OnInit, AfterContentInit, AfterViewInit, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonScrollingFunction, ButtonScrollingToolbar } from './button-scrolling.interfaces';

// Declaramos las variables para jQuery
declare var $: any;

@Component({
  selector: 'scrolling-button',
  templateUrl: './button-scrolling.component.html',
  styleUrls: ['./button-scrolling.component.scss'],
  host: {
    '(window:scroll)': 'onScroll($event)',
    '(window:keydown)': 'onKeyDown($event)',
  }
})
export class ButtonScrollingComponent implements OnInit{

  @Input('ButtonStyle') public buttontype: string = "circle";
  @Input('PreviousFunction') public previous!:ButtonScrollingFunction;
  @Input('ToolbarButtons') public ExternButtons!: ButtonScrollingToolbar[];
  public Buttons:ButtonScrollingToolbar[]=
  [
    {
      img: 'close2.png',
      text: 'ESC' ,
      tooltip: 'Activar/Desactivar barra de utilidades con tecla ESC',
      execute: function (): void {
        $("#buttonT").slideUp();
      }
    }
  ];

  constructor() {}

  ngOnInit(): void {
    if(this.ExternButtons){
      this.ExternButtons.forEach(item=>this.Buttons.push(item));
    }
  }

  // Control de aparición de los controles flotantes
  onScroll(event: any) {
    let capa:string="";
    let fin: number = Math.floor(window.scrollY + window.innerHeight);
    // Apagar cuando vuelve arriba
    if (window.scrollY == 0) {
      switch(this.buttontype){
        case "circle": // Circulo arriba
          $("#buttonC").fadeOut("slow");
        break;
        case "square": // Cuadrado arriba
          $("#buttonS").slideUp();
          break;
        case "previous": // Cuadrado previo
          $("#buttonP").slideUp();
          break;
      }
    }

    // Encender cuando baja abajo
    if (window.scrollY > 0) {
      switch (this.buttontype) {
        case "circle": // Círculo arriba
          $("#buttonC").fadeIn("slow");
          break;
        case "square": // Cuadrado arriba
          $("#buttonS").slideDown();
          break;
        case "previous": //Cuadrado previo
          if(this.previous) $("#buttonP").slideDown();
          break;
      }
    }

    // --- TRATAMIENTO DE TOOLBAR ---

    // Encender toolbar si estas abajo
    /*
    if ($(document.activeElement).height()-fin<2) {
      $("#buttonT").slideDown();
    }*/

    // Quitarla si estas arriba
    /*if (window.scrollY == 0) $("#buttonT").slideUp();*/
  }

  /** Evento OnKeyDown -- Pulsación de teclas -- */
  onKeyDown(event: any) {
    if (event.keyCode == 27 && this.buttontype == 'toolbar' && this.Buttons && this.Buttons.length>0) {
      $("#buttonT").slideToggle();
    }
  }

  // ------- *** FUNCIONES ADICIONALES ----------------

  // ----  Volver arriba ----
  public GoUp(): void {
    window.scroll(0, 0);
  }

  // ---- Ir a previo
  public GoPrevious():void{
     this.previous.Execute();
  }

  // --- Ejecutar función de TOOLBAR

  public Execute(item:ButtonScrollingToolbar){
    item.execute();
  }

}

export class option {
  public title!: string;
}
