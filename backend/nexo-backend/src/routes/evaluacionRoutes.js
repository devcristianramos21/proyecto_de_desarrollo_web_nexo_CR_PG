import { Router } from 'express';
import * as c from '../controllers/evaluacionController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

const router = Router();

router.use(autenticar, permitir('estudiante'));
router.get('/mias', c.listarMias);
router.post('/', c.crear);

export default router;
