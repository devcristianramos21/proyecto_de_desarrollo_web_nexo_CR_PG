/**
 * Escapa los caracteres especiales para usar un texto del usuario dentro de una expresión regular.
 * Sin esto, una búsqueda como "C++" o ".*" cambiaría el significado de la consulta.
 */
export function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
