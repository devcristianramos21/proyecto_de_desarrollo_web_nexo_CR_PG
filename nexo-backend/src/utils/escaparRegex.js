/**
 * Escapa los caracteres especiales para usar un texto del usuario dentro de una expresión regular.
 * Sin esto, una búsqueda como "C++" o ".*" cambiaría el significado de la consulta.
 */
export function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Cada letra base acepta también sus versiones con tilde
const VARIANTES = {
  a: '[aáàäâ]',
  e: '[eéèëê]',
  i: '[iíìïî]',
  o: '[oóòöô]',
  u: '[uúùüû]',
  n: '[nñ]',
};

/**
 * Expresión regular para buscar un texto sin importar tildes ni mayúsculas:
 * "calculo", "CÁLCULO" y "Cálculo" encuentran "Cálculo Diferencial".
 */
export function regexBusqueda(texto) {
  const sinTildes = String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '');
  const patron = escaparRegex(sinTildes).replace(/[aeioun]/gi, (letra) => VARIANTES[letra.toLowerCase()]);
  return new RegExp(patron, 'i');
}
