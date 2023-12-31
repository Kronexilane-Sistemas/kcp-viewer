import { AfterContentInit, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { getRandomIDForDOM } from 'src/app/services/global.js.functions';

declare var $: any;

@Component({
  selector: 'app-progress',
  templateUrl: './app-progress.component.html',
  styleUrls: ['./app-progress.component.scss']
})
export class AppProgressComponent implements OnInit {

  @Input('ProgressID') idP!:string;
  @Input('Hide') oculta:boolean=false;
  constructor() {}

  ngOnInit(): void {
    var x=setInterval(()=>{
      if(this.oculta){
        this.Hide();
        clearInterval(x);
      }
    },800)
  }

  public Hide():void{
    $(`#${this.idP}`).modal("hide");
  }

  public Show():void
  {
    $(`#${this.idP}`).modal("show");
  }
}
