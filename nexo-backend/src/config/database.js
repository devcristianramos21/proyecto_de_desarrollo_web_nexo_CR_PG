import mongoose from 'mongoose';

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

  await mongoose.connect(uri);
  console.log(`MongoDB conectado: ${mongoose.connection.host}`);
}
