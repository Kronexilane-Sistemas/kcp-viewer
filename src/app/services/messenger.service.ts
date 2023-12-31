
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PortfolioSettings } from './config.app.service';
import { APPLoginService } from './login/app.login.service';

export enum msgType {
  LOGOUT,       // Cierra sesión
  TEXT,         // Envia textos
  INITIAL_PAGE, // Ruta KCP de página inicial
  REFRESH,      // Refrescar variables ante eventos
  COPYRIGHT,    // Envio texto Copyright
  ADDITIONAL,   // Parámetros adicionales
  PARAMETERS    // Parámetros de portfolio específicos
}

@Injectable({
  providedIn: 'root'
})
export class MessengerService {



  private messages =
    {
      LOGOUT:new Subject<Boolean>(),
      TEXT: new Subject<any>(),
      REFRESH: new Subject<Boolean[]>(),
      COPYRIGHT: new Subject<string>(),
      ADDITIONAL: new Subject<any>(),
      PARAMETERS:new Subject<PortfolioSettings>(),
      INITIAL_PAGE: new Subject<string>(),
    }

  constructor(private z:APPLoginService) { }



  // Obtiene el observable u evento de recogida de datos
  public getMessage(type: msgType): Observable<any> {
    let retObserver!: Observable<any>;
    switch (type) {
      case msgType.LOGOUT:
        retObserver = this.messages.LOGOUT.asObservable();
        break;
      case msgType.TEXT:
        retObserver = this.messages.TEXT.asObservable();
        break;
      case msgType.REFRESH:
        retObserver = this.messages.REFRESH.asObservable();
        break;
      case msgType.COPYRIGHT:
        retObserver = this.messages.COPYRIGHT.asObservable();
        break;
      case msgType.ADDITIONAL:
        retObserver=this.messages.ADDITIONAL.asObservable();
        break;
      case msgType.PARAMETERS:
        retObserver = this.messages.PARAMETERS.asObservable();
        break;
      case msgType.INITIAL_PAGE:
        retObserver = this.messages.INITIAL_PAGE.asObservable();
        break;
    }
    return retObserver;
  }


  // Emite el mensaje
  public Emit(msg: any, type: msgType): void {
    switch (type) {
      case msgType.LOGOUT:
        this.messages.LOGOUT.next(msg);
        break;
      case msgType.REFRESH:
        this.messages.REFRESH.next(msg);
        break;
      case msgType.TEXT:
        this.messages.TEXT.next(msg);
        break;
      case msgType.COPYRIGHT:
        this.messages.COPYRIGHT.next(msg);
        break;
      case msgType.ADDITIONAL:
        this.messages.ADDITIONAL.next(msg);
        break;
      case msgType.PARAMETERS:
        this.messages.PARAMETERS.next(msg as PortfolioSettings);
        break;
      case msgType.INITIAL_PAGE:
        this.messages.INITIAL_PAGE.next(msg);
        break;
    }
  }

}
