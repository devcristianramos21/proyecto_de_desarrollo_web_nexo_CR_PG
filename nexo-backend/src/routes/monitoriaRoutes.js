import { Router } from 'express';
import {
  actualizarMonitoria,
  crearMonitoria,
  eliminarMonitoria,
  listarMonitorias,
  obtenerMonitoria,
} from '../controllers/monitoriaController.js';

const router = Router();

router.get('/', listarMonitorias);
router.post('/', crearMonitoria);
router.get('/:id', obtenerMonitoria);
router.put('/:id', actualizarMonitoria);
router.delete('/:id', eliminarMonitoria);

export default router;
