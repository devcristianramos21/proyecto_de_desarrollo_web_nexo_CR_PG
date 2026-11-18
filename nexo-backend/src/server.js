import 'dotenv/config';
import app from './app.js';
import { conectarBaseDeDatos } from './config/database.js';

const PUERTO = process.env.PORT || 3001;

try {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en el archivo .env');
  }

  await conectarBaseDeDatos();
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
} catch (error) {
  console.error(`No se pudo iniciar el servidor: ${error.message}`);
  process.exit(1);
}
