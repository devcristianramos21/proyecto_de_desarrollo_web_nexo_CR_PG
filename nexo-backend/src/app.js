import cors from 'cors';
import express from 'express';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { rutaNoEncontrada } from './middlewares/rutaNoEncontrada.js';
import authRoutes from './routes/authRoutes.js';
import disponibilidadRoutes from './routes/disponibilidadRoutes.js';
import monitoriaRoutes from './routes/monitoriaRoutes.js';
import solicitudTutorRoutes from './routes/solicitudTutorRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

// Configuración de Express, separada de server.js para poder probar la API sin abrir un puerto.
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ mensaje: 'API de NEXO funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/solicitudes-tutor', solicitudTutorRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);
app.use('/api/tutores', tutorRoutes);
// Aún sin autenticación: se protege al rehacer las monitorías en la fase 3
app.use('/api/monitorias', monitoriaRoutes);

// Estos dos van siempre al final
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

export default app;
