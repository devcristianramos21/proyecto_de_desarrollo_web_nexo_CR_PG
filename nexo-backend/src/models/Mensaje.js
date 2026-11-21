import mongoose from 'mongoose';

export const MAX_LARGO_MENSAJE = 2000;

const mensajeSchema = new mongoose.Schema(
  {
    conversacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversacion',
      required: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    texto: {
      type: String,
      required: [true, 'El mensaje no puede estar vacío'],
      trim: true,
      maxlength: [MAX_LARGO_MENSAJE, `El mensaje no puede superar los ${MAX_LARGO_MENSAJE} caracteres`],
    },
  },
  { timestamps: true },
);

// Para leer los mensajes de una conversación en orden y paginar hacia atrás
mensajeSchema.index({ conversacion: 1, createdAt: -1 });

export const Mensaje = mongoose.model('Mensaje', mensajeSchema);
