/**
 * Ejecuta la colección de Postman (pruebas-api/NEXO.postman_collection.json) desde la terminal,
 * sin necesidad de tener Postman. Implementa solo la parte de "pm" que usa esta colección.
 *
 * Requisitos:
 *   - El servidor corriendo EN OTRA TERMINAL (npm run dev)
 *   - En .env: PRUEBAS_ADMIN_CORREO y PRUEBAS_ADMIN_PASSWORD (un admin creado con npm run crear-admin,
 *     o el admin de los datos demo: demo.admin@urosario.edu.co / Nexo12345)
 *   - Opcional en .env: PRUEBAS_API_URL (por defecto http://localhost:<PORT o 3001>)
 *
 * Uso (desde nexo-backend):
 *   npm run probar-api
 *   npm run probar-api -- "Chat"     Ejecuta solo las carpetas cuyo nombre contenga ese texto
 *
 * Antes de empezar verifica el servidor y el admin; si algo falta, se detiene y explica qué hacer.
 * Cada ejecución crea usuarios prueba.*; se borran con: npm run limpiar-pruebas -- --confirmar
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';

const RUTA_COLECCION = new URL('../pruebas-api/NEXO.postman_collection.json', import.meta.url);
const filtroCarpeta = process.argv[2];

const coleccion = JSON.parse(readFileSync(RUTA_COLECCION, 'utf8'));
const vars = Object.fromEntries(coleccion.variable.map((v) => [v.key, v.value ?? '']));
vars.baseUrl = process.env.PRUEBAS_API_URL || `http://localhost:${process.env.PORT || 3001}`;
vars.adminCorreo = process.env.PRUEBAS_ADMIN_CORREO ?? '';
vars.adminPassword = process.env.PRUEBAS_ADMIN_PASSWORD ?? '';

const carpetas = coleccion.item.filter(
  (c) => !filtroCarpeta || c.name.toLowerCase().includes(filtroCarpeta.toLowerCase()),
);
// Todas las carpetas, salvo "Auth y perfil", necesitan un administrador
const necesitaAdmin = carpetas.some((c) => c.name !== 'Auth y perfil');

// ───────────── Verificaciones previas ─────────────

// Error que detiene el script antes de ejecutar las pruebas, con instrucciones para el usuario.
// No se usa process.exit(): en Windows, salir mientras se cierra una conexión HTTP hace fallar a Node.
class Detencion extends Error {}

function detener(...lineas) {
  throw new Detencion(['', ...lineas, ''].join('\n'));
}

async function verificarServidor() {
  let respuesta;
  try {
    respuesta = await fetch(`${vars.baseUrl}/`, { signal: AbortSignal.timeout(5000) });
  } catch {
    detener(
      `✗ No hay ningún servidor respondiendo en ${vars.baseUrl}`,
      '',
      'Estas pruebas necesitan el backend corriendo en OTRA terminal:',
      '  1. Abre una terminal nueva (en VS Code: Terminal → New Terminal)',
      '  2. Ejecuta:  cd nexo-backend   y luego   npm run dev',
      '  3. Espera el mensaje "Servidor escuchando en http://localhost:3001"',
      '  4. Deja esa terminal abierta y, en esta, vuelve a ejecutar:  npm run probar-api',
    );
  }

  const cuerpo = await respuesta.json().catch(() => ({}));
  if (cuerpo.mensaje !== 'API de NEXO funcionando') {
    detener(
      `✗ En ${vars.baseUrl} responde algo, pero no es la API de NEXO.`,
      '  ¿Otra aplicación está usando ese puerto? Revisa PORT o PRUEBAS_API_URL en .env.',
    );
  }
}

async function verificarAdmin() {
  if (!vars.adminCorreo || !vars.adminPassword) {
    detener(
      '✗ Faltan las credenciales del administrador de pruebas.',
      '',
      'Agrega estas dos líneas a tu archivo nexo-backend/.env:',
      '  PRUEBAS_ADMIN_CORREO=correo.del.admin@urosario.edu.co',
      '  PRUEBAS_ADMIN_PASSWORD=su_contraseña',
      '',
      'Puedes usar el admin de los datos demo (npm run seed): demo.admin@urosario.edu.co / Nexo12345',
      'o crear uno propio con: npm run crear-admin -- "Nombre" correo@urosario.edu.co "contraseña"',
      '',
      'Para probar solo lo que no necesita admin:  npm run probar-api -- "Auth"',
    );
  }

  const respuesta = await fetch(`${vars.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: vars.adminCorreo, password: vars.adminPassword }),
  });
  const cuerpo = await respuesta.json().catch(() => ({}));

  if (respuesta.status !== 200) {
    detener(
      `✗ El administrador de pruebas no pudo iniciar sesión: ${cuerpo.mensaje ?? respuesta.status}`,
      `  Revisa PRUEBAS_ADMIN_CORREO (${vars.adminCorreo}) y PRUEBAS_ADMIN_PASSWORD en .env.`,
      '  Si usas el admin demo y borraste los datos demo, recárgalos con: npm run seed',
    );
  }
  if (cuerpo.usuario?.rol !== 'admin') {
    detener(
      `✗ La cuenta ${vars.adminCorreo} existe pero no es administrador (rol: ${cuerpo.usuario?.rol}).`,
      `  Dale el rol con: npm run crear-admin -- "Nombre" ${vars.adminCorreo}`,
    );
  }
}

async function verificarTodo() {
  if (!carpetas.length) {
    detener(
      `✗ Ninguna carpeta de la colección contiene "${filtroCarpeta}".`,
      `  Carpetas disponibles: ${coleccion.item.map((c) => c.name).join(', ')}`,
    );
  }
  await verificarServidor();
  if (necesitaAdmin) await verificarAdmin();
  console.log(`Servidor OK en ${vars.baseUrl}${necesitaAdmin ? ` · admin OK (${vars.adminCorreo})` : ''}\n`);
}

// ───────────── Mini implementación de pm.* ─────────────

const sustituir = (texto) =>
  texto?.replace(/\{\{(\$?\w+)\}\}/g, (_, clave) =>
    clave === '$timestamp' ? String(Math.floor(Date.now() / 1000)) : (vars[clave] ?? ''),
  );
const iguales = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function expect(real, negado = false) {
  const comprobar = (condicion, descripcion) => {
    if (Boolean(condicion) === negado) {
      throw new Error(`se esperaba ${negado ? 'NO ' : ''}${descripcion}; valor: ${JSON.stringify(real)}`);
    }
  };
  const api = {
    get to() { return api; },
    get be() { return api; },
    get have() { return api; },
    get not() { return expect(real, !negado); },
    eql: (v) => comprobar(iguales(real, v), `igual a ${JSON.stringify(v)}`),
    a: (tipo) => comprobar(
      tipo === 'array' ? Array.isArray(real) : typeof real === tipo && real !== null && !(tipo === 'object' && Array.isArray(real)),
      `tipo ${tipo}`,
    ),
    an: (tipo) => api.a(tipo),
    property: (clave) => comprobar(real != null && clave in Object(real), `la propiedad ${clave}`),
    include: (v) => comprobar(
      typeof real === 'string' ? real.includes(v) : Array.isArray(real) && real.some((x) => iguales(x, v)),
      `que incluya ${JSON.stringify(v)}`,
    ),
    lengthOf: (n) => comprobar(real?.length === n, `longitud ${n}`),
    get true() { comprobar(real === true, 'true'); return api; },
  };
  return api;
}

// ───────────── Ejecución ─────────────

let pasan = 0;
let fallan = 0;
let peticiones = 0;

async function ejecutar(item, ruta) {
  if (item.item) {
    for (const hijo of item.item) await ejecutar(hijo, `${ruta}${item.name} / `);
    return;
  }

  peticiones++;
  const scripts = Object.fromEntries((item.event ?? []).map((e) => [e.listen, e.script.exec.join('\n')]));
  const pmBase = { collectionVariables: { get: (k) => vars[k], set: (k, v) => { vars[k] = v; } }, expect };
  if (scripts.prerequest) new Function('pm', scripts.prerequest)(pmBase);

  const { request } = item;
  const headers = Object.fromEntries((request.header ?? []).map((h) => [h.key, sustituir(h.value)]));
  let respuesta;
  let cuerpo;
  try {
    respuesta = await fetch(sustituir(typeof request.url === 'string' ? request.url : request.url.raw), {
      method: request.method,
      headers,
      body: request.body ? sustituir(request.body.raw) : undefined,
    });
    cuerpo = await respuesta.text();
  } catch (error) {
    fallan++;
    console.log(`FALLA ${ruta}${item.name}: sin respuesta (${error.cause?.code ?? error.message}). ¿Está corriendo el servidor?`);
    return;
  }

  const resultados = [];
  const pm = {
    ...pmBase,
    test: (nombre, fn) => {
      try { fn(); resultados.push([true, nombre]); } catch (e) { resultados.push([false, `${nombre}: ${e.message}`]); }
    },
    response: {
      code: respuesta.status,
      json: () => JSON.parse(cuerpo),
      to: { have: { status: (n) => { if (respuesta.status !== n) throw new Error(`respondió ${respuesta.status}, se esperaba ${n}`); } } },
    },
  };
  try {
    new Function('pm', scripts.test ?? '')(pm);
  } catch (error) {
    resultados.push([false, `error en el script de pruebas: ${error.message}`]);
  }

  const todoBien = resultados.every(([ok]) => ok);
  for (const [ok] of resultados) ok ? pasan++ : fallan++;
  console.log(`${todoBien ? 'OK   ' : 'FALLA'} [${respuesta.status}] ${ruta}${item.name}`);
  for (const [ok, detalle] of resultados) {
    if (!ok) console.log(`        ✗ ${detalle}\n          respuesta: ${cuerpo.slice(0, 300)}`);
  }
}

try {
  await verificarTodo();
  for (const carpeta of carpetas) await ejecutar(carpeta, '');

  console.log(`\n${peticiones} peticiones: ${pasan} pruebas pasaron, ${fallan} fallaron`);
  process.exitCode = fallan ? 1 : 0;
} catch (error) {
  if (!(error instanceof Detencion)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
