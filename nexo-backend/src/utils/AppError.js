/**
 * Error de negocio con código HTTP.
 * Los services lo lanzan y el manejador de errores lo convierte en respuesta JSON.
 *
 * @example throw new AppError(404, 'Monitoría no encontrada');
 */
export class AppError extends Error {
  /**
   * @param {number} codigo   Código HTTP (400, 403, 404, 409...)
   * @param {string} mensaje  Mensaje para el cliente
   * @param {object} [errores] Detalle opcional por campo
   */
  constructor(codigo, mensaje, errores) {
    super(mensaje);
    this.name = 'AppError';
    this.codigo = codigo;
    this.errores = errores;
  }
}
