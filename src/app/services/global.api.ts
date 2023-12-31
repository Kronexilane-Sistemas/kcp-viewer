/***************************
 * CONFIGURACIÓN DEL BACKEND
 ***************************/

/*** Rutas a los servicios BACKEND */
export const API={
  // Test del servidor
  TEST: "test/time",

  // Servicios de autenticación
  AUTENTICATION_LOGIN:"kronexilane/autentication/login",

  // Gestión de parámetros
  GET_SETTINGS:"kcp/audit/parameters/listValues",
  UPDATE_SETTINGS:"kcp/audit/parameters/updateValues",

  // API de gestión de Visor de portafolios
  VISITOR_COUNT:"kcp/user/getUserCountConnections",
  GET_PORTFOLIO:"kcp/visitor/getPortfolio",
  GET_ITEMS:"kcp/visitor/getItems",
  GET_MENU:"kcp/visitor/getMenu",
  GET_DOC:"kcp/visitor/getDocument",

  // GESTIÓN CORREO ELECTRÓNICO
  GET_SUBJECTS:"kcp/visitor/getEmailSubjects",
  SENDMAIL:"kcp/visitor/sendEmail",

  // Funciones de administrador autorizadas
  GET_PATH_ITEM: "kcp/administrator/getItemPath",
  GET_ITEM_TAGS: "kcp/administrator/getTags",

  // Funciones del Motor de Búsqueda
  SEARCH_ITEMS: "kcp/visitor/ItemSearch"
};
