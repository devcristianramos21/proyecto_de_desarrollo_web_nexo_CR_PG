import cors from 'cors';
import express from 'express';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { rutaNoEncontrada } from './middlewares/rutaNoEncontrada.js';
import { origenFrontendPermitido } from './config/origenesFrontend.js';
import { validarOrigen } from './middlewares/validarOrigen.js';
import authRoutes from './routes/authRoutes.js';
import calendarioRoutes from './routes/calendarioRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import disponibilidadRoutes from './routes/disponibilidadRoutes.js';
import monitoriaRoutes from './routes/monitoriaRoutes.js';
import notificacionRoutes from './routes/notificacionRoutes.js';
import parcialRoutes from './routes/parcialRoutes.js';
import solicitudTutorRoutes from './routes/solicitudTutorRoutes.js';
import ticketSoporteRoutes from './routes/ticketSoporteRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import evaluacionRoutes from './routes/evaluacionRoutes.js';

// Configuración de Express, separada de server.js para poder probar la API sin abrir un puerto.
const app = express();

app.use(cors({
  origin(origen, callback) {
    callback(null, origenFrontendPermitido(origen) ? origen : false);
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-NEXO-Requested-With',
  ],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(validarOrigen);
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
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/soporte/tickets', ticketSoporteRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/api/parciales', parcialRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/chat', chatRoutes);

// Estos dos van siempre al final
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

export default app;
