import cors from 'cors';
import express from 'express';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { rutaNoEncontrada } from './middlewares/rutaNoEncontrada.js';
import authRoutes from './routes/authRoutes.js';
import monitoriaRoutes from './routes/monitoriaRoutes.js';
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
// Aún sin autenticación: se protege al rehacer las monitorías en la fase 3
app.use('/api/monitorias', monitoriaRoutes);

// Estos dos van siempre al final
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

export default app;
