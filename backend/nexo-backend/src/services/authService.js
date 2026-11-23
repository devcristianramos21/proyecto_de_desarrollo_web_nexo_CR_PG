
import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { elegirCampos } from '../utils/elegirCampos.js';
import { generarToken } from '../utils/token.js';

const CAMPOS_REGISTRO = [
  'nombre',
  'correo',
  'password',
  'carrera',
  'semestre',
  'rol',
];

const CREDENCIALES_INCORRECTAS = 'Correo o contraseña incorrectos';

export async function registrar(datos) {
  const campos = elegirCampos(datos, CAMPOS_REGISTRO);

  const rolesPermitidos = ['estudiante', 'admin'];

  if (!rolesPermitidos.includes(campos.rol)) {
    campos.rol = 'estudiante';
  }

  if (typeof campos.correo === 'string') {
    const existe = await Usuario.exists({
      correo: campos.correo.trim().toLowerCase(),
    });

    if (existe) {
      throw new AppError(409, 'Ya existe una cuenta con ese correo');
    }
  }

  const usuario = await Usuario.create(campos);

  return {
    token: generarToken(usuario),
    usuario,
  };
}

export async function iniciarSesion({ correo, password } = {}) {
  if (!correo || !password) {
    throw new AppError(400, 'El correo y la contraseña son obligatorios');
  }

  const usuario = await Usuario.findOne({
    correo: String(correo).trim().toLowerCase(),
  }).select('+password');

  if (!usuario || !(await usuario.compararPassword(String(password)))) {
    throw new AppError(401, CREDENCIALES_INCORRECTAS);
  }

  return { token: generarToken(usuario), usuario };
}
