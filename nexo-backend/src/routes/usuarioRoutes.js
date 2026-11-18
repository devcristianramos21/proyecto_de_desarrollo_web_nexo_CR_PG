import { Router } from 'express';
import {
  actualizarMiPerfil,
  cambiarMiPassword,
  verMiPerfil,
} from '../controllers/usuarioController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

// Todas las rutas de este archivo requieren sesión
router.use(autenticar);

router.get('/me', verMiPerfil);
router.put('/me', actualizarMiPerfil);
router.patch('/me/password', cambiarMiPassword);

export default router;
