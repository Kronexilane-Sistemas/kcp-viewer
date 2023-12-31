
/* ------------------------------------------
    DIALOGOS ESTÁNDARIZADOS DE JQUERY CONFIRM
   ------------------------------------------  */
import { JQCParameters } from "./JQCParameters";

declare var $: any; // Para acceso a JQUERY
declare var jquery:any;

export class JQueryConfirm {

  /**
   *  Cierre de aplicación WEB
   * @param opts
   * @returns
   */
  public CloseAPP(opts: JQCParameters): Promise<Boolean> {
    let result: Promise<Boolean> = new Promise<Boolean>(
      (resolve, reject) => {


        $.confirm({
          icon: 'fa fa-question',
          title: '<strong class="jqc-small-title text-primary">' + opts.title + '</strong>',
          content: opts.content,
          theme: opts.fullscreen || opts.fullscreen == undefined ? 'Supervan' : 'Modern',
          buttons: {
            ok: {
              action: function () {
                resolve(true);
              },
              text: opts.ok == undefined ? 'Aceptar' : opts.ok,
              keys: ['enter']
            },
            cancel: {
              action: function () {
                resolve(false);
              },
              text: opts.cancel == undefined ? 'Cancelar' : opts.cancel,
              keys: ['esc']
            }
          }
        });
      }

    );
    return result;
  }

  /**
   * Muestra un cuadro de Error
   * @param opts
   * @returns
   */
  public InfoAPP(opts: JQCParameters): Promise<Boolean> {

    let result: Promise<Boolean> = new Promise<Boolean>(
      (resolve) => {


        $.alert({
          icon: 'fa fa-info',
          type: 'blue',
          typeAnimated: true,
          title: '<strong class="jqc-small-title text-primary">' + opts.title + '</strong>',
          content: opts.content,
          buttons: {
            ok: {
              action: function () {
                resolve(true);
              },
              text: opts.ok == undefined ? 'Cerrar' : opts.ok,
              keys: ['enter']
            }
          }
        });
      }

    );
    return result;
  }

  /**
 * Muestra un cuadro de Error
 * @param opts
 * @returns
 */
  public ErrorAPP(opts: JQCParameters): Promise<Boolean> {
    let result: Promise<Boolean> = new Promise<Boolean>(
      (resolve) => {
        $.alert({
          icon: 'fa fa-warning',
          type: 'red',
          typeAnimated: true,
          title: '<strong class="jqc-small-title text-primary">' + opts.title + '</strong>',
          content: opts.content,

          buttons: {
            ok: {
              action: function () {
                resolve(true);
              },
              text: opts.ok == undefined ? 'Cerrar' : opts.ok,
              keys: ['enter']
            }
          }
        });
      }

    );
    return result;
  }

  /**
   * Para realizar preguntas de tipo SI/NO
   * @param opts
   * @returns
   */
  public QuestionAPP(opts: JQCParameters): Promise<Boolean> {
    let result: Promise<Boolean> = new Promise<Boolean>(
      (resolve) => {
        $.alert({
          icon: 'fa fa-question',
          type: 'blue',
          typeAnimated: true,
          title: '<strong class="jqc-small-title text-primary">' + opts.title + '</strong>',
          content: opts.content,
          theme: 'Modern',
          buttons: {
            ok: {
              action: function () {
                resolve(true);
              },
              text: 'Si',
              keys: ['enter']
            },
            cancel: {
              action: function () {
                resolve(false);
              },
              text: 'No',
              keys: ['Esc']
            }
          }
        });
      }

    );
    return result;
  }

  //public SelectList(opts: JQCParameters): Promise<Boolean> {

  public SelectList(data:string[],title:string): Promise<string> {
    let values:string[]=[];

    // Construye el texto en base a una lista
    if(data!=null){
      for(const e of data){
        values.push(`<option value="${e}">${e}</option>`);
      }
    }
    let option_value_text:string=values.join("\n");

    // Crea la lista
    let content: string =
      `
        <select class="form-select" multiple aria-label="multiple select example" id="selectFQ">
          ${option_value_text}
        </select>

    `
    let result: Promise<string> = new Promise<string>(
      (resolve) => {
        let contentDataSelected:string="";
        let class_title:string="text-dark"
        $.alert({
          icon: 'fa fa-info',
          type: 'blue',
          typeAnimated: true,
          title: `<span class="${class_title}">${title}</span>`,
          content: content,
          buttons: {
            formSubmit: {
              text: 'Seleccionar',
              btnClass: 'btn-blue',
              action: function () {
                contentDataSelected = $('#selectFQ').val();
                resolve(contentDataSelected);
              }
            },
            ok: {
              action: function () {
                resolve(contentDataSelected);
              },
              text: 'Cerrar',
              keys: ['enter']
            }
          }
        });
      }

    );
    return result;
  }
}



