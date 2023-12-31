import { DEFAULT_PORTFOLIO } from './../../services/global.data';
import { APPSettings } from './../../services/config.app.service';
import {
  KRNAPIResponse,
  morePortfolio,
} from './../../services/model/global.entity';
import { Component, OnInit, EventEmitter, Output, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { APPLoginService } from 'src/app/services/login/app.login.service';

// Declaramos las variables para jQuery
declare var $: any;
declare var jquery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    '(window:keydown)': 'onKeyDown($event)',
  },
})
export class LoginComponent implements OnInit {
  @Output() LoginMessage = new EventEmitter<boolean>();
  @Input() Autologin: boolean = false;

  public Formulario!: FormBuilder;
  public FormLogin!: FormGroup;
  public StatusMsg!: string;
  public sw!: boolean;
  public lenMP: number = 0;

  public morePFL!: morePortfolio[];
  public swDefault: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private login: APPLoginService,
    private config: APPSettings
  ) {}

  // Si se pulsa ESC, se borra el formulario
  public onKeyDown(event: any) {
    if (event.keyCode == 27) {
      this.FormLogin.reset();
    }
  }
  async ngOnInit(): Promise<void> {
    $("body").hide();
    let msg: any = sessionStorage.getItem('error');
    if (msg != undefined) this.StatusMsg = msg;

    /*
     Busca las credenciales por defecto {user,password} del archivo
     assets/default.portfolio.json. Si esta, la carga, si no se
     queda pendiente de uso la pantalla de Login.
   */

    if (this.Autologin) {
      this.config
        .DEFAULT_PORTFOLIO(DEFAULT_PORTFOLIO)
        .then((data) => {
          let user: any;
          let password: any;

          user = sessionStorage.getItem('currentUser');
          password = sessionStorage.getItem('currentPassword');

          if (user == undefined) {
            user = data.user;

            sessionStorage.setItem('currentUser', data.user);
          }
          if (password == undefined) {
            password = data.password;
            sessionStorage.setItem('currentPassword', data.password);
          }

          // Pide autorización automática y hace login automático
          this.login
            .getAuthorization(user, password)
            .then((data) => {
              this.login.Put(data.headers.Authorization);
              $('#login').show();
              this.LoginMessage.emit(true);
              $('body').hide();
              this.Autologin=true;
              //$('#login_progress').hide();
            })
            .catch(() => {
              $('#login').show();
            });
        })
        .catch(() => {
          this.Autologin=false;

        })
        .finally(() => {});
    } else {
      this.Autologin=false;

    }
    this.FormLogin = this.CreateLoginForm();

    // Carga la lista portafolios por defecto
    await this.config.getMorePortFolios().then(async (data) => {

      this.morePFL = data;
      this.morePFL.forEach((e) => {
        // Imagen por defecto si no tiene asignada
        if (e.img == '') e.img = 'assets/portfolio.png';
        // Si es portafolios por defecto "Marcar" el primero que
        // es el que se cargará.
        if (e.default && !this.swDefault) {
          e.img = 'assets/ok.png';
          this.swDefault = true;
        }
      });
    });
    this.lenMP = this.morePFL.length;

    $("body").fadeIn("fast");
  }

  /**
   * Crea el FormGroup del cuadro de LOGIN
   * @returns FormGroup
   */
  public CreateLoginForm(): FormGroup {
    return this.formbuilder.group({
      username: new FormControl('', [
        Validators.required,
        /*Validators.minLength(10),
          Validators.maxLength(20),
          Validators.pattern('[a-zñA-ZÑ0-9]*')
          */
      ]),
      password: new FormControl('', [
        Validators.required,
        /*,
          Validators.maxLength(5),
          Validators.minLength(5),
          */
      ]),
    });
  }

  /**
   * Envio de datos de LOGIN al BACKEND
   */
  public SubmitLogin(dataForm: any): void {
    // Apaga el MODAL de la ventana de portafolios públicos
    // por si se invoca al LOGIN desde alli, si no, no pasa
    // nada.

    $('#exampleModal').modal('hide');

    // Recoge la clave y el usuario.
    let user: string = dataForm.username;
    let password: string = dataForm.password;
    this.login
      .Login(user, password, '/home')
      .then((data) => {
        this.login.Put('Bearer '.concat(data.data));
        this.LoginMessage.emit(true);
      })
      .catch((error) => {
        this.StatusMsg = (error as KRNAPIResponse).msg;
      });
  }

  /*
    Recarga la página para ir al portfolio
    predeterminado si esta disponible
  */
  public Reload(): void {
    location.reload();
  }
}
