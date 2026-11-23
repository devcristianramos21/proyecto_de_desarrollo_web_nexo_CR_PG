import { Router } from 'express';
import * as c from '../controllers/ticketSoporteController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

const router = Router();

router.use(autenticar);
router.post('/', permitir('estudiante'), c.crear);
router.get('/mias', permitir('estudiante'), c.listarMios);
router.get('/', permitir('admin'), c.listar);
router.patch('/:id', permitir('admin'), c.actualizar);

export default router;
