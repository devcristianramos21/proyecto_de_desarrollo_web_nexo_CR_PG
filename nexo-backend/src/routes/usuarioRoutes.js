import { Router } from 'express';
import {
  agregarFavorito,
  listarFavoritos,
  quitarFavorito,
} from '../controllers/favoritoController.js';
import {
  actualizarMiPerfil,
  cambiarMiPassword,
  verMiPerfil,
} from '../controllers/usuarioController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

const router = Router();

// Todas las rutas de este archivo requieren sesión
router.use(autenticar);

router.get('/me', verMiPerfil);
router.put('/me', actualizarMiPerfil);
router.patch('/me/password', cambiarMiPassword);

// Tutores favoritos (estudiantes y tutores)
router.get('/me/favoritos', permitir('estudiante'), listarFavoritos);
router.post('/me/favoritos/:tutorId', permitir('estudiante'), agregarFavorito);
router.delete('/me/favoritos/:tutorId', permitir('estudiante'), quitarFavorito);

export default router;
