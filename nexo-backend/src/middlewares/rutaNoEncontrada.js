/** Responde 404 a cualquier ruta que no coincida con las registradas. */
export function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}
