import { Router } from 'express';
import * as c from '../controllers/chatController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

// Chat entre estudiantes y tutores (los administradores no participan)
const router = Router();

router.use(autenticar, permitir('estudiante'));

router.get('/contactos', c.listarContactos);
router.get('/conversaciones', c.listarConversaciones);
router.post('/conversaciones/directa', c.abrirDirecta);
router.post('/conversaciones/grupo', c.abrirGrupo);
router.get('/conversaciones/:id/mensajes', c.listarMensajes);
router.post('/conversaciones/:id/mensajes', c.enviarMensaje);

export default router;
