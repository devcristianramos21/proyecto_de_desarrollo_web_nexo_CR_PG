import { apiRequest } from './apiClient';

export function buscarTutores({ materia, nombre } = {}) {
  const parametros = new URLSearchParams();
  if (materia) parametros.set('materia', materia);
  if (nombre) parametros.set('nombre', nombre);
  const query = parametros.toString();
  return apiRequest(`/api/tutores${query ? `?${query}` : ''}`);
}

export function listarTutoresFavoritos() {
  return apiRequest('/api/usuarios/me/favoritos');
}

export function agregarTutorFavorito(id) {
  return apiRequest(`/api/usuarios/me/favoritos/${encodeURIComponent(id)}`, {
    method: 'POST',
  });
}

export function quitarTutorFavorito(id) {
  return apiRequest(`/api/usuarios/me/favoritos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function obtenerDisponibilidadTutor(id) {
  return apiRequest(`/api/tutores/${encodeURIComponent(id)}/disponibilidad`);
}

export function solicitarMonitoria(datos) {
  return apiRequest('/api/monitorias/par', {
    method: 'POST',
    body: datos,
  });
}

export function listarMiDisponibilidad() {
  return apiRequest('/api/disponibilidad/mia');
}

export function crearFranjaDisponibilidad(datos) {
  return apiRequest('/api/disponibilidad', {
    method: 'POST',
    body: datos,
  });
}

export function actualizarFranjaDisponibilidad(id, datos) {
  return apiRequest(`/api/disponibilidad/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: datos,
  });
}

export function eliminarFranjaDisponibilidad(id) {
  return apiRequest(`/api/disponibilidad/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function crearTicketSoporte(datos) {
  return apiRequest('/api/soporte/tickets', {
    method: 'POST',
    body: datos,
  });
}

export function listarMisTicketsSoporte() {
  return apiRequest('/api/soporte/tickets/mias');
}

export function listarTicketsSoporte() {
  return apiRequest('/api/soporte/tickets');
}

export function actualizarTicketSoporte(id, cambios) {
  return apiRequest(`/api/soporte/tickets/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: cambios,
  });
}

export function crearEvaluacion(datos) {
  return apiRequest('/api/evaluaciones', {
    method: 'POST',
    body: datos,
  });
}

export function listarMisEvaluaciones() {
  return apiRequest('/api/evaluaciones/mias');
}

export function listarNotificaciones() {
  return apiRequest('/api/notificaciones');
}

export function marcarNotificacionLeida(id) {
  return apiRequest(`/api/notificaciones/${encodeURIComponent(id)}/leida`, {
    method: 'PATCH',
  });
}

export function marcarTodasLasNotificacionesLeidas() {
  return apiRequest('/api/notificaciones/leidas', {
    method: 'PATCH',
  });
}

export function proponerHorario(id, datos) {
  return apiRequest(`/api/monitorias/${encodeURIComponent(id)}/propuesta-horario`, {
    method: 'PUT',
    body: datos,
  });
}

export function responderPropuestaHorario(id, datos) {
  return apiRequest(`/api/monitorias/${encodeURIComponent(id)}/propuesta-horario/responder`, {
    method: 'PATCH',
    body: datos,
  });
}

export function listarMisMonitorias() {
  return apiRequest('/api/monitorias/mis-tutorias');
}

export function cancelarMonitoria(id, motivo) {
  return apiRequest(`/api/monitorias/${encodeURIComponent(id)}/cancelar`, {
    method: 'PATCH',
    body: motivo ? { motivo } : {},
  });
}

export function listarMonitoriasComoTutor() {
  return apiRequest('/api/monitorias/como-tutor');
}

export function aceptarSolicitudMonitoria(id) {
  return apiRequest(`/api/monitorias/${encodeURIComponent(id)}/aceptar`, {
    method: 'PATCH',
  });
}

export function rechazarSolicitudMonitoria(id, motivo) {
  return apiRequest(`/api/monitorias/${encodeURIComponent(id)}/rechazar`, {
    method: 'PATCH',
    body: motivo ? { motivo } : {},
  });
}
