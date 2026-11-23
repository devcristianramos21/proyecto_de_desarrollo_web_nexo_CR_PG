import { Router } from 'express';
import { login, registro } from '../controllers/authController.js';

// Rutas públicas: no requieren token
const router = Router();

router.post('/registro', registro);
router.post('/login', login);

export default router;
