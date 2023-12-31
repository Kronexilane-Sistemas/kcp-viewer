import { MessengerService, msgType } from './../services/messenger.service';
import { Router } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})
export class PagetitleComponent implements OnInit,
 AfterViewInit
 {

  @Input('titulo') webTitle!: string;
  @Input('subtitulo') webSubTitle!: string;
  @Input('autor') webAuthor!: string;
  @Input() PortfolioName: string = "A/B";
  @Input() navigator: boolean = false;
  @Input() icon: string = "";
  @Input() links!: string[];
  @Input() headerimg: boolean = false;
  @Input() navigatorimg:string="";

  public portfoliotitle!: string;
  public portfoliosubtitle!: string;

  constructor(private router: Router,private msg:MessengerService) { }

  ngAfterViewInit(): void {

    //$("#titulo").fadeIn(2000).fadeOut(2000).slideDown(2000).slideUp(2000).slideDown(1000);
    //$("#titulo").animate({"width":"100%","height":"100%","fontSize":"2em"},1000);

    // Recibir Parámetros emitidos desde header también
    this.msg.getMessage(msgType.PARAMETERS).subscribe(data=>{
      this.navigatorimg=data.navigatorimg;
    })
  }

  ngOnInit(): void {
    let portfoliotitles: string[] = this.PortfolioName.split("/");
    this.portfoliotitle = this.ChoiceTitle(portfoliotitles[0]);
    this.portfoliosubtitle = this.ChoiceTitle(portfoliotitles[1]);


  }
  /**
  * Si hay dos campos separados por | elige el de la izquierda (largo) frente
  * al corto (derecha) en función del ratio de pantalla (pequeña o grande)
  * @param title
  * @returns
  */
  public ChoiceTitle(title: string): string {
    let titles: string[];
    let ratio: number = screen.width / screen.height;
    let ret: string = title;
    if (title && title.includes("|")) {
      titles = title.split("|");
      if (ratio <1.77) {
        ret = titles[1]; // titulo corto (ratio<1)
      } else {
        ret = titles[0]; // Titulo largo (ratio>1)
      }
    }
    return ret;
  }

  /** Ir a uno de los enlaces del gestor de categorias/ITEM */
  public GoTo(link:string,position:number): void {
    let ret:string[];
    let path:string;
    //if(link=='') return; // Es ir a la raíz
    // Obtener la ruta reducida hasta el link donde se hace click
    ret=this.links.slice(1,position+1);
    path="/"+ret.join("/");
    if(link!=''){
      this.msg.Emit(path, msgType.TEXT);
    }else{
      this.msg.Emit("/", msgType.TEXT);
    }
  }

  /**
   * Devuelve True si estamos en una pantalla pequeña
   * @returns
   */
  public isSmallScreen(): boolean {
    let ratio: number = screen.width / screen.height;
    return ratio < 1;
  }
}
