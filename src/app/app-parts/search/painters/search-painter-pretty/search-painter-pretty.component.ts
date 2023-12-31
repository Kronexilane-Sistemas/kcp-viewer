import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { kcp_item_result_founded } from '../../search.model';
import { Router } from '@angular/router';
import { SearchEngineService } from '../../search-engine.service';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';

@Component({
  selector: 'app-search-painter-pretty',
  templateUrl: './search-painter-pretty.component.html',
  styleUrls: ['./search-painter-pretty.component.scss']
})
export class SearchPainterPrettyComponent implements OnInit {
  @Input() fragment!: kcp_item_result_founded[];
  @Input() config!: any;
  @Output() itemselected: EventEmitter<kcp_item_result_founded> = new EventEmitter<kcp_item_result_founded>();

  constructor(private r: Router, private e: SearchEngineService) { }

  ngOnInit(): void {
  }
  public verifyImg(imgUrl: string) {
    const miUrl = new URL(imgUrl);
    let ret: string = "";
    try {
      ret = imgUrl;
    } catch {
      ret = "assets/header.jpg";
    }
  }

  /** Envia al componente SEARCH el item seleccionado */
  public ItemSelected(item: kcp_item_result_founded) {
    this.itemselected.emit(item);
  }

  /** Selección de imagen */
  public getImage(item: kcp_item_result_founded) {
    let img: string;
    if (item.img_resume == '' || item.img_resume == null) {
      switch (item.itemtype) {
        case 3:
          img = "assets/search-card-link.png";
          break;
        case 4:
          img = "assets/search-card-download.png";
          break;
        case 5:
        case 6:
        case 7:
          img = "assets/search-card-container.png";
          break;
        default:
          img = "assets/search-card-default.png";
      }
    } else {
      img = item.img_resume.replace('"', '').replace('"', '');
    }
    return img
  }


  /**
   * Devuelve el título del resumen si es un objeto que contiene resumen.
   * Si el objeto no contiene resumen, devuelve el título del objeto KCP.
   * */
  public getTitle(item: kcp_item_result_founded) {
    let ret: string = "";
    switch (item.itemtype) {
      case 0:
      case 1:
      case 2:
        ret = item.title_resume == null ? item.title : item.title_resume;
        break;
      default:
        ret = item.title;
    }
    if (ret) ret = ret.replace('"', '').replace('"', '');
    return this.ChoiceTitle(ret);
  }

  /**
   * Devuelve el subtítulo del resumen si es un objeto que contiene resumen.
   * Si el objeto no contiene resumen, devuelve el sutítulo del objeto KCP.
   * */
  public getSubTitle(item: kcp_item_result_founded) {
    let ret: string = "";
    switch (item.itemtype) {
      case 0:
      case 1:
      case 2:
        ret = item.subtitle_resume == null ? item.subtitle : item.subtitle_resume;
        break;
      default:
        ret = item.subtitle;
    }
    if (ret) ret = ret.replace('"', '').replace('"', '');
    return ret;
  }

  /** Devuelve el texto del resumen sin comillas */
  public getResume(item: kcp_item_result_founded): string {
    let ret: string = "";
    try {
      ret = item.text_resume.replace('"', '').replace('"', '');
    }
    catch {
      ret = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, dicta. Facilis dignissimos ullam laudantium qui at nam atque omnis autem esse delectus, dolorem voluptate assumenda incidunt, sit est ea, facere ut repellat! Laboriosam sint pariatur assumenda magnam praesentium eum possimus.";
    }
    return ret;
  }

  /**
   * Saltar a la búsqueda de un TAG
   * @param tag
   */
  public SearchFromTag(tag: string) {
    // -- Lanzar la búsqueda --
    let keySearch: string = "";
    keySearch = this.e.MakeKeySearchForTag(tag);
    this.r.navigate([CNWithOutParams(RUTAS.SEARCH), keySearch]);
  }

  /** Va al elemento correspondiente  */
  public IrA(item: kcp_item_result_founded): void {
    this.itemselected.emit(item);
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
          if (ratio < 1.77) {
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
