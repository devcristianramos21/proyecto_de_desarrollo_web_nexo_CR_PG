import { Router } from 'express';
import {
  actualizarFranja,
  crearFranja,
  eliminarFranja,
  listarMiDisponibilidad,
} from '../controllers/disponibilidadController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

// Gestión de la disponibilidad propia. Para ver la de otro tutor: GET /api/tutores/:id/disponibilidad
const router = Router();

router.use(autenticar, permitir('tutor'));

router.get('/mia', listarMiDisponibilidad);
router.post('/', crearFranja);
router.put('/:id', actualizarFranja);
router.delete('/:id', eliminarFranja);

export default router;
