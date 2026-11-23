export const NOMBRE_COOKIE_SESION = 'nexo_session';

export function opcionesCookieSesion() {
  const produccion = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: produccion,
    sameSite: produccion ? 'none' : 'lax',
    path: '/',
  };
}

export function leerCookie(headerCookie, nombre) {
  if (!headerCookie) return '';

  for (const parte of headerCookie.split(';')) {
    const separador = parte.indexOf('=');
    if (separador < 0) continue;

    const clave = parte.slice(0, separador).trim();
    if (clave === nombre) return parte.slice(separador + 1).trim();
  }

  return '';
}
