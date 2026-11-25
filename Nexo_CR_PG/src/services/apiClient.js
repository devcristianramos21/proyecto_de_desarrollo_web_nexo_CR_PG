
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3001'
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, errores) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errores = errores;
  }
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = {
    Accept: 'application/json',
  };

  const metodo = method.toUpperCase();

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo)) {
    headers['X-NEXO-Requested-With'] = 'XMLHttpRequest';
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: metodo,
      headers,
      credentials: 'include',
      cache: 'no-store',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(
        'No fue posible conectar con el servidor de NEXO.',
        0
      );
    }

    throw error;
  }

  let data = null;

  try {
    const contenido = await response.text();
    data = contenido ? JSON.parse(contenido) : null;
  } catch {
    throw new ApiError(
      'El servidor devolvió una respuesta que no es válida.',
      response.status
    );
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      !path.startsWith('/api/auth/') &&
      path !== '/api/usuarios/me' &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(new Event('nexo:session-expired'));
    }

    throw new ApiError(
      data?.mensaje || `La solicitud falló (${response.status}).`,
      response.status,
      data?.errores
    );
  }

  return data;
}

export { API_BASE_URL };
