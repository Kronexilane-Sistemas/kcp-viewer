import { Component, Input, OnInit } from '@angular/core';
import { AsyncLocalStorage } from 'async_hooks';

// Declaramos las variables para jQuery
declare var $: any;

@Component({
  selector: 'app-cookies-warning',
  templateUrl: './cookies-warning.component.html',
  styleUrls: ['./cookies-warning.component.scss']
})
export class CookiesWarningComponent implements OnInit {

  @Input() setup!:CookiesWarningSetup;


  constructor() { }

  ngOnInit(): void {
    $("#cookiesWarning").modal("show");
  }

}

export class CookiesWarningSetup{
  public title?:string="Aviso de Privacidad";
  public text!:string;
}
