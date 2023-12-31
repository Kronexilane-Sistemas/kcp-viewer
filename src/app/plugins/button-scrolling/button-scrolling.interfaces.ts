/**
 * Interfaces para ButtonScrolling
 */


/**
 * Interfaz para una función de un único botón
 */
export interface ButtonScrollingFunction{
  Execute():void
}

/**
 * Interface para botón de tipo TOOLBAR
 */
export interface ButtonScrollingToolbar{
  img:string;
  text:string;
  tooltip:string;
  execute():void;
}


