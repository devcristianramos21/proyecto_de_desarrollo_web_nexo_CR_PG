import dns from 'node:dns';
import mongoose from 'mongoose';

// DNS públicos (Google y Cloudflare) para cuando Node no logra leer el DNS de Windows
const DNS_PUBLICOS = ['8.8.8.8', '1.1.1.1'];
const DNS_LOCALES = ['127.0.0.1', '::1'];

/**
 * Las cadenas mongodb+srv:// necesitan una consulta DNS de tipo SRV para encontrar el cluster.
 * En algunos equipos Windows, Node no lee el DNS configurado en la red y usa 127.0.0.1,
 * donde no hay ningún servidor: la conexión falla con "querySrv ECONNREFUSED".
 * En ese caso se usan DNS públicos. DNS_SERVERS en .env permite fijarlos manualmente.
 */
function configurarDns() {
  const manuales = process.env.DNS_SERVERS?.split(',')
    .map((servidor) => servidor.trim())
    .filter(Boolean);

  if (manuales?.length) {
    dns.setServers(manuales);
    return;
  }

  const actuales = dns.getServers();
  if (actuales.every((servidor) => DNS_LOCALES.includes(servidor))) {
    dns.setServers(DNS_PUBLICOS);
    console.warn(`Node no encontró el DNS de la red; se usarán ${DNS_PUBLICOS.join(' y ')}`);
  }
}

/**
 * Abre la conexión con MongoDB Atlas usando la cadena definida en .env.
 * Lanza un error si la cadena no está configurada o la conexión falla.
 */
export async function conectarBaseDeDatos() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'TU_CADENA_DE_CONEXION') {
    throw new Error(
      'Falta MONGODB_URI: pega la cadena de conexión de MongoDB Atlas en el archivo .env',
    );
  }

  if (uri.startsWith('mongodb+srv://')) {
    configurarDns();
  }

  await mongoose.connect(uri);
  console.log(`MongoDB conectado: ${mongoose.connection.host}`);
}
