import { kcp_item } from './../../../categories/categories.model';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ButtonScrollingFunction, ButtonScrollingToolbar } from 'src/app/plugins/button-scrolling/button-scrolling.interfaces';

// Declaramos las variables para jQuery
declare var $: any;

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  @Input("item") docitem: kcp_item | undefined;
  @Output("jumpcontent") hrefjump: EventEmitter<string[]>=new EventEmitter<string[]>();


  public parametrosHeader:any;
  public parametrosFooter:any;


  constructor() {

  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.parametrosHeader=this.docitem?.documentflow[0];
    this.parametrosFooter=this.docitem?.documentflow[2];
  }


  // Recibe del DOCCONTENT un CLICK de salto HREF y sale hacia afuera (OBJECTS)
  public ContentHREF(url:string){
    this.hrefjump.emit(url.split("|"))
  };

  /**
   * Función VOLVER para el control Scrolling Button cuando
   * esta es de tipo 'previous' (vuelta atrás)
   * @returns
   */
  public Volver():ButtonScrollingFunction{
    // Clase interna de tipo ButtonScrollingFunction para pasarla al componente
    // que define una función de atrás junto al botón de arriba
    class IrAtras implements ButtonScrollingFunction{
      private data:string | undefined;

      constructor(parametro:string){
        this.data=parametro;
      }

      // Esto es lo que ejecutar el control
      Execute(): void {
        alert(this.data);
      }
    }
    return new IrAtras("Se lo paso desde el entorno de el componente");
  }

  /**
   * Botones de ScrollingButton Toolbar
   * @returns
   */
  public Botones():ButtonScrollingToolbar[]{
    // 1ª Forma de añadir botones
    let result:ButtonScrollingToolbar[]=[
      {
        "img": "printer.png",
        "text": "Imprimir",
        "tooltip": "Imprimir esta página",
        "execute": () => {
          window.print();
        }
      },
      {
        "img": "flecha.png",
        "text": "Recargar",
        "tooltip": "Recargar actual",
        "execute": () => {
          window.location.reload();
        }
      },
    ];

    // Devuelve al control Scrolling Button los botones de la Toolbar activable por ESC
    return result;
  }

}

