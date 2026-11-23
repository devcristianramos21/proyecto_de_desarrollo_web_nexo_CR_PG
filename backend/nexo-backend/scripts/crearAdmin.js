/**
 * Crea un administrador, o convierte en administrador una cuenta que ya existe.
 * El registro público nunca crea administradores: este script es la única forma.
 *
 * Uso (desde la carpeta nexo-backend):
 *   npm run crear-admin -- "Nombre Apellido" correo@urosario.edu.co "contraseña"
 *
 * Si el correo ya está registrado, solo se cambia su rol a admin (la contraseña no se toca).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarBaseDeDatos } from '../src/config/database.js';
import { Usuario } from '../src/models/Usuario.js';

const [nombre, correo, password] = process.argv.slice(2);

if (!nombre || !correo) {
  console.error('Uso: npm run crear-admin -- "Nombre Apellido" correo@urosario.edu.co "contraseña"');
  process.exit(1);
}

try {
  await conectarBaseDeDatos();

  const existente = await Usuario.findOne({ correo: correo.trim().toLowerCase() });

  if (existente) {
    existente.rol = 'admin';
    await existente.save();
    console.log(`La cuenta ${existente.correo} ahora es administrador.`);
  } else {
    if (!password) {
      throw new Error('Para una cuenta nueva también debes indicar la contraseña');
    }
    const admin = await Usuario.create({ nombre, correo, password, rol: 'admin' });
    console.log(`Administrador creado: ${admin.correo}`);
  }
} catch (error) {
  if (error.name === 'ValidationError') {
    for (const detalle of Object.values(error.errors)) console.error(`- ${detalle.message}`);
  } else {
    console.error(`No se pudo crear el administrador: ${error.message}`);
  }
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
