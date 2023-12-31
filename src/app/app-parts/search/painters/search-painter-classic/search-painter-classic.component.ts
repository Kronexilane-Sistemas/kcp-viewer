import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { kcp_item } from 'src/app/app-parts/categories/categories.model';
import { kcp_item_result_founded } from '../../search.model';


@Component({
  selector: 'app-search-painter-classic',
  templateUrl: './search-painter-classic.component.html',
  styleUrls: ['./search-painter-classic.component.scss']
})
export class SearchPainterClassicComponent implements OnInit {

  @Input() fragment!:kcp_item_result_founded[];
  @Output() itemselected:EventEmitter<kcp_item_result_founded>=new EventEmitter<kcp_item_result_founded>();

  constructor() {}

  ngOnInit(): void {
    window.scroll(0,0);
  }

  /**
   * Envia al componente principal SEARCH el item seleccionado
   * @param item
   */
  public ItemSelected(item:kcp_item_result_founded){
    this.itemselected.emit(item);
  }

  /**
   * Devuelve la imagen en función del ITEM
   * (Imagenes predeterminadas del ITEM)
   * @param item
   * @returns
   */

  public getImage(item: kcp_item_result_founded) {
    let img: string;
    if (item.img == '' || item.img==null) {
      img = `assets/categories/${item.itemtype}.png`
    } else {
      img = item.img;
    }
    return img
  }
  /**
  * Ordena un kcp_item_resultfounded[] según un criterio
  * @param field Campo: orderitem, type o name
  * @param matrix  Matriz a ordenar de tipo kcp_item
  */
  public OrderBy(field: string, matrix: kcp_item_result_founded[]) {
    switch (field) {
      case "date":
        matrix.sort((a, b) => {
          let ret:number=0;
          let x:Date=new Date(this.DateStringLocalToISO(a.date));
          let y:Date =new Date(this.DateStringLocalToISO(b.date));
          ret=x.getTime()-y.getTime();
          return ret;
        });
        //this.msg_order = "Objetos ordenados por el índice del ítem";
        break;
      case "name":
        //this.msg_order = "Objetos ordenados por el nombre";
        matrix.sort((a, b) => {
          let result: number = 0;
          if (a.name == b.name) result = 0;
          if (a.name > b.name) result = 1;
          if (a.name < b.name) result = -1;
          return result;
        });
        break;
      case "type":
        //this.msg_order = "Objetos ordenados por el tipo de ítem";
        matrix.sort((a, b) => { return a.itemtype - b.itemtype });
        break;
    }
  }

  /**
   * Transforma una cadena de tipo dd/mm/yyyy hh:mm:ss
   * a un formato ISO que entienda el constructor de Date.
   * @param date
   */
  private DateStringLocalToISO(date:string){

    let hourstr:string;
    let datestr:string;

    // Separa hora y fecha
    let process:string[]=date.split(" ");

    hourstr=process[1];
    datestr=process[0];

    // Da la vuelta a la fecha y la vuelve a unir
    process=datestr.split("-").reverse();
    datestr=process.join("-");

    // Devuelve la fecha de formato dd-mm-yyyy hh:mm:ss a yyyy-mm-dd hh:mm:ss
    return `${datestr} ${hourstr}`;
  }
  /**
* Si hay dos campos separados por | elige el de la izquierda (largo) frente
* al corto (derecha) en función del ratio de pantalla (pequeña o grande)
* @param title
* @returns
*/
  public ChoiceTitle(title: string, forRatio: boolean = true, defaultLong = true): string {
    let titles: string[];
    let ratio: number = screen.width / screen.height;

    let ret: string = title;

    try {
      if (title.includes("|")) {
        titles = title.split("|");
        if (forRatio) {
          if (ratio <= 1.77) {
            ret = titles[1]; // titulo corto (ratio<1)
          } else {
            ret = titles[0]; // Titulo largo (ratio>1)
          }
        } else {
          if (defaultLong)
            ret = titles[0];
          else
            ret = titles[1];
        }
      }
    } catch {
      ret = title;
    }
    return ret;
  }

}
