import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, 'El tipo no puede superar los 40 caracteres'],
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, 'El título no puede superar los 120 caracteres'],
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'La descripción no puede superar los 500 caracteres'],
    },
    accion: {
      type: String,
      trim: true,
      maxlength: [80, 'La acción no puede superar los 80 caracteres'],
      default: '',
    },
    destino: {
      type: String,
      trim: true,
      maxlength: [80, 'El destino no puede superar los 80 caracteres'],
      default: '',
    },
    leida: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificacionSchema.index({ usuario: 1, createdAt: -1 });
notificacionSchema.index({ usuario: 1, leida: 1, createdAt: -1 });

export const Notificacion = mongoose.model('Notificacion', notificacionSchema);
