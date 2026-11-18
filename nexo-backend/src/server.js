import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { conectarBaseDeDatos } from './config/database.js';
import monitoriaRoutes from './routes/monitoriaRoutes.js';

const PUERTO = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ mensaje: 'API de NEXO funcionando' });
});

app.use('/api/monitorias', monitoriaRoutes);

// Ruta inexistente
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador de errores: Express 5 envía aquí los errores de los controladores async.
app.use((error, _req, res, _next) => {
  if (error.name === 'ValidationError') {
    const errores = {};
    for (const [campo, detalle] of Object.entries(error.errors)) {
      errores[campo] = detalle.name === 'CastError' ? 'Valor no válido' : detalle.message;
    }
    return res.status(400).json({ mensaje: 'Datos no válidos', errores });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ mensaje: 'Identificador no válido' });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error(error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

try {
  await conectarBaseDeDatos();
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
} catch (error) {
  console.error(`No se pudo iniciar el servidor: ${error.message}`);
  process.exit(1);
}
