import { Server } from 'socket.io';
import { Usuario } from '../models/Usuario.js';
import * as chatService from '../services/chatService.js';
import { verificarToken } from '../utils/token.js';
import { ORIGENES_FRONTEND, origenFrontendPermitido } from '../config/origenesFrontend.js';
import { leerCookie, NOMBRE_COOKIE_SESION } from '../config/cookieSesion.js';

/**
 * Chat en tiempo real con Socket.IO.
 *
 * Conexión (frontend):
 *   const socket = io('http://localhost:3001', { auth: { token } });
 *
 * Eventos que envía el servidor:
 *   'mensaje:nuevo'          { conversacion, mensaje }        Mensaje nuevo en una de tus conversaciones
 *   'conversacion:escribiendo' { conversacion, usuario }      Alguien está escribiendo
 *
 * Eventos que puede enviar el cliente (con respuesta en el callback):
 *   'mensaje:enviar'         { conversacion, texto }  -> { ok: true, mensaje } | { ok: false, codigo, error }
 *   'conversacion:escribiendo' { conversacion }
 *
 * Las reglas (quién puede escribir a quién) son las mismas del chat REST: ambos usan chatService.
 */

const salaDe = (idUsuario) => `usuario:${idUsuario}`;

// Los ObjectId de MongoDB guardan bytes por dentro y Socket.IO los enviaría como binario:
// se convierten a JSON plano (los ids quedan como texto, igual que en la API REST).
const aJsonPlano = (valor) => JSON.parse(JSON.stringify(valor));

// Convierte un error del service en una respuesta para el callback del cliente
function respuestaDeError(error) {
  if (error.name === 'AppError') return { ok: false, codigo: error.codigo, error: error.message };
  if (error.name === 'ValidationError') {
    return { ok: false, codigo: 400, error: Object.values(error.errors)[0]?.message ?? 'Datos no válidos' };
  }
  if (error.name === 'CastError') return { ok: false, codigo: 404, error: 'Conversación no encontrada' };
  console.error(error);
  return { ok: false, codigo: 500, error: 'Error interno del servidor' };
}

// Ejecuta un manejador y siempre responde al callback (si el cliente envió uno)
function conRespuesta(manejador) {
  return async (datos, responder) => {
    const responderSiHay = typeof responder === 'function' ? responder : () => {};
    try {
      responderSiHay({ ok: true, ...(await manejador(datos ?? {})) });
    } catch (error) {
      responderSiHay(respuestaDeError(error));
    }
  };
}

export function configurarSockets(servidorHttp) {
  const io = new Server(servidorHttp, {
    cors: { origin: ORIGENES_FRONTEND, credentials: true },
  });

  // Autenticación: el mismo token JWT que usa la API
  io.use(async (socket, next) => {
    try {
      const origen = socket.handshake.headers.origin;
      const tokenCookie = leerCookie(
        socket.handshake.headers.cookie,
        NOMBRE_COOKIE_SESION,
      );
      if (origen && !origenFrontendPermitido(origen)) {
        return next(new Error('Origen no autorizado'));
      }
      if (tokenCookie && !origen) {
        return next(new Error('Se requiere un origen válido para la sesión'));
      }

      const token = socket.handshake.auth?.token || tokenCookie;
      if (!token) return next(new Error('Debes iniciar sesión'));

      const usuario = await Usuario.findById(verificarToken(token).sub);
      if (!usuario) return next(new Error('La cuenta ya no existe'));
      if (!['estudiante', 'tutor'].includes(usuario.rol)) {
        return next(new Error('El chat es solo para estudiantes y tutores'));
      }

      socket.data.usuario = usuario;
      next();
    } catch {
      next(new Error('Token no válido'));
    }
  });

  io.on('connection', (socket) => {
    const { usuario } = socket.data;
    // Sala personal: recibe sus mensajes en todas sus pestañas o dispositivos
    socket.join(salaDe(usuario.id));

    socket.on(
      'mensaje:enviar',
      conRespuesta(async ({ conversacion, texto }) => ({
        mensaje: aJsonPlano(await chatService.enviarMensaje(usuario, conversacion, { texto })),
      })),
    );

    socket.on(
      'conversacion:escribiendo',
      conRespuesta(async ({ conversacion }) => {
        const destinatarios = await chatService.obtenerDestinatarios(usuario, conversacion);
        for (const idDestinatario of destinatarios) {
          if (idDestinatario === usuario.id) continue;
          io.to(salaDe(idDestinatario)).emit('conversacion:escribiendo', {
            conversacion,
            usuario: { _id: usuario.id, nombre: usuario.nombre },
          });
        }
        return {};
      }),
    );
  });

  // Todo mensaje enviado (por REST o por socket) se reparte a los miembros conectados
  chatService.eventosChat.on('mensaje', ({ conversacion, destinatarios, mensaje }) => {
    const datos = aJsonPlano({ conversacion, mensaje });
    for (const idDestinatario of destinatarios) {
      io.to(salaDe(idDestinatario)).emit('mensaje:nuevo', datos);
    }
  });

  return io;
}
