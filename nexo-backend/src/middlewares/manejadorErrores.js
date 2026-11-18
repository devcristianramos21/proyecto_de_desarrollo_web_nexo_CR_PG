import { AppError } from '../utils/AppError.js';

/**
 * Manejador central de errores.
 * Express 5 envía aquí los errores lanzados en controladores y services async.
 * Debe declarar los 4 parámetros (aunque no use _next) para que Express lo reconozca como manejador de errores.
 */
export function manejadorErrores(error, _req, res, _next) {
  // Errores de negocio lanzados por los services
  if (error instanceof AppError) {
    const cuerpo = { mensaje: error.message };
    if (error.errores) cuerpo.errores = error.errores;
    return res.status(error.codigo).json(cuerpo);
  }

  // Validaciones de Mongoose
  if (error.name === 'ValidationError') {
    const errores = {};
    for (const [campo, detalle] of Object.entries(error.errors)) {
      errores[campo] = detalle.name === 'CastError' ? 'Valor no válido' : detalle.message;
    }
    return res.status(400).json({ mensaje: 'Datos no válidos', errores });
  }

  // Valor repetido en un campo único (por ejemplo, dos registros simultáneos con el mismo correo)
  if (error.code === 11000) {
    const campo = Object.keys(error.keyValue ?? {})[0];
    return res.status(409).json({
      mensaje: campo === 'correo' ? 'Ya existe una cuenta con ese correo' : 'El registro ya existe',
    });
  }

  // Id con formato inválido
  if (error.name === 'CastError') {
    return res.status(400).json({ mensaje: 'Identificador no válido' });
  }

  // Cuerpo JSON mal formado
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error(error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}
