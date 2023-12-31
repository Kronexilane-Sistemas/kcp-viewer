import { kcp_user_login, morePortfolio } from './model/global.entity';
import { DEFAULT_PORTFOLIO } from './global.data';
import { HttpClient} from "@angular/common/http";
import { Injectable} from "@angular/core";

/**
 * Servicio de configuración básica
 * del APP WEB que lee datos del archivo
 * ---- assets/config.json ----
 */
@Injectable()
export class APPSettings {
  public protocol: string ="";
  public server: string = "";
  public port: string = "";

  // Inyecta el servicio HttpClient
  constructor(private http: HttpClient) {}

  /**
   * Devuelve la URL del servidor backend basándose
   * en los datos desglosados del archivo assets/config.json
   *
   * @returns {Promise<string>}
   * @memberof APPSettings
   */
  public BACKEND(config:string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let configFile: string = "assets/config/".concat(config).concat('.json');
      this.http.get<APPSettings>(configFile).subscribe(
        (Config: APPSettings) => {
          let url:string=Config.
            protocol.
            concat('://').
            concat(Config.server).
            concat((Config.port==="" || Config.port===undefined)?"/":":".concat(Config.port).concat('/'));
            resolve(url);
        },
        (e) => {
          console.log("Error al leer la configuración:", e);
          reject(e.error);
        }
      );
    });
  }
  /**
   * Devuelve usuario y contraseña del portafolio por defecto
   * del archivo assets/default.portfolio.json
   * @param config
   * @returns Objeto simple {usuario:contraseña}
   */
  public DEFAULT_PORTFOLIO2(config:string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let configFile: string = "assets/config/".concat(config).concat('.json');
      this.http.get<kcp_user_login>(configFile).subscribe(
        (Config: kcp_user_login) => {
            resolve(Config);
        },
        (e) => {
          reject(e.error);
        }
      );
    });
  }


  /**
   * Devuelve usuario y contraseña del portafolio por defecto
   * del archivo assets/default.portfolio.json
   * @param config
   * @returns Objeto simple {usuario:contraseña}
   */
  public DEFAULT_PORTFOLIO(config: string): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      let configFile: string = "assets/config/".concat(config).concat('.json');
      this.http.get<morePortfolio[]>(configFile).subscribe(
        (Data: morePortfolio[]) => {
          let defaultLogin!: any;
          let eDefault:any=Data.find(e=>e.default);

          if(eDefault!=undefined){
            defaultLogin={
              user:eDefault.user,
              password:eDefault.password
            }
          }
          resolve(defaultLogin);
        },
        (e) => {
          reject(e.error);
        }
      );
    });
  }
  /**
   * Obtiene la configuración general de los portfolios en JSON
   * @param config
   * @returns
   */
  public GetPortfolioSettings(portfolio:string): Promise<any> {
    let config:string="settings";
    return new Promise<PortfolioSettings>((resolve, reject) => {
      let configFile: string = "assets/config/".concat(config).concat('.json');
      this.http.get<PortfolioSettings[]>(configFile).subscribe(
        (Config: PortfolioSettings[]) => {
          let search!:PortfolioSettings;
          for(let e of Config){
            if(e.names.find(t=>t==portfolio)){
              search=e;
              break;
            }
          }
          if(search==undefined){
            for (let e of Config) {
              if (e.names.find(t => t == "*")) {
                search = e;
                break;
              }
            }
          }
          resolve(search);
        },
        (e) => {
          reject(e.error);
        }
      );
    });
  }

  /**
   * Obtiene la lista de portafolios adicionales en
   * la pantalla de login
   * @returns
   */
  async getMorePortFolios(): Promise<morePortfolio[]> {
    let portfolios!: morePortfolio[];
    let file:string="others.portfolio"
    let configfile:string="assets/config/".concat(file).concat(".json");
    await this.http.get<morePortfolio[]>(configfile).toPromise().then
    (
      data=>{
        portfolios=data;
      }
    )
    return portfolios;
  }



}

/**
 * Parámetros de un portfolio
 */
export class PortfolioSettings{
    public names!:string[];
    public logout!:boolean;
    public search!:boolean;
    public headerframe!:string;
    public navigatorimg!:string;
}

