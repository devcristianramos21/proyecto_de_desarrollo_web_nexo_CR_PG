/**
 * Carga datos de ejemplo para desarrollar el frontend: un admin, 3 tutores, 8 estudiantes,
 * disponibilidad, monitorías de los 4 tipos, un parcial, favoritos y conversaciones.
 * Todos los correos empiezan por "demo." y la contraseña de todos es Nexo12345.
 *
 * Uso (desde nexo-backend):
 *   npm run seed                  Carga los datos (si ya existen, avisa y no hace nada)
 *   npm run seed -- --reiniciar   Borra los datos demo y los vuelve a cargar con fechas actualizadas
 *   npm run seed -- --borrar      Solo borra los datos demo
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarBaseDeDatos } from '../src/config/database.js';
import { Conversacion } from '../src/models/Conversacion.js';
import { Disponibilidad } from '../src/models/Disponibilidad.js';
import { Mensaje } from '../src/models/Mensaje.js';
import { Monitoria } from '../src/models/Monitoria.js';
import { Parcial } from '../src/models/Parcial.js';
import { SolicitudTutor } from '../src/models/SolicitudTutor.js';
import { Usuario } from '../src/models/Usuario.js';
import { aTextoFecha, hoyEnColombia } from '../src/utils/fechas.js';
import { borrarUsuariosYDependencias, buscarPorPrefijo, imprimirResumen } from './utilidades.js';

const PREFIJO = 'demo.';
const PASSWORD = 'Nexo12345';
const correo = (nombre) => `${PREFIJO}${nombre}@urosario.edu.co`;

const reiniciar = process.argv.includes('--reiniciar');
const soloBorrar = process.argv.includes('--borrar');

// Fechas: el lunes a 7 días o más de hoy, y los días siguientes de esa semana
function semanaDeEjemplo() {
  const lunes = hoyEnColombia();
  lunes.setUTCDate(lunes.getUTCDate() + 7);
  while (lunes.getUTCDay() !== 1) lunes.setUTCDate(lunes.getUTCDate() + 1);
  const dia = (n) => new Date(lunes.getTime() + n * 24 * 60 * 60 * 1000);
  return { lunes: dia(0), martes: dia(1), miercoles: dia(2), jueves: dia(3), viernes: dia(4), sabado: dia(5) };
}

async function cargar() {
  const crearUsuario = (datos) => Usuario.create({ password: PASSWORD, carrera: 'Ingeniería', ...datos });

  // Usuarios
  const admin = await crearUsuario({ nombre: 'Administración NEXO', correo: correo('admin'), rol: 'admin', carrera: undefined });
  const ana = await crearUsuario({ nombre: 'Ana Pérez', correo: correo('tutor.ana'), rol: 'tutor', semestre: 8, materias: ['Cálculo Diferencial', 'Álgebra Lineal'], biografia: 'Monitora de matemáticas desde hace dos semestres.' });
  const luis = await crearUsuario({ nombre: 'Luis Gómez', correo: correo('tutor.luis'), rol: 'tutor', semestre: 7, materias: ['Física I', 'Cálculo Diferencial'] });
  const sofia = await crearUsuario({ nombre: 'Sofía Rodríguez', correo: correo('tutor.sofia'), rol: 'tutor', semestre: 9, materias: ['Programación', 'Estructuras de Datos', 'Razonamiento cuantitativo'] });

  const nombres = ['Camila Torres', 'Daniel Ruiz', 'Valentina Díaz', 'Santiago Moreno', 'Isabella Castro', 'Mateo Herrera', 'Mariana López', 'Julián Vargas'];
  const est = [];
  for (const [i, nombre] of nombres.entries()) {
    est.push(await crearUsuario({ nombre, correo: correo(`estudiante${i + 1}`), semestre: (i % 4) + 2 }));
  }

  // Disponibilidad de los tutores
  await Disponibilidad.create([
    { tutor: ana._id, diaSemana: 'lunes', horaInicio: '14:00', horaFin: '18:00' },
    { tutor: ana._id, diaSemana: 'miercoles', horaInicio: '08:00', horaFin: '12:00' },
    { tutor: luis._id, diaSemana: 'martes', horaInicio: '10:00', horaFin: '14:00' },
    { tutor: sofia._id, diaSemana: 'jueves', horaInicio: '14:00', horaFin: '18:00' },
  ]);

  // Un estudiante con solicitud para ser tutor pendiente de revisión
  await SolicitudTutor.create({ estudiante: est[7]._id, materias: ['Inglés'], motivacion: 'Viví un año en Canadá y quiero ayudar a mis compañeros con inglés.' });

  // Favoritos
  await Usuario.updateOne({ _id: est[0]._id }, { favoritos: [ana._id, sofia._id] });

  const s = semanaDeEjemplo();
  const base = { creadaPor: admin._id, estado: 'programada' };

  // Parcial y su preparcial
  const parcial = await Parcial.create({ materia: 'Cálculo Diferencial', nombre: 'Primer parcial', fecha: s.viernes, hora: '08:00', descripcion: 'Límites, continuidad y derivadas', creadoPor: admin._id });

  const preparcial = await Monitoria.create({
    ...base, tipo: 'preparcial', parcial: parcial._id, materia: parcial.materia, tema: 'Repaso general', tutor: ana._id,
    fecha: s.miercoles, horaInicio: '16:00', horaFin: '18:00', modalidad: 'virtual', lugar: 'Enlace de Teams',
    estudiantes: [est[0]._id, est[1]._id, est[2]._id],
  });

  // Saber Pro con el mínimo de 7 alcanzado
  await Monitoria.create({
    ...base, tipo: 'saber_pro', materia: 'Saber Pro: Razonamiento cuantitativo', tutor: sofia._id,
    fecha: s.sabado, horaInicio: '08:00', horaFin: '11:00', modalidad: 'presencial', lugar: 'Auditorio Principal',
    estudiantes: est.slice(0, 7).map((e) => e._id),
  });

  // Saber Pro que aún no llega al mínimo
  await Monitoria.create({
    ...base, tipo: 'saber_pro', materia: 'Saber Pro: Lectura crítica', tutor: sofia._id,
    fecha: s.sabado, horaInicio: '14:00', horaFin: '16:00', modalidad: 'virtual', estudiantes: [est[3]._id, est[4]._id],
  });

  // Obligatoria con dos grupos
  await Monitoria.create([
    { ...base, tipo: 'obligatoria', materia: 'Cálculo Diferencial', grupo: 'A', tutor: luis._id, fecha: s.martes, horaInicio: '14:00', horaFin: '16:00', modalidad: 'presencial', lugar: 'Salón 301', estudiantes: [est[0]._id, est[1]._id, est[2]._id, est[3]._id] },
    { ...base, tipo: 'obligatoria', materia: 'Cálculo Diferencial', grupo: 'B', tutor: ana._id, fecha: s.jueves, horaInicio: '10:00', horaFin: '12:00', modalidad: 'presencial', lugar: 'Salón 305', estudiantes: [est[4]._id, est[5]._id, est[6]._id] },
  ]);

  // Monitorías par: una aceptada y una solicitada (pendiente de respuesta del tutor)
  const parAceptada = await Monitoria.create({ tipo: 'par', estado: 'programada', materia: 'Cálculo Diferencial', tema: 'Regla de la cadena', tutor: ana._id, estudiantes: [est[0]._id], creadaPor: est[0]._id, fecha: s.lunes, horaInicio: '14:00', horaFin: '15:00', modalidad: 'virtual' });
  await Monitoria.create({ tipo: 'par', estado: 'solicitada', materia: 'Física I', tema: 'Cinemática', tutor: luis._id, estudiantes: [est[1]._id], creadaPor: est[1]._id, fecha: s.martes, horaInicio: '10:00', horaFin: '11:00', modalidad: 'presencial' });

  // Conversaciones
  const directa = await Conversacion.create({ tipo: 'directa', clave: [String(ana._id), String(est[0]._id)].sort().join(':'), participantes: [est[0]._id, ana._id] });
  const grupo = await Conversacion.create({ tipo: 'grupo', monitoria: preparcial._id });
  const mensajes = [
    [directa, est[0], 'Hola Ana, ¿podemos ver ejercicios de la regla de la cadena?'],
    [directa, ana, '¡Claro! Trae los del taller 3 y los resolvemos juntas.'],
    [grupo, ana, 'Bienvenidos al repaso del primer parcial. Traigan sus dudas.'],
  ];
  for (const [conversacion, autor, texto] of mensajes) {
    const m = await Mensaje.create({ conversacion: conversacion._id, autor: autor._id, texto });
    await Conversacion.updateOne({ _id: conversacion._id }, { ultimoMensaje: { texto, autor: autor._id, fecha: m.createdAt } });
  }

  return { parAceptada, s };
}

try {
  await conectarBaseDeDatos();

  const existentes = await buscarPorPrefijo(PREFIJO);

  if (soloBorrar || reiniciar) {
    if (existentes.length) {
      imprimirResumen('Datos demo eliminados:', await borrarUsuariosYDependencias(existentes.map((u) => u._id)));
    } else {
      console.log('No había datos demo.');
    }
  } else if (existentes.length) {
    console.log('Los datos demo ya estaban cargados (no es un error; no se modificó nada).');
    console.log('Para recargarlos con fechas nuevas: npm run seed -- --reiniciar');
  }

  if (!soloBorrar && (reiniciar || !existentes.length)) {
    const { s } = await cargar();
    console.log(`\nDatos demo cargados (semana del ${aTextoFecha(s.lunes)}). Contraseña de todas las cuentas: ${PASSWORD}`);
    console.log(`  Admin:       ${correo('admin')}`);
    console.log(`  Tutores:     ${correo('tutor.ana')}, ${correo('tutor.luis')}, ${correo('tutor.sofia')}`);
    console.log(`  Estudiantes: ${correo('estudiante1')} ... ${correo('estudiante8')}`);
  }
} catch (error) {
  console.error(`No se pudo cargar el seed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
