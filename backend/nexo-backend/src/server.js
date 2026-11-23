import 'dotenv/config';
import { createServer } from 'node:http';
import app from './app.js';
import { conectarBaseDeDatos } from './config/database.js';
import { configurarSockets } from './sockets/chatSocket.js';

const PUERTO = process.env.PORT || 3001;

try {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en el archivo .env');
  }

  await conectarBaseDeDatos();

  // Express (API REST) y Socket.IO (chat en tiempo real) comparten el mismo puerto
  const servidor = createServer(app);
  configurarSockets(servidor);

  servidor.listen(PUERTO, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
  });
} catch (error) {
  console.error(`No se pudo iniciar el servidor: ${error.message}`);
  process.exit(1);
}
