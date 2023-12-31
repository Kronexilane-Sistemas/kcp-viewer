/* --------------
*  DATOS GLOBALES
*  --------------
*/

import { environment } from "src/environments/environment";

// Archivo estandar de configuración backend
export const STD:string=environment.production?"production":"developer";

// Portafolio por defecto
export const DEFAULT_PORTFOLIO:string=environment.production?"others.portfolio":"others.portfolio.developer";
//export const DEFAULT_PORTFOLIO:string="others.portfolio";

// Usuario del sistema para operaciones especiales
export const SysUser=['s839874r9$_%84-@4984','94$_%8jioewqtkjhfvdal_$%']

// Imagen de fondo y de ilustración de cabecera de portafolio por defecto

export const ImagePortfolio=['/assets/header.jpg','/assets/computer.png']
