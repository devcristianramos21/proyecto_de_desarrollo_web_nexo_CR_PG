import mongoose from 'mongoose';

export const TIPOS_CONVERSACION = ['directa', 'grupo'];

/**
 * - directa: entre dos personas que tienen o tuvieron una monitoría juntas (tutor y estudiante).
 * - grupo: una por monitoría grupal. Sus miembros se leen de la monitoría (tutor + inscritos actuales),
 *   así que si alguien cambia de grupo pierde el acceso sin tener que actualizar la conversación.
 */
const conversacionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: TIPOS_CONVERSACION,
      required: true,
    },
    // Solo en las directas: los dos participantes
    participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    // Solo en las directas: ids de los participantes ordenados y unidos. Evita conversaciones duplicadas.
    clave: String,
    // Solo en las de grupo
    monitoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monitoria',
    },
    ultimoMensaje: {
      texto: String,
      autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
      fecha: Date,
    },
    // Hasta cuándo leyó cada usuario (para contar los no leídos)
    lecturas: [
      {
        _id: false,
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
        fecha: Date,
      },
    ],
  },
  { timestamps: true },
);

conversacionSchema.index(
  { clave: 1 },
  { unique: true, partialFilterExpression: { tipo: 'directa' } },
);
conversacionSchema.index(
  { monitoria: 1 },
  { unique: true, partialFilterExpression: { tipo: 'grupo' } },
);
conversacionSchema.index({ participantes: 1 });

export const Conversacion = mongoose.model('Conversacion', conversacionSchema);
