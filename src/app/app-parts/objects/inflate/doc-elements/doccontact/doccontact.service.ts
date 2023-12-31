import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { APPSettings } from 'src/app/services/config.app.service';
import { API } from 'src/app/services/global.api';
import { STD } from 'src/app/services/global.data';
import { APPLoginService } from 'src/app/services/login/app.login.service';
import { KRNAPIResponse } from 'src/app/services/model/global.entity';

@Injectable({
  providedIn: 'root'
})
export class DoccontactService {

  constructor
  (
    private http:HttpClient,
    private config:APPSettings,
    private login:APPLoginService
  )
  {}


  /**
   * Obtiene la lista de Subjects para el componente de CONTACTO
   * @returns
   */
  async getSubjects(): Promise<string[]> {
    let urlBackend: string = "";
    let result!: any;
    await this.config.BACKEND(STD).then(url => { urlBackend = url });

    await this.http.get<string[]>(urlBackend.concat(API.GET_SUBJECTS), this.login.HeaderSettingsGET()).toPromise().
      then
      (
        data => {
          result = data
        }
      ).
      catch
      (
        data => {
          result = data;
        }
      );
    return result;
  }
  async sendEmail(msg:string,subject:string): Promise<KRNAPIResponse> {
    let urlBackend: string = "";
    let result!: any;
    await this.config.BACKEND(STD).then(url => { urlBackend = url });

    await this.http.get<KRNAPIResponse>(urlBackend.concat(API.SENDMAIL), this.login.HeaderSettingsGET
    ({
      Msg:msg,
      Subject:subject
    })).toPromise().
      then
      (
        data => {
          result = data
        }
      ).
      catch
      (
        data => {
          result = data;
        }
      );
    return result;
  }
}
