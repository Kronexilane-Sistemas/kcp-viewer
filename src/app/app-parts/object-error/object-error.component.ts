import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RUTAS } from 'src/app/app-routing.module';

@Component({
  templateUrl: './object-error.component.html',
  styleUrls: ['./object-error.component.scss']
})
export class ObjectErrorComponent implements OnInit {

  public msg:string="";

  public navigator:string=RUTAS.NAVIGATOR;

  constructor(public route:ActivatedRoute) {


  }

  ngOnInit(): void {
    this.route.params.subscribe(async data => {
      this.msg = data.msg;
    });
    window.scroll(0, 0);
  }

  /**
   * Devuelve el componente principal de RUTAS de angular
   * quitando el parámetro:
   *
   * Para: /navigator/:parametro
   * Devuelve: navigator
   */
  public getComponentRoot(rootKey:string){
    let data:string[]=rootKey.split("/");
    return "/".concat(data[0]);
  }
}
