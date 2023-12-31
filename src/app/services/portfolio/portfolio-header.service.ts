import { KRNAPIResponse } from './../model/global.entity';
import { kcp_portfolio } from './portfolio-model';
import { APPLoginService } from 'src/app/services/login/app.login.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APPSettings } from '../config.app.service';
import { API } from '../global.api';
import { STD } from '../global.data';
import { kcp_item } from 'src/app/app-parts/categories/categories.model';
import { rejects } from 'assert';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class PortfolioHeaderService {
  constructor
    (
      private config: APPSettings,
      private http: HttpClient,
      private login: APPLoginService
    ) { }

  /**
   * Obtiene la información estadística del contador
   * de visitas definido por la vista correspondiente
   * @returns Array de String con los textos formateados
   */
  public getVisitorCounter(): Promise<any> {
    // Genera la Promise que llama al API de obtención de vistas
    let result: Promise<any> = new Promise<any>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then(url => {
          this.http.get<any>(url.concat(API.VISITOR_COUNT), this.login.HeaderSettingsGET()).
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
  /**
   * Obtiene la cabecera del portafolio asociado al usuario
   * visitante que ha iniciado sesión: AUTOMÁTICO o NO.
   * @returns Cabecera de Portafolio kcp_portfolio
   */
  public getPortFolioHeader(): Promise<any> {
    // Genera la Promise que llama al API de obtención de vistas
    let result: Promise<any> = new Promise<any>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then(url => {

          this.http.get<any>(url.concat(API.GET_PORTFOLIO), this.login.HeaderSettingsGET()).
            subscribe
            (
              (data: any) => {
                resolve(data);
              },
              (error) => {
                let msg: KRNAPIResponse = new KRNAPIResponse();
                msg.msgid = -1;
                msg.title = "Error de conexión general";
                msg.data = "No se pudo conectar";
                reject(msg);
              }
            );

        });

      });
    return result
  }

  /**
   * Obtiene el árbol de ITEMS del portafolio
   * @returns
   */
  async getPortFolioItems(): Promise<kcp_item[]> {
    // Genera la Promise que llama al API de obtención de vistas
    let result: Promise<kcp_item[]> = new Promise<kcp_item[]>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then(url => {

          this.http.get<kcp_item[]>(url.concat(API.GET_ITEMS), this.login.HeaderSettingsGET()).
            subscribe
            (
              (data: any) => {
                resolve(data as kcp_item[]);
              },
              (error) => {
                let msg: KRNAPIResponse = new KRNAPIResponse();
                msg.msgid = -1;
                msg.title = "Error de conexión general";
                msg.data = "No se pudo conectar";
                reject(msg);
              }
            );

        });

      });
    return await result;
  }

  /**
   * Devuelve el menú FOOTER del portafolio
   * @returns
   */
  async getMenu(menu: string): Promise<kcp_item> {
    let urlBackend: string = "";
    let result!: any;
    await this.config.BACKEND(STD).then(url => { urlBackend = url })
    await this.http.get<kcp_item>(urlBackend.concat(API.GET_MENU), this.login.HeaderSettingsGET({ menuCommand: menu })).toPromise().
    then
      (
        data => result = data
      ).
    catch
      (
        () => {
          result = null;
        }
      );
    return result;
  }

  /**
   * Devuelve el objeto kcpitem de un documento HTML/WORK/PRESENTATION
   * @param documentPath Path del documento
   * @returns
   */
  async getDoc(documentPath:string): Promise<any> {
    let urlBackend: string = "";
    let result!: any;

    await this.config.BACKEND(STD).then(url => { urlBackend = url });

    await this.http.get<any>(urlBackend.concat(API.GET_DOC), this.login.HeaderSettingsGET({ Path: documentPath })).toPromise().
      then
      (
        data => {
          result = data
        }
      ).
      catch
      (
        data => {
          result=data;
        }
      );

    return result;
  }
  /**
  * Devuelve el PATH completo de un ITEM a partir de su ID
  * @param itemID
  * @returns
  */
  public GetItemPath(itemID: number): Promise<string[]> {
    let result: Promise<string[]> = new Promise<string[]>(
      (resolve, reject) => {
        this.config.BACKEND(STD).then((url: string) => {
          this.http.get<string[]>(url.concat(API.GET_PATH_ITEM),
            this.login.HeaderSettingsGET({
              ContainerID: itemID
            })

          ).
            subscribe
            (
              (data: any) => {
                resolve(data);
              },
              (e: any) => {
                reject(e);
              }
            );
        });
      });
    return result
  }
}
