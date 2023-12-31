import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logotipo',
  templateUrl: './logotipo.component.html',
  styleUrls: ['./logotipo.component.scss']
})
export class LogotipoComponent implements OnInit {

  @Input() big:boolean=false;
  @Input() login:boolean=false;

  /**
   * Type:
   *   menu = Logotipo menú superior derecha
   *   foot = Logotipo pie
   *  login = Logotipo para pantalla de login
   */
  @Input() Type:string="menu";

  constructor() { }

  ngOnInit(): void {
  }

}
