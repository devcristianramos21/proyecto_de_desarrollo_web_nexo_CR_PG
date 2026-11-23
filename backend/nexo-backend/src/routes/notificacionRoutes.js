import { Router } from 'express';
import * as c from '../controllers/notificacionController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

router.use(autenticar);
router.get('/', c.listar);
router.patch('/leidas', c.marcarTodasLeidas);
router.patch('/:id/leida', c.marcarLeida);

export default router;
