import cors from 'cors';
import express from 'express';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { rutaNoEncontrada } from './middlewares/rutaNoEncontrada.js';
import authRoutes from './routes/authRoutes.js';
import calendarioRoutes from './routes/calendarioRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import disponibilidadRoutes from './routes/disponibilidadRoutes.js';
import monitoriaRoutes from './routes/monitoriaRoutes.js';
import parcialRoutes from './routes/parcialRoutes.js';
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
app.use('/api/monitorias', monitoriaRoutes);
app.use('/api/parciales', parcialRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/chat', chatRoutes);

// Estos dos van siempre al final
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

export default app;
