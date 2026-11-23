import { AppError } from '../utils/AppError.js';
import { origenFrontendPermitido } from '../config/origenesFrontend.js';

const METODOS_CON_CAMBIOS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const CABECERA_CSRF = 'X-NEXO-Requested-With';
const VALOR_CSRF = 'XMLHttpRequest';

export function validarOrigen(req, _res, next) {
  const origen = req.get('Origin');
  if (!origen) return next();

  if (!origenFrontendPermitido(origen)) {
    return next(new AppError(403, 'Origen no autorizado'));
  }

  if (
    METODOS_CON_CAMBIOS.has(req.method)
    && req.get(CABECERA_CSRF) !== VALOR_CSRF
  ) {
    return next(new AppError(403, 'Solicitud de navegador no válida'));
  }

  return next();
}
