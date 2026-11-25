import { io } from 'socket.io-client';
import { API_BASE_URL, apiRequest } from './apiClient';

const RUTA_CHAT = '/api/chat';

export function listarConversacionesChat() {
  return apiRequest(`${RUTA_CHAT}/conversaciones`);
}

export function abrirConversacionDirecta(usuarioId) {
  return apiRequest(`${RUTA_CHAT}/conversaciones/directa`, {
    method: 'POST',
    body: { usuario: usuarioId },
  });
}

export function abrirConversacionGrupo(monitoriaId) {
  return apiRequest(`${RUTA_CHAT}/conversaciones/grupo`, {
    method: 'POST',
    body: { monitoria: monitoriaId },
  });
}

export function listarMensajesChat(
  conversacionId,
  { antes, limite = 100 } = {}
) {
  const consulta = new URLSearchParams({ limite: String(limite) });
  if (antes) consulta.set('antes', antes);
  return apiRequest(
    `${RUTA_CHAT}/conversaciones/${encodeURIComponent(conversacionId)}/mensajes?${consulta}`
  );
}

export function enviarMensajeChat(conversacionId, texto) {
  return apiRequest(
    `${RUTA_CHAT}/conversaciones/${encodeURIComponent(conversacionId)}/mensajes`,
    {
      method: 'POST',
      body: { texto },
    }
  );
}

export function crearSocketChat() {
  return io(API_BASE_URL, {
    autoConnect: false,
    withCredentials: true,
  });
}
