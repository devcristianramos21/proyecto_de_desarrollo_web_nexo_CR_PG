// Datos de demostración del administrador, pendientes de integración con backend.
export const DEMO_ESTUDIANTES_ADMIN = [
  { id: 1, nombre: 'Laura Rodríguez', correo: 'laura.rodriguez@urosario.edu.co', programa: 'Ing. de Sistemas', semestre: '2°', tutorias: 4, monitorias: 2, estado: 'Activo' },
  { id: 2, nombre: 'Santiago Peña', correo: 'santiago.pena@urosario.edu.co', programa: 'Economía', semestre: '4°', tutorias: 8, monitorias: 3, estado: 'Activo' },
  { id: 3, nombre: 'Valentina Cruz', correo: 'valentina.cruz@urosario.edu.co', programa: 'Administración', semestre: '3°', tutorias: 2, monitorias: 1, estado: 'Activo' },
  { id: 4, nombre: 'Miguel Torres', correo: 'miguel.torres@urosario.edu.co', programa: 'Ing. de Sistemas', semestre: '1°', tutorias: 0, monitorias: 1, estado: 'Activo' },
  { id: 5, nombre: 'Isabella Martínez', correo: 'isabella.martinez@urosario.edu.co', programa: 'Matemáticas', semestre: '5°', tutorias: 12, monitorias: 0, estado: 'Activo' },
  { id: 6, nombre: 'Daniel Ríos', correo: 'daniel.rios@urosario.edu.co', programa: 'Psicología', semestre: '6°', tutorias: 1, monitorias: 0, estado: 'Inactivo' },
];

export const DEMO_TUTORES_ADMIN = [
  {
    id: 1,
    nombre: 'Andrés Moreno',
    iniciales: 'AM',
    programa: 'Ing. de Sistemas',
    semestre: '9° semestre',
    rol: 'Monitor obligatorio',
    estado: 'Activo',
    validado: true,
    desde: 'Feb 2026',
    materias: ['Cálculo Diferencial', 'Álgebra Lineal'],
    sesiones: 48,
    calificacion: '4.8',
  },
  {
    id: 2,
    nombre: 'Carlos Herrera',
    iniciales: 'CH',
    programa: 'Ing. de Sistemas',
    semestre: '7° semestre',
    rol: 'Monitor par',
    estado: 'Pendiente',
    validado: false,
    desde: 'Sep 2026',
    materias: ['Programación II', 'Estructuras de datos'],
    sesiones: 0,
    calificacion: null,
  },
  {
    id: 3,
    nombre: 'Sofía Vargas',
    iniciales: 'SV',
    programa: 'Psicología',
    semestre: '8° semestre',
    rol: 'Tutor libre',
    estado: 'Suspendido',
    validado: true,
    desde: 'Mar 2026',
    materias: ['Psicología Social', 'Metodología'],
    sesiones: 5,
    calificacion: '4.2',
  },
];

export const DEMO_MONITORIAS_ADMIN = [
  {
    id: 1,
    titulo: 'Monitoría Cálculo Diferencial',
    tipo: 'Obligatoria',
    estado: 'Confirmada',
    tutor: 'Andrés Moreno',
    programa: 'Ingeniería',
    horario: 'Lunes y miércoles 2-4 PM',
    inscritos: 22,
    cupo: 25,
    minimo: 15,
    fecha: 'Lunes y miércoles',
    modalidad: 'Presencial',
  },
  {
    id: 2,
    titulo: 'Pre-parcial Cálculo Diferencial',
    tipo: 'Pre-parcial',
    estado: 'Por confirmar',
    tutor: 'Andrés Moreno',
    programa: 'Ingeniería',
    horario: 'Sáb 20 Sep · 9-11 AM',
    inscritos: 3,
    cupo: 20,
    minimo: 10,
    fecha: 'Sáb 20 Sep',
    modalidad: 'Presencial',
  },
  {
    id: 3,
    titulo: 'Monitoría Par Programación II',
    tipo: 'Par',
    estado: 'Abierta',
    tutor: 'Carlos Herrera',
    programa: 'Ing. de Sistemas',
    horario: 'Viernes 4-6 PM',
    inscritos: 2,
    cupo: 5,
    minimo: 3,
    fecha: 'Viernes',
    modalidad: 'Virtual',
  },
  {
    id: 4,
    titulo: 'Pre-parcial Álgebra Lineal',
    tipo: 'Pre-parcial',
    estado: 'Confirmada',
    tutor: 'Felipe Castro',
    programa: 'Ing. / Matemáticas',
    horario: 'Dom 21 Sep · 10 AM-12 PM',
    inscritos: 14,
    cupo: 20,
    minimo: 10,
    fecha: 'Dom 21 Sep',
    modalidad: 'Presencial',
  },
];

export const DEMO_EXAMENES_ADMIN = [
  { id: 1, dia: 'LUN', fechaCorta: '23', materia: 'Cálculo Diferencial', tipo: 'Parcial', programa: 'Ingeniería', semestre: 'Sem. 2', hora: '8:00 AM', lugar: 'Aula 301', monitoriaAsignada: true },
  { id: 2, dia: 'MIÉ', fechaCorta: '25', materia: 'Programación II', tipo: 'Parcial', programa: 'Ing. de Sistemas', semestre: 'Sem. 4', hora: '2:00 PM', lugar: 'Lab 102', monitoriaAsignada: true },
  { id: 3, dia: 'JUE', fechaCorta: '26', materia: 'Microeconomía', tipo: 'Parcial', programa: 'Economía / Administración', semestre: 'Sem. 3', hora: '9:00 AM', lugar: 'Aula 401', monitoriaAsignada: false },
  { id: 4, dia: 'VIE', fechaCorta: '27', materia: 'Estadística', tipo: 'Parcial', programa: 'Economía', semestre: 'Sem. 3', hora: '10:00 AM', lugar: 'Aula 204', monitoriaAsignada: false },
];

export const DEMO_TICKETS_ADMIN = [
  { id: 1, titulo: 'No aparece mi monitoría inscrita', usuario: 'Laura Rodríguez', rol: 'Estudiante', categoria: 'Problema técnico', fecha: '12 Sep 2026', estado: 'Pendiente' },
  { id: 2, titulo: 'Error al proponer horario en solicitud #204', usuario: 'Andrés Moreno', rol: 'Tutor', categoria: 'Error plataforma', fecha: '11 Sep 2026', estado: 'En revisión' },
  { id: 3, titulo: 'No puedo enviar evaluación de tutoría', usuario: 'Santiago Peña', rol: 'Estudiante', categoria: 'Problema técnico', fecha: '10 Sep 2026', estado: 'En revisión' },
  { id: 4, titulo: 'Duda sobre límite de tutorías activas', usuario: 'Valentina Gómez', rol: 'Tutor', categoria: 'Consulta general', fecha: '8 Sep 2026', estado: 'Resuelto' },
  { id: 5, titulo: 'No recibo notificaciones de monitorías', usuario: 'Miguel Torres', rol: 'Estudiante', categoria: 'Configuración', fecha: '5 Sep 2026', estado: 'Resuelto' },
];

export const DEMO_NOTIFICACIONES_ADMIN = [
  { id: 1, titulo: 'Reporte semanal disponible', descripcion: 'Reporte semanal disponible', tiempo: 'Hace 5 min', grupo: 'Sin leer', accion: 'Ver reportes', destino: 'Reportes admin', tipo: 'reporte', leida: false },
  { id: 2, titulo: 'Monitoría confirmada', descripcion: 'La monitoría Pre-parcial de Álgebra Lineal alcanzó el umbral mínimo (14 inscritos) y fue confirmada automáticamente.', tiempo: 'Hace 2 h', grupo: 'Sin leer', accion: 'Ver monitoría', destino: 'Monitorias admin', tipo: 'confirmacion', leida: false },
  { id: 3, titulo: 'Umbral de inscripción bajo', descripcion: 'La monitoría pre-parcial de Cálculo Diferencial tiene solo 3 inscritos de 10 requeridos. El parcial es en 5 días.', tiempo: 'Hace 3 h', grupo: 'Sin leer', accion: 'Ver monitoría', destino: 'Monitorias admin', tipo: 'alerta', leida: false },
  { id: 4, titulo: 'Parcial registrado en calendario', descripcion: 'El parcial de Cálculo Diferencial fue registrado para el Lunes 23 Sep a las 8:00 AM.', tiempo: 'Hace 5 h', grupo: 'Anteriores', accion: '', destino: 'Calendario Admin', tipo: 'calendario', leida: true },
  { id: 5, titulo: 'Nuevo tutor pendiente de validación', descripcion: 'Mateo Jiménez solicitó ser registrado como Monitor Par para Bases de Datos.', tiempo: 'Ayer', grupo: 'Anteriores', accion: 'Ver tutor', destino: 'Tutores admin', tipo: 'tutor', leida: true },
];

export const DEMO_PERFIL_ADMIN = {
  nombre: 'Administrador Institucional',
  correo: 'admin@urosario.edu.co',
  rol: 'Administrador Vicerrectoría Académica',
  departamento: 'Dirección Académica',
  institucion: 'Universidad del Rosario',
};
