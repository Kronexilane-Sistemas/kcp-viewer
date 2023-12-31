import { Component, Input, OnInit } from '@angular/core';
import { DoccontactService } from './doccontact.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KRNAPIResponse } from 'src/app/services/model/global.entity';

@Component({
  selector: 'app-doccontact',
  templateUrl: './doccontact.component.html',
  styleUrls: ['./doccontact.component.scss']
})
export class DoccontactComponent implements OnInit {

  // Parámetros del componente
  @Input("title") title: string = "Contacto";
  @Input("text") text: string = "Contacte con nosotros para más información";

  @Input("parameters") parameters:any;
  public msgstatus: string = "Enviando mensaje ...";

  // Asuntos y formulario de envio
  public subjects!: string[]; // Lista de subjects
  public form!: FormGroup;
  public buttonDisabled:boolean=false;

  /** Variables de estado (Imagenes y Mensajes) */
  public imgs: string[] = ['assets/enviando.gif', 'assets/enviado.gif', 'assets/no-enviado.png'];
  public sts: string[] = ['Enviando mensaje...', 'Mensaje entregado', 'El mensaje no se ha enviado'];

  public st: number = -1; // Estado: 0 --> Enviando 1---> Entregado 2---> Error

  constructor(private sEmail: DoccontactService, private formbuilder: FormBuilder) { }

  /* Creación del formulario */

  public CreateForm(): void {
    this.form = this.formbuilder.group
      (
        {
          person: new FormControl("",
            [
              Validators.required
            ]),
          email: new FormControl("",
            [
              Validators.required,
              Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
            ]),
          phone: new FormControl(""),
          subject: new FormControl("Libre",
            [
              Validators.required
            ]),
          msg: new FormControl("",
            [
              Validators.required
            ])
        }
      );
  }
  /* Lectura de valores de subjects (Asuntos) */
  async ngOnInit(): Promise<void> {
    // Creamos formulario
    this.CreateForm();
    // Leemos los asuntos
    await this.sEmail.getSubjects().then(data => this.subjects = data);
  }

  /* Envio de formulario */
  public SendMessage(form: any) {
    let msg: string =
      `
    Solicitud de contacto

     Persona de contacto:  ${form.person}
    Teléfono de contacto:  ${form.phone != '' ? form.phone : '(sin teléfono de contacto)'}
      E-Mail de contacto:  ${form.email}
                  Asunto:  ${form.subject}

    Mensaje:
    ********
    ${form.msg}\n
    `;

    // Estado 0, enviando mensaje
    this.st = 0;
    this.buttonDisabled = true;
    this.sEmail.sendEmail(msg, form.subject).then(data=> {
      let msg:KRNAPIResponse=data as KRNAPIResponse;
      // Cambio de estado
      if(msg.msgid==0) {
        this.st=1;
      }else{
        this.st=2;
      }
    }).finally(() => {
      this.form.reset();
      this.form.controls['subject'].setValue('Libre');
      this.buttonDisabled=false;
    });
  }
}
