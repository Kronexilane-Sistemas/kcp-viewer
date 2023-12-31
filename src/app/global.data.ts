/* --------------
*  DATOS GLOBALES
*  --------------
*/

import { kcp_item, eItems } from "./app-parts/categories/categories.model";

// Función que devuelve un dato de sessionStorage

export function STValue(item:any,vdefault:string){
  let ret:string=vdefault;
  let value:any=sessionStorage.getItem(item);
  if(value!=null && item!=undefined){
    ret=value;
  }
  return ret;
}


/********************************/
/* DEFINICIÓN DINÁMICA DE MENÚS */
/********************************/

/*
  Ejemplo 1: ESTRUCTURA KCP_ITEM que es un contenedor que contiene varios
  items de tipo LINK, en este caso se usa para el componente PAGEMENU que
  define el menú de SOCIAL MEDIA o MENUS SIMPLES de una única barra.
  Es esta estructura la que se va a recibir del BACKEND y es la piedra angular
  de todo el proyecto KCP.
*/

export let menu_example: kcp_item = {
  "iitem": 1,
  "name": "pageMenu1",
  "title": "",
  "subtitle": "",
  "date": new Date(),
  "urlimg": "",
  "itemtype": eItems.cLINK_COLLECTION,
  "hide": false,
  "html": "",
  "documentflow": "",
  "href": "",
  "router": "",
  "tags": [],
  "plugins": "",
  "password": "",
  "fkprofile": 0,
  "fkpreviousparent": 0,
  "itemorder": 0,
  "parentid": 0,
  "subitems": [
    {
      "iitem": 1,
      "name": "e1",
      "title": "Pie 1",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "assets/github.png",
      "itemtype": eItems.dLINK,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "http://www.google.es",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": []
    },
    {
      "iitem": 1,
      "name": "e1",
      "title": "Pie 1",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "assets/github.png",
      "itemtype": eItems.dLINK,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "http://www.google.es",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": []
    },
    {
      "iitem": 1,
      "name": "e1",
      "title": "Pie 2",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "assets/github.png",
      "itemtype": eItems.dLINK,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "http://www.google.es",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": []
    },
    {
      "iitem": 1,
      "name": "e1",
      "title": "Página de búsquedas",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "assets/find.png",
      "itemtype": eItems.dLINK,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "http://www.google.es",
      "router": "search",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": []
    }
  ]
}

/*
  Ejemplo 2: ESTRUCTURA KCP_ITEM que es un contenedor que contiene varios
  contenedores de items de tipo LINK, en este caso se usa para el componente
  mmainmenu
*/
export let menumain: kcp_item = {
  "iitem": 1,
  "name": "MenuBar",
  "title": "",
  "subtitle": "",
  "date": new Date(),
  "urlimg": "",
  "itemtype": eItems.cLINK_GROUP,
  "hide": false,
  "html": "",
  "documentflow": "",
  "href": "",
  "router": "",
  "tags": [],
  "plugins": "",
  "password": "",
  "fkprofile": 0,
  "fkpreviousparent": 0,
  "itemorder": 0,
  "parentid": 0,
  "subitems": [
    {
      "iitem": 1,
      "name": "Menu1",
      "title": "Menú 1",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "",
      "itemtype": eItems.dLINK,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": [
        {
          "iitem": 1,
          "name": "Busqueda",
          "title": "Página de búsquedas",
          "subtitle": "",
          "date": new Date(),
          "urlimg": "assets/find.png",
          "itemtype": eItems.dLINK,
          "hide": false,
          "html": "",
          "documentflow": "",
          "href": "",
          "router": "search",
          "tags": [],
          "plugins": "",
          "password": "",
          "fkprofile": 0,
          "fkpreviousparent": 0,
          "itemorder": 0,
          "parentid": 0,
          "subitems": []
        }
      ]
    },
    {
      "iitem": 1,
      "name": "pageMenu1",
      "title": "Menú 2",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "",
      "itemtype": eItems.cLINK_COLLECTION,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": [
        {
          "iitem": 1,
          "name": "op1",
          "title": "Ir a navegador de categorias",
          "subtitle": "",
          "date": new Date(),
          "urlimg": "assets/search.png",
          "itemtype": eItems.dLINK,
          "hide": false,
          "html": "",
          "documentflow": "",
          "href": "https://www.google.es",
          "router": "navigator",
          "tags": [],
          "plugins": "",
          "password": "",
          "fkprofile": 0,
          "fkpreviousparent": 0,
          "itemorder": 0,
          "parentid": 0,
          "subitems": []
        }
      ]
    },
    {
      "iitem": 1,
      "name": "pageMenu1",
      "title": "Menú 3",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "",
      "itemtype": eItems.cLINK_COLLECTION,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": [
        {
          "iitem": 1,
          "name": "op1",
          "title": "Ir a ejemplo de documento",
          "subtitle": "",
          "date": new Date(),
          "urlimg": "assets/entrada.png",
          "itemtype": eItems.dLINK,
          "hide": false,
          "html": "",
          "documentflow": "",
          "href": "",
          "router": "objects",
          "tags": [],
          "plugins": "",
          "password": "",
          "fkprofile": 0,
          "fkpreviousparent": 0,
          "itemorder": 0,
          "parentid": 0,
          "subitems": []
        },
        {
          "iitem": 1,
          "name": "pageMenu1",
          "title": "Ir al navegador",
          "subtitle": "",
          "date": new Date(),
          "urlimg": "assets/find.png",
          "itemtype": eItems.cLINK_COLLECTION,
          "hide": false,
          "html": "",
          "documentflow": "",
          "href": "",
          "router": "navigator",
          "tags": [],
          "plugins": "",
          "password": "",
          "fkprofile": 0,
          "fkpreviousparent": 0,
          "itemorder": 0,
          "parentid": 0,
          "subitems": [
            {
              "iitem": 1,
              "name": "op1",
              "title": "Ir a navegador de categorias",
              "subtitle": "",
              "date": new Date(),
              "urlimg": "assets/search.png",
              "itemtype": eItems.dLINK,
              "hide": false,
              "html": "",
              "documentflow": "",
              "href": "",
              "router": "navigator",
              "tags": [],
              "plugins": "",
              "password": "",
              "fkprofile": 0,
              "fkpreviousparent": 0,
              "itemorder": 0,
              "parentid": 0,
              "subitems": []
            }
          ]
        },
      ]
    },
    {
      "iitem": 1,
      "name": "pageMenu1",
      "title": "Ir a Google",
      "subtitle": "",
      "date": new Date(),
      "urlimg": "https://icons.iconarchive.com/icons/blackvariant/button-ui-app-pack-one/1024/Google-Chrome-2-icon.png",
      "itemtype": eItems.cLINK_COLLECTION,
      "hide": false,
      "html": "",
      "documentflow": "",
      "href": "https://www.google.es",
      "router": "",
      "tags": [],
      "plugins": "",
      "password": "",
      "fkprofile": 0,
      "fkpreviousparent": 0,
      "itemorder": 0,
      "parentid": 0,
      "subitems": []
    }
  ]
}

