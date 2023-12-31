
/**
 * Mapas de búsqueda que mapean parámetros API con
 * valores de formularios reactivos angular.
 */
export class SearchMAPS {

  // -- FORMULARIO DE BÚSQUEDA AVANZADA --
  private static _Advanced = {
    Text: "text",
    Tags: {
      value: "tags",
      transform: (data: string[]) => data.join(",")
    },
    Types: {
      value: "items",
      translate: [
        ["Web", 0],
        ["Presentación", 1],
        ["Trabajo", 2],
        ["Enlace", 3],
        ["Descarga", 4],
        ["Contenedor", 5],
        ["Grupo", 6],
        ["Colección", 7]
      ],
      transform: (data: string[]) => data.join(",")
    },
    Dates: {
      value: "initD,finalD",
      transform: (datos: string) => {
        let result: string = datos;
        let DateMat: string[] = datos.split(",");
        if (DateMat.length == 1) {
          result = DateMat[0].split("-").reverse().join("-");
        }
        return result;
      }
    },
    Title: "title",
    Type: "type",
    TextIncludeHTML: "sw1",
    TextIncludeJSON: "sw2"
  }

  // -- FORMULARIO DE BÚSQUEDA SIMPLE (SOLO TEXTO)
  private static _Simple = {
    Text: "textFilter",
    Title: "title",
    Type: "type",
    TextIncludeHTML: "sw1",
    TextIncludeJSON: "sw2"
  }

  // Tabla de MAPEO para TAG
  private static _Tag = {
    Tags: "tag",
    Title: "Title",
    Type: "Type"
  }

  // Tabla de MAPEO para fecha

  private static _Date ={
    Dates:"date",
    Title:"Title",
    Type:"Type"
  }


  // Propiedades públicas

  public static get SAdvanced() {
    return this._Advanced;
  }

  public static get SSimple() {
    return this._Simple;
  }

  public static get STag() {
    return this._Tag;
  }
  public static get SDate() {
    return this._Date;
  }

}
