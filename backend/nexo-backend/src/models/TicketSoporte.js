import mongoose from 'mongoose';

export const ESTADOS_TICKET = ['pendiente', 'en_revision', 'resuelto'];

const ticketSoporteSchema = new mongoose.Schema(
  {
    numeroCaso: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
      maxlength: [80, 'La categoría no puede superar los 80 caracteres'],
    },
    asunto: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, 'El asunto no puede superar los 120 caracteres'],
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: [3000, 'La descripción no puede superar los 3000 caracteres'],
    },
    estado: {
      type: String,
      enum: ESTADOS_TICKET,
      default: 'pendiente',
    },
    respuesta: {
      type: String,
      trim: true,
      maxlength: [2000, 'La respuesta no puede superar los 2000 caracteres'],
      default: '',
    },
    atendidoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  { timestamps: true },
);

ticketSoporteSchema.index({ estado: 1, createdAt: -1 });

export const TicketSoporte = mongoose.model('TicketSoporte', ticketSoporteSchema);
