/**
 * Copia solo los campos permitidos de un objeto.
 * Evita que el cliente cambie campos protegidos (rol, correo...) enviándolos en el cuerpo.
 */
export function elegirCampos(origen, permitidos) {
  const resultado = {};
  for (const campo of permitidos) {
    if (origen?.[campo] !== undefined) resultado[campo] = origen[campo];
  }
  return resultado;
}
