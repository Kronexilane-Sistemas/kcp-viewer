/**------------------------------------------
 *  FUNCIONES GENÉRICAS JS/TS DE MÚLTIPLE USO
 *-------------------------------------------/

/**
 * Genera un ID para el campo ID del DOM aleatorio
 * @param maxLen Máxima longitud que se quiera
 * @returns
 */

export function getRandomIDForDOM(maxLen: number): string {
  let data: string[] = ['a', 'B', 'c', 's', 'y', 'x', 'Z'];
  let result: string = "";
  for (let i: number = 0; i < maxLen; i++) {
    let car: number = Math.floor(Math.random() * 7);
    result = result.concat(data[car]);
  }
  return result;
}

