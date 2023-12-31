import { APPSettings } from '../config.app.service';
import { kcp_user_login, KRNAPIResponse } from '../model/global.entity';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import * as shajs from 'sha.js'


import { STD } from '../global.data';
import { jwtUTIL } from '../util/jwtToken';
import { API } from '../global.api';
import { Router } from '@angular/router';


// ROLES AUTORIZADOS A ESTA APLICACIÓN
export const ROLES = ['ROLE_VISITOR'];

@Injectable({ providedIn: 'root' })

export class APPLoginService {

  // Subject: Envio de mensajes al componente padre.
  private login_dataSubject$ = new Subject<string>();

  constructor
    (
      private http: HttpClient,
      private config: APPSettings,
      private route: Router    ) { }

  /**
   * Login: Realiza Login de sesión, salva en el entorno de Session del navegador
   * el TOKEN JWT correspondiente y "salta" al componente correspondiente mediante
   * Route.
   */
  public Login(user: string, password: string, beginpoint: string): Promise<any> {
    let link: string[] = [beginpoint];
    let passwordCodify: string = shajs('sha1').update(password).digest('hex');

    let result: Promise<any> = new Promise<any>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then(url => {
          this.http.post<any>(url.concat(API['AUTENTICATION_LOGIN']),
            new kcp_user_login(user, passwordCodify)).
            subscribe
            (
              (LoginResponse: KRNAPIResponse) => {
                if (LoginResponse.msgid === 0) {
                  let role: string = jwtUTIL.getjwtRole(LoginResponse.data);
                  // Si el usuario es del ROL autorizado para la aplicación
                  // Lo da como válido, si no, deniega el LOGIN
                  if (ROLES.indexOf(role) !== -1) {
                    this.Put(LoginResponse.data);
                    this.route.navigate(link).then(() => {
                      // Envio del OBSERVABLE (DELEGADO O EVENTO)
                      // Con el dato del nombre usuario
                      this.login_dataSubject$.next(user);
                      sessionStorage.setItem("username", user);
                      sessionStorage.setItem("currentUser", user);
                      sessionStorage.setItem("currentPassword", password);
                    });

                    resolve(LoginResponse);
                  } else {
                    let APIResponse: KRNAPIResponse = new KRNAPIResponse();
                    APIResponse.title = APIResponse.msg = APIResponse.data = "Usuario no autorizado en esta aplicación";

                    reject(APIResponse);
                  }

                }
              },
              (e: HttpErrorResponse) => {
                // Lanza la respuesta de ERROR API
                if (e.status != 0) {
                  reject(e.error as KRNAPIResponse);
                }
                // Error de conexión al BACKEND envuelto en
                // un objeto KRNAPIResponse
                if (e.status === 0) {
                  let ErrorConexion: KRNAPIResponse = new KRNAPIResponse();
                  ErrorConexion.msgid = 9999;
                  ErrorConexion.title = "No hay conexión con el servidor de BACKEND"
                  ErrorConexion.msg = e.message;
                  ErrorConexion.data = (e.url as string);
                  console.log(ErrorConexion);
                  reject(ErrorConexion);
                }
              }
            );
        });
      });

    return result
  }

  /**
   * Devuelve la autorización JWT de un usuario:
   * Permite ejecutar otras APIS con otro nivel
   * de permisos (ROL DE USUARIO)
   * @param user
   * @param password
   * @returns
   */
  public getAuthorization(user: string, password: string): Promise<any> {
    let passwordCodify: string = shajs('sha1').update(password).digest('hex');

    let result: Promise<any> = new Promise<any>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then(url => {
          this.http.post<any>(url.concat(API['AUTENTICATION_LOGIN']),
            new kcp_user_login(user, passwordCodify)).
            subscribe
            (
              (LoginResponse: KRNAPIResponse) => {
                if (LoginResponse.msgid === 0) {
                  let settings = {
                    'headers': {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Accept': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Methods': 'DELETE, POST, PUT, GET, OPTIONS',
                      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
                      'Access-Control-Max-Age': '9999999999',
                      'Authorization': 'Bearer '.concat(LoginResponse.data)
                    },
                  }
                  sessionStorage.setItem("username",user);
                  sessionStorage.setItem("currentUser", user);
                  sessionStorage.setItem("currentPassword", password);
                  resolve(settings);
                } else {
                  reject("Autorización denegada: Usuario o clave incorrectos.");
                }
              },
              (e: HttpErrorResponse) => {

                // Lanza la respuesta de ERROR API
                if (e.status != 0) {
                  let responseError: KRNAPIResponse;
                  responseError = e.error as KRNAPIResponse;
                  reject(responseError.msg);
                }
              }
            )
        });
      });

    return result
  }

  /**
   * Vacia el entorno de sesion y "Salta" al componente de
   * salida mediante Route
   * @param {string} OutComponent
   * @memberof APPLoginService
   */
  public Logout(OutComponent: string, ErrorMsg?: number | undefined): void {
    let Jump: string[] = [];
    this.Clear();
    if (ErrorMsg != undefined) this.setErrorMessage(ErrorMsg);
    Jump[0] = OutComponent;
    this.route.navigate(Jump);
  }

  /*-------------------------------------------------
    FUNCIONES DE GESTIÓN DE SESIÓN DE USUARIO 'TOKEN'
  ---------------------------------------------------*/

  // Cabeceras para Petición (GET) y Actualización (PUT) de las APIS
  public HeaderSettingsGET(parameters:any=null): any {
    let tok: any = sessionStorage.getItem('token');
    let settings = {
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, POST, PUT, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '9999999999',
        'Authorization': tok,
      },
      params:parameters
    };
    return settings;
  }

  public HeaderSettingsPUT(): any {
    let tok: any = sessionStorage.getItem('token');
    //tok = 'Bearer '.concat(tok);
    let settings = {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, POST, PUT, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '9999999999',
        'Authorization': tok,
      }
    };
    return settings;
  }
  public HeaderSettingsDELETE(Options: any = undefined): any {
    let tok: any = sessionStorage.getItem('token');
    tok = 'Bearer '.concat(tok);
    let settings = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, POST, PUT, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '9999999999',
        'Authorization': tok,
      },
      body: Options
    };
    return settings;
  }
  /*--------------------------------------------------------------------
    GUARDADO, OBTENCIÓN Y LIMPIEZA DEL ESPACIO SESION DE USUARIO (TOKEN)
  ----------------------------------------------------------------------*/

  // Salva Token
  public Put(token: string) {
    sessionStorage.setItem('token', token);
  }
  // Obtiene Token
  public getToken(): string {
    let tok: any = sessionStorage.getItem('token');
    return tok === null ? "" : tok;
  }

  // Limpia Espacio de sesión
  public Clear() {
    sessionStorage.clear();
  }

  // Obtiene el observable u evento de recogida de datos
  public getLoginData(): Observable<string> {
    return this.login_dataSubject$.asObservable();
  }

  /*-----------------------------------------------------------------
    VALIDACIÓN DE TOKEN Y GESTIÓN DE MENSAJE DE ERROR QUE SE DEVUELVE
  -------------------------------------------------------------------*/
  /**
   * Salta a la página que se establezca si la sesión
   * no contiene un token JWT valido.
   *
   * @param ErrorPage Página de desvio en caso de error
   * @param ErrorMsg  Mensaje de error
   */

  public InvalidLogon(ErrorPage: string, ErrorMsg?: number | undefined): void {
    let JumpURL: string[] = [ErrorPage];
    let tok: any = sessionStorage.getItem('token');
    try {
      let role: string = jwtUTIL.getjwtRole(tok);
    } catch {
      if (ErrorMsg != undefined) this.setErrorMessage(ErrorMsg);
      this.route.navigate(JumpURL);
    }
  }

  /**
   * Salta a LOGIN si el codigo status
   * que ponemos es alguno de los siguientes
   * 401,403 Prohibido o Autorizado que
   * generalmente saltan cuando el ticket JWT
   * ha expirado.
   * Asegura una salida de la aplicación.
   * @param status
   */
  public JumpToLogin(status: number): void {
    let JumpURL: string[] = ['/'];
    switch (status) {
      case 401:
        this.setErrorMessage(status);
        this.route.navigate(['/']);
        break;
    }
  }

  /**
   * Salta a un componente dado por una ruta
   * del sistem de Routing Angular.
   *
   * @param {string} Page
   * @memberof APPLoginService
   */
  public JumpToComponent(Page: string): void {
    let JumpURL: string[] = [Page];
    this.route.navigate(JumpURL);
  }
  // Devuelve Mensaje de error personalizado
  public getErrorMessage(): string {
    let tok: any = sessionStorage.getItem('error');
    return tok === undefined ? "" : tok;
  }

  // Establece Mensaje de error personalizado
  public setErrorMessage(code: number) {
    let mensaje: string = "";
    switch (code) {
      case -2:
        mensaje = "Aplicación sólo válida para pantallas grandes."
        break;
      case -1:
        mensaje = "El servidor de BACKEND se apagó manualmente.";
        break;
      case 401:
        mensaje = "No autorizado: Sesión caducada."
        break;
      case 403:
        mensaje = "Usuario no autorizado en esta aplicación."
        break;
      case 999:
        mensaje= "El portafolios no tiene contenido."
        break;
    }
    sessionStorage.setItem('error', mensaje);
  }

  // -- Otras APIS --

  /**
   * Recuperación de los Settings del Backend
   * Devuelve un Array autoreferenciado de tipo
   * CLAVE=VALOR
   * @returns {Promise<any>}
   * @memberof APPBackendSettingsService
   */
  public getSettings(Authorization: any): Promise<any> {
    // Genera la Promise que llama al API de obtención de vistas
    let result: Promise<any> = new Promise<any>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then(url => {
          this.http.get<any>(url.concat(API['GET_SETTINGS']), Authorization).
            subscribe
            (
              (data: any) => {
                resolve(data);
              },
            );
        });
      });
    return result
  }



  /**** Determina si un objeto ANY es de tipo KRNAPIResponse */
  public isKRNAPIResponse(obj: any): boolean {
    let str1: string = Reflect.ownKeys(obj).toString();
    let str2: string = Reflect.ownKeys(new KRNAPIResponse()).toString();
    return str1 == str2;
  }
}



