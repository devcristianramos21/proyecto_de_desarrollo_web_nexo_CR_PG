import mongoose from 'mongoose';
import { MAX_MATERIAS } from './Usuario.js';

export const ESTADOS_SOLICITUD = ['pendiente', 'aprobada', 'rechazada'];

// Solicitud de un estudiante para convertirse en tutor. La revisa un administrador.
const solicitudTutorSchema = new mongoose.Schema(
  {
    estudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    // Materias que el estudiante quiere dictar
    materias: {
      type: [{ type: String, trim: true, maxlength: 100 }],
      validate: {
        validator: (materias) =>
          materias.length >= 1 && materias.length <= MAX_MATERIAS && materias.every(Boolean),
        message: `Indica entre 1 y ${MAX_MATERIAS} materias, sin dejar ninguna vacía`,
      },
    },
    motivacion: {
      type: String,
      required: [true, 'La motivación es obligatoria'],
      trim: true,
      maxlength: [1000, 'La motivación no puede superar los 1000 caracteres'],
    },
    estado: {
      type: String,
      enum: ESTADOS_SOLICITUD,
      default: 'pendiente',
    },
    // Datos de la revisión (los llena el administrador)
    revisadaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    fechaRevision: Date,
    comentarioRevision: {
      type: String,
      trim: true,
      maxlength: [500, 'El comentario no puede superar los 500 caracteres'],
    },
  },
  { timestamps: true },
);

export const SolicitudTutor = mongoose.model('SolicitudTutor', solicitudTutorSchema);
