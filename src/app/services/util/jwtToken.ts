import jwt_decode from "jwt-decode";

/**
 * Estructura de TOKEN_JWT
 */
export default class jwtToken{
  public id:number|undefined
  public userID:string="";
  public role:string="";
  public exp:string="";
}

/**
 * Clase estática con métodos útiles
 * de decodificación de un token JWT
 * @export
 * @class jwtUTIL
 */
export class jwtUTIL{
  public static getjwtRole(jwtTokenString:string):string{
    let jwtToken:jwtToken=jwt_decode(jwtTokenString);
    return jwtToken.role;
  }
  public static getjwtExpiredTime(jwTokenString:string):number{
    let jwtToken:jwtToken=jwt_decode(jwTokenString);
    let seconds=Number.parseInt(jwtToken.exp);
    return seconds;
  }
  public static getjwtUserID(jwtTokenString:string):string{
    let jwtToken:jwtToken=jwt_decode(jwtTokenString);
    return jwtToken.userID;
  }
}
