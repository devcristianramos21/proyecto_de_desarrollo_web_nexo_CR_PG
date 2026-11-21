import { Router } from 'express';
import { verCalendario } from '../controllers/monitoriaController.js';
import { autenticar } from '../middlewares/autenticar.js';

// GET /api/calendario?desde=2026-11-01&hasta=2026-11-30
// En la fase 4 se agregan aquí las fechas de parciales.
const router = Router();

router.get('/', autenticar, verCalendario);

export default router;
