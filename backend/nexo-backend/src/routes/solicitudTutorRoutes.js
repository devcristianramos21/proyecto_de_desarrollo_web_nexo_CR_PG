import { Router } from 'express';
import {
  aprobarSolicitud,
  crearSolicitud,
  listarMisSolicitudes,
  listarSolicitudes,
  rechazarSolicitud,
} from '../controllers/solicitudTutorController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

const router = Router();

router.use(autenticar);

// Estudiante
router.post('/', permitir('estudiante'), crearSolicitud);
router.get('/mias', permitir('estudiante'), listarMisSolicitudes);

// Administrador
router.get('/', permitir('admin'), listarSolicitudes);
router.patch('/:id/aprobar', permitir('admin'), aprobarSolicitud);
router.patch('/:id/rechazar', permitir('admin'), rechazarSolicitud);

export default router;
