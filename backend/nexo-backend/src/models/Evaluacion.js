import mongoose from 'mongoose';

export const CRITERIOS_EVALUACION = [
  'Claridad en la explicación',
  'Puntualidad',
  'Dominio del tema',
  'Paciencia y disposición',
];

const criterioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      enum: CRITERIOS_EVALUACION,
    },
    valor: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false },
);

const evaluacionSchema = new mongoose.Schema(
  {
    monitoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monitoria',
      required: true,
    },
    estudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    calificacionGeneral: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    criterios: {
      type: [criterioSchema],
      validate: {
        validator: (criterios) =>
          criterios.length === CRITERIOS_EVALUACION.length
          && new Set(criterios.map((criterio) => criterio.nombre)).size === CRITERIOS_EVALUACION.length,
        message: 'Debes calificar todos los criterios una sola vez',
      },
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [1000, 'El comentario no puede superar los 1000 caracteres'],
      default: '',
    },
    recomendacion: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

evaluacionSchema.index({ monitoria: 1, estudiante: 1 }, { unique: true });
evaluacionSchema.index({ tutor: 1, createdAt: -1 });

export const Evaluacion = mongoose.model('Evaluacion', evaluacionSchema);
