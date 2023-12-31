import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';

@Component({
  selector: 'app-wrong-url',
  templateUrl: './wrong-url.component.html',
  styleUrls: ['./wrong-url.component.scss']
})
export class WrongUrlComponent implements OnInit {

  public SolutionObject!: WrongURLSolution;
  public cmp: string = "";
  public msg: string = "La ruta al recurso del portafolio no es correcta, o el recurso ya no existe.";
  public fmt: string = "";
  public icon_pred: string = "assets/warning.png";
  public error_title_pred:string="Ha ocurrido un error";
  public icon!: string;
  public title!:string;

  public Solutions: WrongURLSolution[] =
    [
      {
        "component": RUTAS.NAVIGATOR.replace("/:path", ""),
        "icon":"assets/navigator-error.png",
        "title":"Error en el navegador de items",
        "solution": "msg",
        "jump": CNWithOutParams(RUTAS.NAVIGATOR),
        "msg": "Formato incorrecto de ruta para el componente '" + CNWithOutParams(RUTAS.NAVIGATOR) + "'",
        "fmt": "Formato correcto: /" + CNWithOutParams(RUTAS.NAVIGATOR) + "/.elemento1.elemento2.elementoN"
      },
      {
        "component": CNWithOutParams(RUTAS.SEARCH),
        "title": "Error en el componente de búsqueda",
        "icon": "assets/find-crash.png",
        "solution": "msg",
        "jump": RUTAS.NAVIGATOR.replace(":path", "."),
        "msg": "Faltan los parámetros de búsqueda o estos no se han codificado correctamente.",
        "fmt": "Pruebe a buscar en el portafolios elementos relacionados a un texto que específique aquí:"
      }
    ]

  constructor(private x: ActivatedRoute, private y: Router) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.x.url.subscribe(data => {
      let component: string = data[0].path;
      let err: any = this.Solutions.find(e => e.component == component);
      if (err != undefined) {
        this.icon=(err.icon==undefined || err.icon==''?this.icon_pred:err.icon);
        this.title=err.title==undefined || err.title==''?this.error_title_pred:err.title;
        this.ExecuteSolution(err);
      }
      else {
        this.icon=this.icon_pred;
      }
    });
  }

  /**
   * Soluciones a los errores de ruta URL de angular
   * si solution=jump (salto a la ruta definida por err.jump)
   * si solution=msg (muestra mensaje en pantalla con un aviso)
   */
  private ExecuteSolution(err: WrongURLSolution) {
    switch (err.solution) {
      case "jump":
        this.y.navigateByUrl(err.jump);
        break;
      case "msg":
        this.msg = err.msg;
        this.fmt = err.fmt;
        break;
      default:
        break;
    }
  }
  /**
 * Soluciones a los errores de ruta URL de angular
 * si solution=jump (salto a la ruta definida por err.jump)
 * si solution=msg (muestra mensaje en pantalla con un aviso)
 */
  public getIconError(err: WrongURLSolution):string {
    let icon: string = "assets/no-results.png";
    if(err.icon!=""){
      icon=err.icon;
    }
    return icon;
  }
}

export class WrongURLSolution {
  public component!: string;
  public solution!: string;
  public icon!:string;
  public title!:string;
  public jump!: string;
  public msg!: string;
  public fmt!: string;
}
