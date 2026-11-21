import { Router } from 'express';
import {
  actualizarParcial,
  crearParcial,
  eliminarParcial,
  listarParciales,
  listarPreparciales,
  verParcial,
} from '../controllers/parcialController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

const router = Router();

router.use(autenticar);

// Consulta: cualquier usuario con sesión
router.get('/', listarParciales);
router.get('/:id', verParcial);
router.get('/:id/preparciales', listarPreparciales);

// Gestión: administrador
router.post('/', permitir('admin'), crearParcial);
router.put('/:id', permitir('admin'), actualizarParcial);
router.delete('/:id', permitir('admin'), eliminarParcial);

export default router;
