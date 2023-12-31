import { MessengerService, msgType } from 'src/app/services/messenger.service';
import { Router } from '@angular/router';
import { kcp_item } from './../app-parts/categories/categories.model';
import { Component, OnInit } from '@angular/core';
import { PortfolioHeaderService } from '../services/portfolio/portfolio-header.service';


@Component({
  selector: 'app-pagemenu',
  templateUrl: './pagemenu.component.html',
  styleUrls: ['./pagemenu.component.scss']
})
export class PagemenuComponent implements OnInit {
  public MenuContainer?: kcp_item;

  constructor(
    private router: Router,
    private pheader:PortfolioHeaderService,
    private msg:MessengerService ) {
    // Leer el menu
    this.pheader.getMenu("footer").then(data => {
      this.MenuContainer = data;
      this.msg.Emit([data!=null], msgType.REFRESH);
      if(data!=null) {
        this.OrderBy("orderitem",this.MenuContainer.subitems);
      }
    }
  );

  }
  ngOnInit(): void {}

  /**
   * Lanza un componente angular con una ruta de parámetros
   * @param url ruta en formato:
   *             componente/PARAMETRO1/PARAMETRO2/...
   */
  public GoAngularRoute(url: string) {
    alert(url);
    let div:string[]=url.split("/");
    this.router.navigateByUrl(url, { skipLocationChange: true }).then(() => {
      this.router.navigate([div[0]]);
    });
  }

  /**
   * Ordena un kcp_item[] según un criterio
   * @param field Campo: orderitem, type o name
   * @param matrix  Matriz a ordenar de tipo kcp_item
   */
  public OrderBy(field: string, matrix: kcp_item[]) {
    switch (field) {
      case "orderitem":
        matrix.sort((a, b) => { return a.itemorder - b.itemorder });
        break;
      case "name":
        matrix.sort((a, b) => {
          let result: number = 0;
          if (a.name == b.name) result = 0;
          if (a.name > b.name) result = 1;
          if (a.name < b.name) result = -1;
          return result;
        });
        break;
      case "type":
        matrix.sort((a, b) => { return a.itemtype - b.itemtype });
        break;
    }
  }

}
