# NEXO — Backend

API REST y chat en tiempo real de NEXO, la plataforma de monitorías de la Universidad del Rosario.

Node.js + Express 5 + MongoDB Atlas (Mongoose) + Socket.IO. Autenticación con JWT.

---

## 1. Puesta en marcha

**Requisitos:** Node.js 20 o superior y acceso al cluster de MongoDB Atlas del proyecto.

```powershell
cd nexo-backend
npm install
```

Crea el archivo `nexo-backend/.env` (no se sube a git):

```env
PORT=3001
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/nexo?appName=Cluster0
JWT_SECRET=una_clave_larga_y_aleatoria

# Opcionales
JWT_EXPIRA_EN=7d                 # Duración de la sesión
DNS_SERVERS=8.8.8.8,1.1.1.1      # Solo si la conexión falla con "querySrv ECONNREFUSED"
PRUEBAS_ADMIN_CORREO=            # Admin que usa "npm run probar-api"
PRUEBAS_ADMIN_PASSWORD=
```

Para generar `JWT_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Luego:

```powershell
npm run dev        # Servidor con recarga automática en http://localhost:3001
npm run seed       # (Opcional) Carga datos de ejemplo
```

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor y lo reinicia al cambiar archivos |
| `npm start` | Arranca el servidor (sin recarga) |
| `npm run crear-admin -- "Nombre" correo@urosario.edu.co "contraseña"` | Crea un administrador (el registro público nunca crea admins). Si el correo ya existe, solo le da el rol |
| `npm run seed` | Carga datos de ejemplo (`demo.*`). `-- --reiniciar` los recarga con fechas nuevas; `-- --borrar` los elimina |
| `npm run probar-api` | Ejecuta la colección de pruebas contra el servidor (ver sección 8) |
| `npm run limpiar-pruebas` | Muestra los usuarios `prueba.*` que dejan las pruebas. `-- --confirmar` los borra |

### Datos de ejemplo (`npm run seed`)

Todas las cuentas usan la contraseña **`Nexo12345`**.

| Rol | Correo |
|---|---|
| Admin | `demo.admin@urosario.edu.co` |
| Tutores | `demo.tutor.ana@…`, `demo.tutor.luis@…`, `demo.tutor.sofia@…` |
| Estudiantes | `demo.estudiante1@…` a `demo.estudiante8@…` |

Incluye disponibilidad de tutores, una solicitud para ser tutor pendiente, un parcial con su preparcial, dos Saber Pro (una con el mínimo de 7 alcanzado y otra no), una obligatoria con dos grupos, dos monitorías par (una aceptada y otra pendiente), favoritos y conversaciones. Las fechas caen en la semana siguiente a la fecha en que se ejecuta.

---

## 2. Conceptos

### Roles

| Rol | Cómo se obtiene | Puede |
|---|---|---|
| `estudiante` | Al registrarse | Solicitar monitorías, inscribirse, favoritos, chat, pedir ser tutor |
| `tutor` | Un admin aprueba su solicitud | Todo lo del estudiante + gestionar disponibilidad y responder solicitudes |
| `admin` | `npm run crear-admin` | Aprobar tutores, crear monitorías grupales, publicar parciales. No usa el chat |

### Tipos de monitoría

| Tipo | La crea | Estudiantes | Cupo |
|---|---|---|---|
| `par` | Un estudiante, a un tutor específico | Solo quien la solicita | 1 |
| `obligatoria` | Admin | Los asigna el admin; el estudiante puede cambiarse de grupo | 20 por defecto (1–100) |
| `preparcial` | Admin, ligada a un parcial | Se inscriben solos | 20 por defecto (1–100) |
| `saber_pro` | Admin | Se inscriben solos | Mínimo 7, máximo 20 |

**Estados:** `solicitada` (par esperando al tutor) → `programada` → `finalizada`. También `rechazada` (par rechazada por el tutor) y `cancelada`.

### Formatos

- **Fechas:** `"AAAA-MM-DD"` (ej. `"2026-12-07"`).
- **Horas:** `"HH:mm"` en 24 horas y **hora de Colombia** (ej. `"14:30"`).
- **Días de la semana** (disponibilidad): `lunes`, `martes`, `miercoles`, `jueves`, `viernes`, `sabado`, `domingo` — sin tildes.
- **Correos:** solo `@urosario.edu.co`.

---

## 3. Uso de la API

**URL base:** `http://localhost:3001`

### Autenticación

`POST /api/auth/login` devuelve un `token`. Envíalo en todas las demás peticiones:

```
Authorization: Bearer <token>
```

```js
const res = await fetch('http://localhost:3001/api/usuarios/me', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Errores

Todas las respuestas de error tienen la misma forma:

```json
{ "mensaje": "Datos no válidos", "errores": { "correo": "El correo debe ser institucional (@urosario.edu.co)" } }
```

`errores` solo aparece en errores de validación (un mensaje por campo, útil para mostrar bajo cada input del formulario).

| Código | Significado |
|---|---|
| 400 | Datos inválidos (revisa `errores`) |
| 401 | Sin sesión, token inválido o expirado → volver al login |
| 403 | El rol del usuario no permite la acción |
| 404 | No existe, o no tienes acceso (por privacidad no se distingue) |
| 409 | Conflicto con el estado actual: horario cruzado, sin cupos, ya aprobada… |

---

## 4. Endpoints

Leyenda de acceso: 🌐 público · 👤 cualquier usuario con sesión · 🎓 estudiante o tutor · 🧑‍🏫 tutor · 🛠️ admin.

### Autenticación y perfil

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | 🌐 | `{ nombre, correo, password, carrera?, semestre? }` → `{ token, usuario }`. Siempre crea un estudiante |
| POST | `/api/auth/login` | 🌐 | `{ correo, password }` → `{ token, usuario }` |
| GET | `/api/usuarios/me` | 👤 | Mi perfil |
| PUT | `/api/usuarios/me` | 👤 | Edita `nombre, carrera, semestre, foto, biografia` (y `materias` si es tutor). Ignora `rol` y `correo` |
| PATCH | `/api/usuarios/me/password` | 👤 | `{ passwordActual, passwordNueva }` (mínimo 8 caracteres) |

### Favoritos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/usuarios/me/favoritos` | 🎓 | Mis tutores favoritos |
| POST | `/api/usuarios/me/favoritos/:tutorId` | 🎓 | Agregar (no duplica). Devuelve la lista actualizada |
| DELETE | `/api/usuarios/me/favoritos/:tutorId` | 🎓 | Quitar. Devuelve la lista actualizada |

### Tutores y disponibilidad

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/tutores?materia=&nombre=` | 👤 | Buscar tutores (búsqueda parcial, sin distinguir mayúsculas) |
| GET | `/api/tutores/:id` | 👤 | Perfil público de un tutor |
| GET | `/api/tutores/:id/disponibilidad` | 👤 | Franjas semanales del tutor |
| GET | `/api/disponibilidad/mia` | 🧑‍🏫 | Mis franjas (de lunes a domingo) |
| POST | `/api/disponibilidad` | 🧑‍🏫 | `{ diaSemana, horaInicio, horaFin }`. No puede cruzarse con otra franja propia |
| PUT | `/api/disponibilidad/:id` | 🧑‍🏫 | Editar una franja propia |
| DELETE | `/api/disponibilidad/:id` | 🧑‍🏫 | Eliminar una franja propia |

### Solicitudes para ser tutor

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/solicitudes-tutor` | 🎓 | `{ materias: [..], motivacion }`. Solo una pendiente a la vez |
| GET | `/api/solicitudes-tutor/mias` | 🎓 | Mis solicitudes y su estado |
| GET | `/api/solicitudes-tutor?estado=pendiente` | 🛠️ | Todas (estado: `pendiente`, `aprobada`, `rechazada`) |
| PATCH | `/api/solicitudes-tutor/:id/aprobar` | 🛠️ | El estudiante pasa a tutor con esas materias |
| PATCH | `/api/solicitudes-tutor/:id/rechazar` | 🛠️ | `{ comentario? }` |

### Monitorías

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/monitorias/disponibles?tipo=&materia=` | 👤 | Catálogo: grupales programadas que no han empezado |
| GET | `/api/monitorias/mis-tutorias?estado=` | 🎓 | Donde participo como estudiante |
| GET | `/api/monitorias/como-tutor?estado=` | 🧑‍🏫 | Las que dicto. `estado=solicitada` = solicitudes por responder |
| GET | `/api/monitorias?tipo=&estado=&materia=&tutor=` | 🛠️ | Todas |
| GET | `/api/monitorias/:id` | 👤 | Detalle. Las `par` solo las ven sus participantes y el admin |
| POST | `/api/monitorias/par` | 🎓 | Solicitar a un tutor (ver ejemplo abajo) |
| PATCH | `/api/monitorias/:id/aceptar` | 🧑‍🏫 | Aceptar una solicitud par propia |
| PATCH | `/api/monitorias/:id/rechazar` | 🧑‍🏫 | `{ motivo? }` |
| POST | `/api/monitorias/grupales` | 🛠️ | Crear obligatoria, preparcial o saber_pro (ver ejemplo abajo) |
| PUT | `/api/monitorias/:id` | 🛠️ | Editar una grupal programada (incluye `cupoMaximo`, `tutor`, fecha y horas) |
| POST | `/api/monitorias/:id/estudiantes` | 🛠️ | `{ estudiantes: [ids] }` — asignar estudiantes |
| DELETE | `/api/monitorias/:id/estudiantes/:estudianteId` | 🛠️ | Quitar un estudiante |
| POST | `/api/monitorias/:id/inscripcion` | 🎓 | Inscribirse (preparcial y saber_pro) |
| DELETE | `/api/monitorias/:id/inscripcion` | 🎓 | Cancelar mi inscripción |
| POST | `/api/monitorias/:id/cambio-grupo` | 🎓 | `{ destino: idOtroGrupo }` — solo obligatorias de la misma materia |
| PATCH | `/api/monitorias/:id/cancelar` | 👤 | `{ motivo? }`. Par: sus participantes o admin. Grupal: tutor o admin. Antes de que empiece |
| PATCH | `/api/monitorias/:id/finalizar` | 🧑‍🏫 🛠️ | Solo después de comenzar. Saber Pro exige al menos 7 inscritos |

**Solicitar una monitoría par:**

```json
POST /api/monitorias/par
{
  "tutor": "<id del tutor>",
  "materia": "Cálculo Diferencial",
  "tema": "Derivadas",
  "fecha": "2026-12-07",
  "horaInicio": "14:00",
  "horaFin": "15:00",
  "modalidad": "virtual"
}
```

Se valida que el tutor dicte la materia, que el horario esté dentro de su disponibilidad, que sea en el futuro y que no se cruce con otra monitoría del tutor ni del estudiante.

**Crear una grupal (admin):**

```json
POST /api/monitorias/grupales
{
  "tipo": "saber_pro",
  "tutor": "<id del tutor>",
  "materia": "Saber Pro: Razonamiento cuantitativo",
  "fecha": "2026-12-12",
  "horaInicio": "08:00",
  "horaFin": "11:00",
  "modalidad": "presencial",
  "lugar": "Auditorio Principal",
  "cupoMaximo": 20
}
```

- `obligatoria`: admite `grupo` (ej. `"A"`) y `estudiantes: [ids]`.
- `preparcial`: exige `parcial: "<id>"`; la materia se toma del parcial y debe terminar antes de que empiece.

**Campos calculados** que trae cada monitoría:

| Campo | Significado |
|---|---|
| `inscritos` | Cantidad de estudiantes |
| `cupoMinimo` / `cuposDisponibles` | Según el tipo y el cupo máximo |
| `cupoMinimoAlcanzado` | En Saber Pro es `false` hasta llegar a 7 inscritos |
| `inscrito` | Si el usuario actual está inscrito |
| `estudiantes` | Lista de inscritos — **solo** para el tutor de la monitoría y el admin |

### Parciales y calendario

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/parciales?materia=&desde=&hasta=` | 👤 | Parciales publicados |
| GET | `/api/parciales/:id` | 👤 | Detalle |
| GET | `/api/parciales/:id/preparciales` | 👤 | Preparciales programadas para ese parcial |
| POST | `/api/parciales` | 🛠️ | `{ materia, nombre, fecha, hora?, descripcion? }` |
| PUT | `/api/parciales/:id` | 🛠️ | No se puede adelantar si deja preparciales después del parcial |
| DELETE | `/api/parciales/:id` | 🛠️ | No se puede si tiene preparciales programadas |
| GET | `/api/calendario?desde=&hasta=` | 👤 | `{ monitorias, parciales }` del rango (máximo 92 días). Cada monitoría trae `rolEnMonitoria`: `tutor` o `estudiante` |

### Chat (REST)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/chat/contactos` | 🎓 | Personas a las que puedo escribir |
| GET | `/api/chat/conversaciones` | 🎓 | Bandeja: directas y grupos, con `titulo`, `ultimoMensaje` y `noLeidos` |
| POST | `/api/chat/conversaciones/directa` | 🎓 | `{ usuario: id }` — abre o recupera el chat con esa persona |
| POST | `/api/chat/conversaciones/grupo` | 🎓 | `{ monitoria: id }` — chat de una monitoría grupal |
| GET | `/api/chat/conversaciones/:id/mensajes?limite=30&antes=` | 🎓 | `{ mensajes, hayMas }` en orden cronológico. Marca como leída |
| POST | `/api/chat/conversaciones/:id/mensajes` | 🎓 | `{ texto }` (máximo 2000 caracteres) |

**Reglas del chat:**

- Mensaje directo solo entre personas con una monitoría juntas (tutor-estudiante) **programada o finalizada**. Si deja de haberla, el historial se puede leer pero no escribir.
- Cada monitoría grupal tiene su chat; lo usan el tutor y los inscritos actuales. Si la monitoría se cancela, queda de solo lectura.
- **Paginación:** para cargar mensajes anteriores, pasa en `antes` el `createdAt` del mensaje más antiguo que ya tienes.

---

## 5. Chat en tiempo real (Socket.IO)

Mismo puerto que la API. En el frontend: `npm install socket.io-client`.

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', { auth: { token } });

socket.on('connect_error', (error) => console.log(error.message)); // "Token no válido", etc.

// Mensaje nuevo en cualquiera de mis conversaciones (también llega a mis otras pestañas)
socket.on('mensaje:nuevo', ({ conversacion, mensaje }) => { /* ... */ });

// Alguien está escribiendo
socket.on('conversacion:escribiendo', ({ conversacion, usuario }) => { /* ... */ });

// Enviar un mensaje (equivale a POST /api/chat/conversaciones/:id/mensajes)
socket.emit('mensaje:enviar', { conversacion: id, texto }, (respuesta) => {
  // { ok: true, mensaje } o { ok: false, codigo, error }
});

// Avisar que estoy escribiendo
socket.emit('conversacion:escribiendo', { conversacion: id });
```

- Los administradores no pueden conectarse al chat.
- Un mensaje enviado por REST también se entrega por socket: el frontend puede usar cualquiera de las dos vías.

---

## 6. Estructura del código

```
src/
  server.js        Arranque: conecta a MongoDB y levanta HTTP + Socket.IO
  app.js           Configuración de Express y registro de rutas
  config/          Conexión a la base de datos
  models/          Esquemas de Mongoose (Usuario, Monitoria, Parcial, Conversacion, Mensaje…)
  services/        Reglas de negocio (no conocen req/res)
  controllers/     Traducen HTTP: leen la petición, llaman al service y responden
  routes/          Endpoints y qué rol puede usar cada uno
  middlewares/     autenticar (JWT), permitir (roles), errores y 404
  sockets/         Chat en tiempo real
  utils/           AppError, fechas, horas, token…
scripts/           crear-admin, seed, limpiar-pruebas, probar-api
pruebas-api/       Colección de Postman
```

Para agregar una funcionalidad: modelo → service (reglas, lanza `AppError(codigo, mensaje)`) → controller → ruta con `autenticar` y `permitir(...)`.

---

## 7. Problemas comunes

| Síntoma | Causa | Solución |
|---|---|---|
| `Falta JWT_SECRET en el archivo .env` | Falta la variable | Ver sección 1 |
| `querySrv ECONNREFUSED` | Node no lee el DNS de Windows | El servidor ya usa DNS públicos automáticamente; si persiste, define `DNS_SERVERS` en `.env` |
| `Could not connect to any servers… IP… whitelist` | Tu IP no está autorizada en Atlas | Atlas → Security → Network Access → Add IP Address. Si tu IP cambia seguido, usa `0.0.0.0/0` |
| Postman o el frontend no reciben respuesta | El servidor no está corriendo | Revisa la terminal de `npm run dev` |
| 401 en todas las peticiones | Falta el header o el token expiró | Volver a iniciar sesión |

---

## 8. Pruebas

La colección `pruebas-api/NEXO.postman_collection.json` cubre todos los endpoints y sus reglas (~150 peticiones, en 5 carpetas que se ejecutan en orden).

**Con Postman:** importa el archivo, escribe `adminCorreo` y `adminPassword` en la pestaña *Variables* de la colección y usa **Run**.

**Desde la terminal:** pon `PRUEBAS_ADMIN_CORREO` y `PRUEBAS_ADMIN_PASSWORD` en `.env`, deja el servidor corriendo y ejecuta:

```powershell
npm run probar-api            # Toda la colección
npm run probar-api -- "Chat"  # Solo las carpetas que contengan "Chat"
```

Cada ejecución deja usuarios `prueba.postman.*` en la base. Para borrarlos: `npm run limpiar-pruebas -- --confirmar`.
