/**
 * Borra los usuarios de prueba (correo "prueba.*@urosario.edu.co", los que crea la colección de Postman)
 * y todo lo que depende de ellos: monitorías, franjas, solicitudes, parciales, conversaciones y mensajes.
 *
 * Uso (desde nexo-backend):
 *   npm run limpiar-pruebas                  Solo muestra lo que borraría (no borra nada)
 *   npm run limpiar-pruebas -- --confirmar   Borra
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarBaseDeDatos } from '../src/config/database.js';
import { borrarUsuariosYDependencias, buscarPorPrefijo, imprimirResumen } from './utilidades.js';

const PREFIJO = 'prueba.';
const confirmar = process.argv.includes('--confirmar');

try {
  await conectarBaseDeDatos();

  const usuarios = await buscarPorPrefijo(PREFIJO);
  if (!usuarios.length) {
    console.log(`No hay usuarios de prueba (${PREFIJO}*). Nada que limpiar.`);
  } else if (!confirmar) {
    const resumen = await borrarUsuariosYDependencias(usuarios.map((u) => u._id), { simular: true });
    imprimirResumen(`Se borrarían (${PREFIJO}*):`, resumen);
    console.log('\nNo se borró nada. Para borrar: npm run limpiar-pruebas -- --confirmar');
  } else {
    const resumen = await borrarUsuariosYDependencias(usuarios.map((u) => u._id));
    imprimirResumen('Datos de prueba eliminados:', resumen);
  }
} catch (error) {
  console.error(`No se pudo limpiar: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
