import { Router } from 'express';
import {
  buscarTutores,
  verDisponibilidadDeTutor,
  verTutor,
} from '../controllers/tutorController.js';
import { autenticar } from '../middlewares/autenticar.js';

// Consulta de tutores: disponible para cualquier usuario con sesión
const router = Router();

router.use(autenticar);

router.get('/', buscarTutores);
router.get('/:id', verTutor);
router.get('/:id/disponibilidad', verDisponibilidadDeTutor);

export default router;
