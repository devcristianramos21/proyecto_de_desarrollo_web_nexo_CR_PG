import { apiRequest } from './apiClient';

export function iniciarSesionNexo({ correo, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { correo, password },
  });
}

export function registrarUsuarioNexo(datos) {
  return apiRequest('/api/auth/registro', {
    method: 'POST',
    body: datos,
  });
}

export function cerrarSesionNexo() {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}

export function obtenerMiPerfil() {
  return apiRequest('/api/usuarios/me');
}

export function listarMisSolicitudesTutor() {
  return apiRequest('/api/solicitudes-tutor/mias');
}

export function crearSolicitudTutor(datos) {
  return apiRequest('/api/solicitudes-tutor', {
    method: 'POST',
    body: datos,
  });
}

export function listarSolicitudesTutorAdmin(estado) {
  const filtro = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  return apiRequest(`/api/solicitudes-tutor${filtro}`);
}

export function aprobarSolicitudTutor(id) {
  return apiRequest(`/api/solicitudes-tutor/${encodeURIComponent(id)}/aprobar`, {
    method: 'PATCH',
  });
}

export function rechazarSolicitudTutor(id, comentario) {
  return apiRequest(`/api/solicitudes-tutor/${encodeURIComponent(id)}/rechazar`, {
    method: 'PATCH',
    body: { comentario },
  });
}
