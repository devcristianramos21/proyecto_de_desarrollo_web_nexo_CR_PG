import { Router } from 'express';
import { login, logout, registro } from '../controllers/authController.js';

// Rutas públicas: no requieren token
const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', logout);

export default router;
