import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const ROLES = ['estudiante', 'tutor', 'admin'];

// Solo se aceptan correos institucionales de la Universidad del Rosario
export const DOMINIO_INSTITUCIONAL = 'urosario.edu.co';
const FORMATO_CORREO = /^[^\s@]+@urosario\.edu\.co$/;

const RONDAS_BCRYPT = 10;

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [FORMATO_CORREO, `El correo debe ser institucional (@${DOMINIO_INSTITUCIONAL})`],
    },
    // Se guarda cifrada. select: false evita que salga en las consultas por defecto.
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false,
    },
    rol: {
      type: String,
      enum: { values: ROLES, message: `El rol debe ser uno de: ${ROLES.join(', ')}` },
      default: 'estudiante',
    },
    carrera: {
      type: String,
      trim: true,
      maxlength: [100, 'La carrera no puede superar los 100 caracteres'],
    },
    semestre: {
      type: Number,
      min: [1, 'El semestre debe estar entre 1 y 12'],
      max: [12, 'El semestre debe estar entre 1 y 12'],
    },
    // URL de la foto de perfil
    foto: {
      type: String,
      trim: true,
    },
    biografia: {
      type: String,
      trim: true,
      maxlength: [500, 'La biografía no puede superar los 500 caracteres'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Nunca se envía la contraseña al cliente, aunque se haya consultado
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Cifra la contraseña solo cuando es nueva o cambió.
// La validación (minlength) corre antes, así que se valida la contraseña en texto plano.
usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, RONDAS_BCRYPT);
});

/** Compara una contraseña en texto plano con la cifrada. Requiere haber consultado con .select('+password'). */
usuarioSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

export const Usuario = mongoose.model('Usuario', usuarioSchema);
