import { eItems, kcp_item } from "../categories/categories.model";

/**
 * Clase extra con metodos
 */
export class extra {
  public getRandomID(maxLen: number): string {
    let data: string[] = ['a', 'B', 'c', 's', 'y', 'x', 'Z'];
    let result: string = "";
    for (let i: number = 0; i < maxLen; i++) {
      let car: number = Math.floor(Math.random() * 7);
      result = result.concat(data[car]);
    }
    return result;
  }
}

// Item de Ejemplo
export const itemExample:kcp_item = {

   "iitem": 1,
   "name": "presentation_uno",
   "title": "JAVA ADVANCED CONSOLE",
   "subtitle": "Interfaz avanzada de consola en Java",
   "date": new Date(),
   "urlimg": "https://www.trotamundo.es/wp-content/uploads/2016/02/zaragoza-turismo.jpg",
   "itemtype": eItems.dWEB,
   "hide": false,
   "html":
     `
     <div "container-xxl">
       <div class="row text-center text-dark text-capitalize p-4">
         <p class="col-6 border border-bottom" align="justify">
           Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, vel libero ipsam pariatur asperiores eos placeat, voluptatem illum expedita laudantium quo repellat excepturi ab accusamus inventore temporibus doloremque error voluptatibus voluptas sint fuga consectetur! Aut cupiditate tempore sit est voluptas accusantium, officiis eum!
         </p>
         <p class="col-6 border border-bottom" align="justify">
           Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, vel libero ipsam pariatur asperiores eos placeat, voluptatem illum expedita laudantium quo repellat excepturi ab accusamus inventore temporibus doloremque error voluptatibus voluptas sint fuga consectetur! Aut cupiditate tempore sit est voluptas accusantium, officiis eum!
         </p>
       </div>
     </div>
   `,
   "documentflow":  // Array de inyección 2
     [
       {
         "name": "docheader",
         "image": true,
         "imageshadow": false,
         "imageborder": false,
         "imagecircle": false,
         "menu": "main",
         "rstates": ['Abrir menú', 'Cerrar menú'],
         "rstyle": "menu",
         "rdecorated": true,
         "rmoreinfo": true
       },
       {
         "name": "docfooter",
         "tags": true,
         "path": "Kronexilane://Elemento1/Elemento2/Elemento3/Elemento4",
         "moreinfo": true,
         "decoratetable": true,
         "buttons": undefined  //['Abrir tabla de referencias', 'Cerrar tabla de referencias']

       },
       {
         "name": "docresume",
         "img": "pepe",
         "title": "Titulo del resumen",
         "Subtitle": "Subtitulo del resumen",
         "Text": "texto del resumen",
       },
       {
         "component": "doccontent",
         "padding": 0,
         "margin": 0,
         "title": "Fragmento 14",
         "subtitle": "Explicación del artículo",
         "text": "Aquí irá el primer texto del artículo sobre el trabajo expuesto en el portafolios. Está grabado en una estructura en la base de datos de KCP que será editable mediante la aplicación de administrador. <a href='http://admin.kronexilane.org'>http://admin.kronexilane.org</a>",
         "media": "https://1.bp.blogspot.com/-eBrXZG0IwCU/X49etU0PTyI/AAAAAAAAAOE/aJChtNZl2JQRLMCehGprGFgLNgUjUcENACLcBGAsYHQ/s1000/curso%2Bde%2Bdesarrollo%2Bweb.jpg",
         "imageparams": "border shadow",
         "imagedimensions": "100%,100%",
         "mediatype": "image",
         "href": "",
         "reverse": true
       },
       {
         "padding": 0,
         "margin": 0,
         "imageparams": "border,shadow,circle",
         "component": "doccontent",
         "title": "",
         "subtitle": "",
         "text": "Aquí irá el segundo texto del artículo sobre el trabajo expuesto en el portafolios. Está grabado en una estructura en la base de datos de KCP que será editable mediante la aplicación de administrador de portafolios. <a href='http://admin.kronexilane.org'>http://admin.kronexilane.org</a>",
         "media": "https://www.youtube.com/embed/gEPmA3USJdI",
         "mediatype": "youtube-video",
         "youtubeparams": "autoplay=0",
         "width": "100%",
         "height": "370px",
         "reverse": false
       },
       {
         "component": "doctable",
         "menu": "main",
         "decorated": true,
         "moreinfo": true
       },
       {
         "component": "doccontent",
         "border": false,
         "shadow": false,
         "padding": 0,
         "margin": 0,
         "title": "Vídeo en el servidor",
         "subtitle": "Explicación del artículo",
         "text": "Aquí irá el tercer texto del artículo sobre el trabajo expuesto en el portafolios. Está grabado en una estructura en la base de datos de KCP que será editable mediante la aplicación de administrador. <a href='http://admin.kronexilane.org'>http://admin.kronexilane.org</a>",
         "media": "https://www.kronexilane.org/assets/deja.mp4",
         "mediatype": "video",
         "dimensions": "100%,120px",
         "poster": "assets/portada.png",
         "controls": true,
         "autoplay": false,
         "preload": "metadata",
         "reverse": false,
         "href": "app|navigator"
       },
       {
         "component": "doccontent",
         "title": "Videos,Imagenes,Textos",
         "subtitle": "Con sus parámetros específicos",
         "text": "Todos los fragmentos del artículo son compuestos por texto/video/imagen o sólo uno , pudiendo especificar los parámetros de visualización de video: Inyección de video desde el propio servidor, youtube u otros servicios de video.",
         "media": "https://www.youtube.com/embed/T2T5_seDNZE",
         "mediatype": "youtube-video",
         "youtubeparams": "controls=1,autoplay=0",
         "reverse": true
       },
       {
         "component": "doccontent",
         "title": "Videos,Imagenes,Textos",
         "subtitle": "Con sus parámetros específicos",
         "text": "Todos los fragmentos del artículo son compuestos por texto/video/imagen o sólo uno , pudiendo especificar los parámetros de visualización de video: Inyección de video desde el propio servidor, youtube u otros servicios de video.",
         "youtubeparams": "controls=1,autoplay=0",
         "reverse": true
       },
       {
         "component": "doctable",
         "menu": "kronexilane://menus",
         "decorated": false,
         "moreinfo": true
       },
       {
         "padding": 0,
         "margin": 0,
         "imageparams": "border,shadow,circle",
         "component": "doccontent",
         "title": "Fragmento 2",
         "subtitle": "Explicación del artículo 2",
         "text": "Aquí irá el segundo texto del artículo sobre el trabajo expuesto en el portafolios. Está grabado en una estructura en la base de datos de KCP que será editable mediante la aplicación de administrador de portafolios. <a href='http://admin.kronexilane.org'>http://admin.kronexilane.org</a>",
         "media": "https://www.youtube.com/embed/gEPmA3USJdI",
         "mediatype": "youtube-video",
         "youtubeparams": "autoplay=0",
         "width": "100%",
         "height": "370px",
         "reverse": true
       },
     ],
   "href": "",
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

