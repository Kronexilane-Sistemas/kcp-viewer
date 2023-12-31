import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-webtitle',
  templateUrl: './webtitle.component.html',
  styleUrls: ['./webtitle.component.scss']
})
export class WebtitleComponent implements OnInit {

  @Input() dark:boolean=false;

  public webTitle:string="PROGRAMACIÓN Y DISEÑO WEB";
  public webSubTitle:string="Sergio Perpiñá Moreno"

  constructor() {

  }

  ngOnInit(): void {
  }
}
