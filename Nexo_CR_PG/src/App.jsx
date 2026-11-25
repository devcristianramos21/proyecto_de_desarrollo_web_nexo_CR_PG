
import { useCallback, useEffect, useRef, useState } from 'react';
import { UsuarioContext } from './components/layout/usuarioContext';

import HomeEstudiante from './pages/homeEstudiantes';
import BuscarTutores from './pages/buscarTutores';
import ResultadosBusqueda from './pages/resultadosBusqueda';
import Monitorias from './pages/monitorias';
import DetalleMonitoria from './pages/detalleMonitoria';
import Calendario from './pages/calendario';
import MisSolicitudes from './pages/misSolicitudes';
import DetalleSolicitud from './pages/detalleSolicitud';
import PropuestaHorario from './pages/propuestaHorario';
import HorarioConfirmado from './pages/horarioConfirmado';
import MisMonitorias from './pages/misMonitorias';
import DetalleTutoria from './pages/detalleMisMonitorias';
import EvaluarTutoria from './pages/evaluarTutoria';
import ConfirmacionEvaluacion from './pages/confirmacionEvaluacion';
import Mensajes from './pages/mensajes';
import Favoritos from './pages/favoritos';
import MiPerfil from './pages/miPerfil';
import Notificaciones from './pages/notificaciones';
import CentroSoporte from './pages/centroSoporte';
import PerfilTutor from './pages/perfilTutor';
import SolicitarTutoria from './pages/solicitarTutoria';
import LandingPage from './pages/landingPage';
import CrearCuenta from './pages/crearCuenta';
import IniciarSesion from './pages/iniciarSesion';
import RecuperarContrasena from './pages/recuperarContrasena';
import ConfirmacionRecuperacion from './pages/confirmacionRecuperacion';
import NuevaContrasena from './pages/nuevaContrasena';
import ContrasenaActualizada from './pages/contrasenaActualizada';
import SolicitudesRecibidasTutor from './pages/solicitudesRecibidasTutor';
import DetalleSolicitudTutor from './pages/detalleSolicitudTutor';
import MonitoriasTutor from './pages/monitoriasTutor';
import MiDisponibilidadTutor from './pages/miDisponibilidadTutor';
import HomeAdmin from './pages/admin/HomeAdmin';
import EstudiantesAdmin from './pages/admin/EstudiantesAdmin';
import MonitoriasAdmin from './pages/admin/MonitoriasAdmin';
import CrearMonitoriaAdmin from './pages/admin/CrearMonitoriaAdmin';
import MonitoriaCreadaAdmin from './pages/admin/MonitoriaCreadaAdmin';
import CalendarioAdmin from './pages/admin/CalendarioAdmin';
import ReportesAdmin from './pages/admin/ReportesAdmin';
import SoporteAdmin from './pages/admin/SoporteAdmin';
import PerfilAdmin from './pages/admin/PerfilAdmin';
import NotificacionesAdmin from './pages/admin/NotificacionesAdmin';
import TutoresAdmin from './pages/admin/TutoresAdmin';
import RegistrarTutorAdmin from './pages/admin/RegistrarTutorAdmin';
import PostulacionTutor from './pages/postulacionTutor';
import SolicitudesTutoresAdmin from './pages/admin/solicitudesTutoresAdmin';
import {
  cerrarSesionNexo,
  iniciarSesionNexo,
  obtenerMiPerfil,
  registrarUsuarioNexo,
} from './services/solicitudesTutor';
import {
  cancelarMonitoria as cancelarMonitoriaApi,
  aceptarSolicitudMonitoria,
  crearEvaluacion,
  crearParcial,
  eliminarParcial,
  listarParciales,
  buscarTutores as buscarTutoresApi,
  agregarTutorFavorito,
  actualizarFranjaDisponibilidad,
  crearFranjaDisponibilidad,
  eliminarFranjaDisponibilidad,
  listarTutoresFavoritos,
  listarMiDisponibilidad,
  listarMisEvaluaciones,
  listarMisMonitorias,
  listarMonitoriasAdministrativas,
  listarMonitoriasComoTutor,
  inscribirEnMonitoria as inscribirMonitoriaApi,
  crearMonitoriaGrupal,
  proponerHorario as proponerHorarioApi,
  rechazarSolicitudMonitoria,
  responderPropuestaHorario as responderPropuestaHorarioApi,
  solicitarMonitoria as solicitarMonitoriaApi,
  quitarTutorFavorito,
  listarMonitoriasDisponibles,
  cancelarInscripcionMonitoria,
} from './services/modulosIntegrados';
import {
  abrirConversacionDirecta,
  abrirConversacionGrupo,
} from './services/chatService';
import {
  DEMO_ESTUDIANTES_ADMIN,
  DEMO_TUTORES_ADMIN,
  DEMO_MONITORIAS_ADMIN,
  DEMO_PERFIL_ADMIN,
} from './pages/admin/adminMockData';

const USUARIO_INICIAL = {
  nombre: 'Nombre del estudiante',
  correo: 'correo@ejemplo.com',
  programa: 'Ingeniería de Sistemas',
  semestre: '5°',
  rol: 'Estudiante',
  iniciales: 'NE',
};

const PANTALLAS_PUBLICAS = new Set([
  'Landing',
  'Crear cuenta',
  'Iniciar sesión',
  'Recuperar contraseña',
  'Confirmación recuperación',
  'Nueva contraseña',
  'Contraseña actualizada',
]);

const PANTALLAS_ADMINISTRADOR = new Set([
  'Home Admin',
  'Estudiantes admin',
  'Monitorias admin',
  'Crear monitoria admin',
  'Crear monitoria pre-parcial Admin',
  'Monitoría creada admin',
  'Calendario Admin',
  'Agregar parcial Admin',
  'Reportes admin',
  'Soporte admin',
  'Mi perfil admin',
  'Notificaciones Admin',
  'Tutores admin',
  'Registrar tutor admin',
  'Solicitudes de tutores admin',
]);

const PANTALLAS_TUTOR = new Set([
  'Monitorías asignadas',
  'Solicitudes recibidas',
  'Detalle solicitud tutor',
  'Mi disponibilidad',
]);

function adaptarUsuarioBackend(usuarioBackend) {
  const semestre = usuarioBackend.semestre;
  const semestreTexto = typeof semestre === 'number'
    ? `${semestre}°`
    : semestre || '';

  return {
    ...usuarioBackend,
    programa: usuarioBackend.carrera || '',
    semestre: semestreTexto,
    iniciales: usuarioBackend.nombre
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase() || 'NE',
  };
}

function formatoFecha(fecha) {
  const fechaLocal = new Date(`${String(fecha).slice(0, 10)}T00:00:00`);
  return Number.isNaN(fechaLocal.getTime())
    ? ''
    : fechaLocal.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
}

function fechaActualLocal() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function formatoHora(hora) {
  if (!/^\d{2}:\d{2}$/.test(hora || '')) return hora || '';
  const [horas, minutos] = hora.split(':').map(Number);
  const sufijo = horas >= 12 ? 'PM' : 'AM';
  return `${horas % 12 || 12}:${String(minutos).padStart(2, '0')} ${sufijo}`;
}

function adaptarDisponibilidadBackend(franja) {
  const nombresDias = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo',
  };
  return {
    id: String(franja._id),
    dia: nombresDias[franja.diaSemana] || franja.diaSemana,
    inicio: franja.horaInicio,
    fin: franja.horaFin,
  };
}

function adaptarTutorFavorito(tutor) {
  const iniciales = tutor.nombre
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'TU';
  const semestreTutor = tutor.semestre
    ? `${tutor.semestre}° semestre`
    : 'Semestre no disponible';
  const horarios = tutor.horarios || [];

  return {
    ...tutor,
    id: String(tutor._id),
    programa: tutor.carrera || 'Programa académico',
    programaLabel: `${tutor.carrera || 'Programa académico'} · ${semestreTutor}`,
    semestreTutor,
    iniciales,
    calificacion: tutor.calificacion ?? null,
    resenas: tutor.resenas ?? 0,
    disponibilidad: horarios.length ? 'Horarios registrados' : 'Sin horarios registrados',
    estado: horarios.length ? 'disponible' : 'ocupado',
    materias: tutor.materias || [],
  };
}

function adaptarMonitoriaTutorBackend(monitoria) {
  const tutor = monitoria.tutor && typeof monitoria.tutor === 'object'
    ? monitoria.tutor
    : {};
  const tipos = {
    par: 'Tutoría individual',
    obligatoria: 'Obligatoria',
    preparcial: 'Pre-parcial',
    saber_pro: 'Saber Pro',
  };
  const estados = {
    solicitada: 'Pendiente',
    rechazada: 'Rechazada',
    programada: 'Programada',
    cancelada: 'Cancelada',
    finalizada: 'Finalizada',
  };
  const fecha = formatoFecha(monitoria.fecha);
  const hora = `${formatoHora(monitoria.horaInicio)} — ${formatoHora(monitoria.horaFin)}`;
  const programas = [...new Set(
    (monitoria.estudiantes || []).map((estudiante) => estudiante.carrera).filter(Boolean)
  )];
  const iniciales = tutor.nombre
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'TU';

  return {
    id: String(monitoria._id),
    tipoBackend: monitoria.tipo,
    estudianteIds: (monitoria.estudiantes || []).map((estudiante) =>
      String(estudiante._id || estudiante)
    ),
    titulo: `${tipos[monitoria.tipo] || 'Monitoría'} ${monitoria.materia}`,
    tipo: tipos[monitoria.tipo] || monitoria.tipo,
    estado: estados[monitoria.estado] || monitoria.estado,
    programa: programas.join(' / ') || 'Programa académico',
    horario: `${fecha} · ${hora}`,
    fecha,
    hora,
    modalidad: monitoria.modalidad === 'virtual' ? 'Virtual' : 'Presencial',
    lugar: monitoria.lugar || '',
    inscritos: monitoria.estudiantes?.length ?? monitoria.inscritos ?? 0,
    cupo: monitoria.cupoMaximo ?? 1,
    proximaSesion: `${fecha} · ${hora}`,
    monitor: tutor.nombre || 'Tutor',
    semestreMonitor: tutor.semestre
      ? `${tutor.carrera || 'Tutor'} · ${tutor.semestre}° semestre`
      : 'Semestre no disponible',
    calificacion: '—',
    iniciales,
    descripcion: monitoria.descripcion || '',
    preparacion: monitoria.parcial?.nombre || '',
    temas: monitoria.tema ? [monitoria.tema] : [],
  };
}

function adaptarMonitoriaCatalogoBackend(monitoria) {
  const tutor = monitoria.tutor && typeof monitoria.tutor === 'object'
    ? monitoria.tutor
    : {};

  const tipos = {
    obligatoria: 'Obligatoria',
    preparcial: 'Pre-parcial',
    saber_pro: 'Saber Pro',
  };

  const inscritos = Number(monitoria.inscritos ?? 0);
  const cupo = Number(monitoria.cupoMaximo ?? 0);
  const inscrito = Boolean(monitoria.inscrito);

  let estado = 'Disponible';

  if (inscrito) {
    estado = 'Inscrito';
  } else if (cupo > 0 && inscritos >= cupo) {
    estado = 'Cupo lleno';
  }

  const fecha = formatoFecha(monitoria.fecha);
  const hora = `${formatoHora(monitoria.horaInicio)} — ${formatoHora(monitoria.horaFin)}`;

  const iniciales = tutor.nombre
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'TU';

  return {
    id: String(monitoria._id),
    titulo: `${tipos[monitoria.tipo] || 'Monitoría'} ${monitoria.materia}`,
    tipo: tipos[monitoria.tipo] || monitoria.tipo,
    tipoBackend: monitoria.tipo,
    estado,
    inscrito,
    monitor: tutor.nombre || 'Tutor',
    tutorId: tutor._id ? String(tutor._id) : '',
    iniciales,
    semestreMonitor: tutor.semestre
      ? `${tutor.carrera || ''} · ${tutor.semestre}° semestre`
      : '',
    fecha,
    hora,
    horario: `${fecha} · ${hora}`,
    modalidad: monitoria.modalidad === 'virtual' ? 'Virtual' : 'Presencial',
    lugar: monitoria.lugar || '',
    inscritos,
    cupo,
    cupoMinimo: Number(monitoria.cupoMinimo ?? 1),
    cupoMinimoAlcanzado: Boolean(monitoria.cupoMinimoAlcanzado),
    descripcion: monitoria.descripcion || '',
    preparacion: monitoria.parcial?.nombre || '',
    temas: monitoria.tema ? [monitoria.tema] : [],
    parcial: monitoria.parcial || null,
  };
}

function adaptarMonitoriaBackend(monitoria, evaluada = false) {
  const estadoMonitoria = {
    solicitada: 'Pendiente',
    rechazada: 'Rechazada',
    programada: 'Aceptada',
    cancelada: 'Cancelada',
    finalizada: 'Completada',
  }[monitoria.estado] || monitoria.estado;
  const tutor = monitoria.tutor && typeof monitoria.tutor === 'object'
    ? monitoria.tutor
    : {};
  const propuesta = monitoria.propuestaHorario;
  const estadoPropuesta = {
    pendiente: 'Por confirmar',
    aceptada: 'Aceptado',
    rechazada: 'Rechazado',
  }[propuesta?.estado];
  const horarioPrincipal = propuesta
    ? `${formatoFecha(propuesta.fechaPrincipal)} · ${formatoHora(propuesta.horaInicioPrincipal)} — ${formatoHora(propuesta.horaFinPrincipal)}`
    : '';
  const horarioAlternativo = propuesta
    ? `${formatoFecha(propuesta.fechaAlternativa)} · ${formatoHora(propuesta.horaInicioAlternativa)} — ${formatoHora(propuesta.horaFinAlternativa)}`
    : '';
  const duracionMinutos = (() => {
    if (!/^\d{2}:\d{2}$/.test(monitoria.horaInicio || '') || !/^\d{2}:\d{2}$/.test(monitoria.horaFin || '')) return 60;
    const minutos = (hora) => hora.split(':').reduce((total, parte) => total * 60 + Number(parte), 0);
    return minutos(monitoria.horaFin) - minutos(monitoria.horaInicio);
  })();
  const inicialesTutor = tutor.nombre
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'NT';

  return {
    id: String(monitoria._id),
    materia: monitoria.materia,
    tema: monitoria.tema || '',
    tutor: tutor.nombre || 'Tutor',
    tutorId: tutor._id,
    programaTutor: tutor.carrera || '',
    semestreTutor: tutor.semestre ? `${tutor.semestre}° semestre` : '',
    calificacion: '—',
    iniciales: inicialesTutor,
    fecha: formatoFecha(monitoria.fecha),
    fechaSolicitud: monitoria.createdAt
      ? new Date(monitoria.createdAt).toLocaleDateString('es-CO')
      : '',
    hora: `${formatoHora(monitoria.horaInicio)} — ${formatoHora(monitoria.horaFin)}`,
    horario: horarioPrincipal || `${formatoFecha(monitoria.fecha)} · ${formatoHora(monitoria.horaInicio)} — ${formatoHora(monitoria.horaFin)}`,
    duracion: `${duracionMinutos} minutos`,
    modalidad: monitoria.modalidad === 'virtual' ? 'Virtual' : 'Presencial',
    estado: estadoMonitoria,
    estadoApi: monitoria.estado,
    categoria: monitoria.estado === 'finalizada'
      ? 'Finalizadas'
      : ['cancelada', 'rechazada'].includes(monitoria.estado)
        ? 'Canceladas'
        : 'Proximas',
    evaluada,
    monitoriaId: String(monitoria._id),
    propuesta: monitoria.estado === 'programada' && propuesta?.estado === 'pendiente',
    horarioPrincipal,
    horarioAlternativo,
    notaTutor: propuesta?.nota || '',
    estadoPropuesta,
    tutorData: {
      id: tutor._id,
      nombre: tutor.nombre || 'Tutor',
      programa: tutor.carrera || '',
      semestreTutor: tutor.semestre ? `${tutor.semestre}° semestre` : '',
      calificacion: '—',
      iniciales: inicialesTutor,
      materias: [monitoria.materia].filter(Boolean),
    },
  };
}

function adaptarSolicitudTutorBackend(monitoria) {
  const estudiante = monitoria.estudiantes?.[0] || {};
  const propuesta = monitoria.propuestaHorario;
  const estadoPropuesta = {
    pendiente: 'Por confirmar',
    aceptada: 'Aceptado',
    rechazada: 'Rechazado',
  }[propuesta?.estado];
  const iniciales = estudiante.nombre
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'NE';

  return {
    id: String(monitoria._id),
    estudiante: estudiante.nombre || 'Estudiante',
    estudianteId: estudiante._id,
    iniciales,
    programaEstudiante: estudiante.carrera || '',
    semestreEstudiante: estudiante.semestre ? `${estudiante.semestre}° semestre` : '',
    materia: monitoria.materia,
    tema: monitoria.tema || '',
    modalidad: monitoria.modalidad === 'virtual' ? 'Virtual' : 'Presencial',
    fecha: monitoria.createdAt
      ? new Date(monitoria.createdAt).toLocaleDateString('es-CO')
      : formatoFecha(monitoria.fecha),
    estado: {
      solicitada: 'Pendiente',
      programada: 'Aceptada',
      rechazada: 'Rechazada',
      cancelada: 'Cancelada',
      finalizada: 'Completada',
    }[monitoria.estado] || monitoria.estado,
    descripcion: monitoria.descripcion || '',
    propuesta: Boolean(propuesta),
    propuestaPendiente: propuesta?.estado === 'pendiente',
    estadoPropuesta,
    horario: propuesta
      ? `${formatoFecha(propuesta.fechaPrincipal)} · ${formatoHora(propuesta.horaInicioPrincipal)} — ${formatoHora(propuesta.horaFinPrincipal)}`
      : '',
    propuestaHorario: propuesta,
  };
}

function App() {
  const [pantalla, setPantallaActual] = useState('Landing');
  const pantallaActual = useRef('Landing');
  const historialPantallas = useRef([]);
  const [usuario, setUsuario] = useState(USUARIO_INICIAL);
  const [sesionActiva, setSesionActiva] = useState(false);
  const [errorInicioSesion, setErrorInicioSesion] = useState('');
  const [errorSesion, setErrorSesion] = useState('');
  const [cargandoDatosEstudiante, setCargandoDatosEstudiante] = useState(false);
  const [cargandoSolicitudesTutor, setCargandoSolicitudesTutor] = useState(false);
  const [tutoresBusqueda, setTutoresBusqueda] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [cargandoDisponibilidadTutor, setCargandoDisponibilidadTutor] = useState(false);
  const [errorDisponibilidadTutor, setErrorDisponibilidadTutor] = useState('');
  const [cargandoMonitoriasTutor, setCargandoMonitoriasTutor] = useState(false);
  const revisionSesion = useRef(0);

  const setPantalla = (siguiente) => {
    const destino = typeof siguiente === 'function'
      ? siguiente(pantallaActual.current)
      : siguiente;

    if (destino === pantallaActual.current) return;

    if (destino === 'Landing') {
      historialPantallas.current = [];
    } else {
      const ultimaPantalla = historialPantallas.current.length - 1;
      if (historialPantallas.current[ultimaPantalla] === destino) {
        historialPantallas.current.pop();
      } else {
        historialPantallas.current.push(pantallaActual.current);
      }
    }

    pantallaActual.current = destino;
    setPantallaActual(destino);
  };

  // Búsqueda de tutores
  const [filtrosBusqueda, setFiltrosBusqueda] = useState({});
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const [paginaAnteriorPerfil, setPaginaAnteriorPerfil] = useState('Resultados búsqueda');
  const [tutorParaSolicitud, setTutorParaSolicitud] = useState(null);
  const [paginaAnteriorSolicitud, setPaginaAnteriorSolicitud] = useState('Perfil tutor');
  const [tutoresFavoritos, setTutoresFavoritos] = useState([]);
  const [monitorias, setMonitorias] = useState([]);
  const [cargandoMonitorias, setCargandoMonitorias] = useState(false);
  const [errorMonitorias, setErrorMonitorias] = useState('');


  // Monitorías
  const [monitoriaSeleccionada, setMonitoriaSeleccionada] = useState(null);
  const [origenMonitoria, setOrigenMonitoria] = useState('estudiante');

  // Solicitudes
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [solicitudesTutor, setSolicitudesTutor] = useState([]);
  const [solicitudTutorSeleccionada, setSolicitudTutorSeleccionada] =
    useState(null);
  const [monitoriasTutor, setMonitoriasTutor] = useState([]);
  const [disponibilidadTutor, setDisponibilidadTutor] = useState([]);

  // Horario confirmado
  const [horarioConfirmado, setHorarioConfirmado] = useState('');

  // Tutorías
  const [tutorias, setTutorias] = useState([]);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  // Mensajes
  const [conversacionActiva, setConversacionActiva] = useState(null);

  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [estudiantesAdmin] = useState(DEMO_ESTUDIANTES_ADMIN);
  const [tutoresAdmin, setTutoresAdmin] = useState(DEMO_TUTORES_ADMIN);
  const [monitoriasAdmin, setMonitoriasAdmin] = useState(DEMO_MONITORIAS_ADMIN);
  const [examenesAdmin, setExamenesAdmin] = useState([]);
  const [monitoriasCalendarioAdmin, setMonitoriasCalendarioAdmin] = useState([]);
  const [parcialesParaMonitoriaAdmin, setParcialesParaMonitoriaAdmin] = useState([]);
  const [tutoresParaMonitoriaAdmin, setTutoresParaMonitoriaAdmin] = useState([]);
  const [cargandoReferenciasMonitoriaAdmin, setCargandoReferenciasMonitoriaAdmin] =
    useState(true);


  // ========================================
  // NAVEGACIÓN GENERAL
  // ========================================

  const regresarPantalla = () => {
    const pantallasSinNavegacion = new Set([
      'Landing',
      'Crear cuenta',
      'Iniciar sesión',
      'Recuperar contraseña',
      'Confirmación recuperación',
      'Nueva contraseña',
      'Contraseña actualizada',
    ]);

    while (historialPantallas.current.length > 0) {
      const anterior = historialPantallas.current.pop();
      if (anterior !== pantallaActual.current && !pantallasSinNavegacion.has(anterior)) {
        pantallaActual.current = anterior;
        setPantallaActual(anterior);
        return;
      }
    }

    const esAdmin = usuario.rol === 'admin' || usuario.rol === 'Administrador';
    const inicioRol = esAdmin ? 'Home Admin' : 'Inicio';
    if (pantallaActual.current !== inicioRol) {
      pantallaActual.current = inicioRol;
      setPantallaActual(inicioRol);
    }
  };

  const navegar = (destino) => {
    if (destino === '__back__') {
      regresarPantalla();
      return;
    }

    if (destino === 'Landing') {
      setErrorSesion('');
      if (sesionActiva) {
        revisionSesion.current += 1;
        cerrarSesionNexo()
          .then(() => {
            setSesionActiva(false);
            setUsuario(USUARIO_INICIAL);
            setSolicitudes([]);
            setTutorias([]);
            setSolicitudesTutor([]);
            setMonitoriasTutor([]);
            setDisponibilidadTutor([]);
            setSolicitudSeleccionada(null);
            setTutoriaSeleccionada(null);
            setSolicitudTutorSeleccionada(null);
            setErrorInicioSesion('');
            setTutoresFavoritos([]);
            setPantalla('Landing');
          })
          .catch((error) => setErrorSesion(error.message));
        return;
      }

      setUsuario(USUARIO_INICIAL);
      setErrorInicioSesion('');
    }

    const pantallasDisponibles = [
      'Inicio',
      'Buscar tutores',
      'Resultados búsqueda',
      'Monitorías',
      'Monitorías asignadas',
      'Detalle monitoría',
      'Calendario',
      'Mis solicitudes',
      'Detalle solicitud',
      'Propuesta horario',
      'Horario confirmado',
      'Mis monitorias',
      'Detalle tutoría',
      'Evaluar tutoría',
      'Confirmacion evaluacion',
      'Mensajes',
      'Favoritos',
      'Mi perfil',
      'Notificaciones',
      'Soporte',
      'Perfil tutor',
      'Solicitar tutoría',
      'Landing',
      'Crear cuenta',
      'Iniciar sesión',
      'Recuperar contraseña',
      'Confirmación recuperación',
      'Nueva contraseña',
      'Contraseña actualizada',
      'Solicitudes recibidas',
      'Detalle solicitud tutor',
      'Mi disponibilidad',
      'Postulación tutor',
      'Home Admin',
      'Estudiantes admin',
      'Monitorias admin',
      'Crear monitoria admin',
      'Crear monitoria pre-parcial Admin',
      'Monitoría creada admin',
      'Calendario Admin',
      'Agregar parcial Admin',
      'Reportes admin',
      'Soporte admin',
      'Mi perfil admin',
      'Notificaciones Admin',
      'Tutores admin',
      'Registrar tutor admin',
      'Solicitudes de tutores admin',

    ];

    if (pantallasDisponibles.includes(destino)) {
      if (!PANTALLAS_PUBLICAS.has(destino) && !sesionActiva) {
        setPantalla('Iniciar sesión');
        return;
      }

      const esAdmin = usuario.rol === 'admin' || usuario.rol === 'Administrador';
      const esTutor = usuario.rol === 'tutor' || usuario.rol === 'Estudiante-Tutor';
      if (PANTALLAS_ADMINISTRADOR.has(destino) && !esAdmin) return;
      if (PANTALLAS_TUTOR.has(destino) && !esTutor) return;

      if (destino === 'Mi disponibilidad' && pantallaActual.current !== destino) {
        setCargandoDisponibilidadTutor(true);
        setErrorDisponibilidadTutor('');
      }
      if (destino === 'Monitorías asignadas' && pantallaActual.current !== destino) {
        setCargandoMonitoriasTutor(true);
      }
      setPantalla(destino);
    }
  };

  const actualizarUsuarioDesdeBackend = useCallback((usuarioBackend) => {
    setUsuario(adaptarUsuarioBackend(usuarioBackend));
  }, []);

  useEffect(() => {
    let vigente = true;
    const revisionInicial = revisionSesion.current;

    obtenerMiPerfil()
      .then((perfil) => {
        if (!vigente || revisionSesion.current !== revisionInicial) return;
        const usuarioAutenticado = adaptarUsuarioBackend(perfil);
        setUsuario(usuarioAutenticado);
        setSesionActiva(true);
        setErrorSesion('');
        setPantalla(usuarioAutenticado.rol === 'admin' ? 'Home Admin' : 'Inicio');
      })
      .catch((error) => {
        if (vigente && error.status !== 401) {
          setErrorSesion(error.message);
        }
      });

    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (!sesionActiva || usuario.rol === 'admin') return undefined;
    let vigente = true;
    listarTutoresFavoritos()
      .then((favoritos) => {
        if (vigente) setTutoresFavoritos(favoritos.map(adaptarTutorFavorito));
      })
      .catch((error) => {
        if (vigente) setErrorSesion(error.message);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol]);

  useEffect(() => {
    if (
      !sesionActiva
      || usuario.rol === 'admin'
      || !['Mis solicitudes', 'Mis monitorias', 'Propuesta horario'].includes(pantalla)
    ) return undefined;
    let vigente = true;
    setCargandoDatosEstudiante(true);

    Promise.all([listarMisMonitorias(), listarMisEvaluaciones()])
      .then(([monitoriasBackend, evaluacionesBackend]) => {
        if (!vigente) return;
        const evaluadas = new Set(
          evaluacionesBackend.map((evaluacion) => String(evaluacion.monitoria))
        );
        const solicitudesBackend = monitoriasBackend
          .filter((monitoria) => (
            monitoria.tipo === 'par'
            && ['solicitada', 'programada', 'rechazada', 'cancelada'].includes(monitoria.estado)
          ))
          .map((monitoria) => adaptarMonitoriaBackend(
            monitoria,
            evaluadas.has(String(monitoria._id)),
          ));
        const tutoriasBackend = monitoriasBackend
          .filter((monitoria) => ['programada', 'finalizada', 'cancelada'].includes(monitoria.estado))
          .map((monitoria) => adaptarMonitoriaBackend(
            monitoria,
            evaluadas.has(String(monitoria._id)),
          ));
        setSolicitudes(solicitudesBackend);
        setTutorias(tutoriasBackend);
        setErrorSesion('');
      })
      .catch((error) => {
        if (vigente) setErrorSesion(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoDatosEstudiante(false);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  useEffect(() => {
    if (
      !sesionActiva
      || usuario.rol !== 'tutor'
      || pantalla !== 'Monitorías asignadas'
    ) return undefined;
    let vigente = true;
    listarMonitoriasComoTutor()
      .then((monitoriasBackend) => {
        if (vigente) {
          setMonitoriasTutor(monitoriasBackend
            .filter((monitoria) => monitoria.tipo !== 'par')
            .map(adaptarMonitoriaTutorBackend));
          setErrorSesion('');
        }
      })
      .catch((error) => {
        if (vigente) setErrorSesion(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoMonitoriasTutor(false);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  useEffect(() => {
    if (
      !sesionActiva
      || usuario.rol !== 'tutor'
      || pantalla !== 'Mi disponibilidad'
    ) return undefined;
    let vigente = true;
    listarMiDisponibilidad()
      .then((franjas) => {
        if (vigente) {
          setDisponibilidadTutor(franjas.map(adaptarDisponibilidadBackend));
          setErrorDisponibilidadTutor('');
        }
      })
      .catch((error) => {
        if (vigente) setErrorDisponibilidadTutor(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoDisponibilidadTutor(false);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  useEffect(() => {
    if (
      !sesionActiva ||
      !['estudiante', 'tutor'].includes(usuario.rol) ||
      !['Inicio', 'Monitorías'].includes(pantalla)
    ) {
      return undefined;
    }

    let vigente = true;

    const cargarMonitorias = async () => {
      setCargandoMonitorias(true);
      setErrorMonitorias('');

      try {
        const monitoriasBackend = await listarMonitoriasDisponibles();

        if (!vigente) return;

        setMonitorias(
          monitoriasBackend.map(adaptarMonitoriaCatalogoBackend)
        );
      } catch (error) {
        if (!vigente) return;

        setMonitorias([]);
        setErrorMonitorias(
          error.message || 'No se pudieron cargar las monitorías.'
        );
      } finally {
        if (vigente) {
          setCargandoMonitorias(false);
        }
      }
    };

    cargarMonitorias();

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  useEffect(() => {
    if (
      !sesionActiva
      || usuario.rol !== 'tutor'
      || !['Solicitudes recibidas', 'Detalle solicitud tutor'].includes(pantalla)
    ) return undefined;
    let vigente = true;
    setCargandoSolicitudesTutor(true);

    listarMonitoriasComoTutor()
      .then((monitoriasBackend) => {
        if (vigente) {
          setSolicitudesTutor(monitoriasBackend
            .filter((monitoria) => monitoria.tipo === 'par')
            .map(adaptarSolicitudTutorBackend));
          setErrorSesion('');
        }
      })
      .catch((error) => {
        if (vigente) setErrorSesion(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoSolicitudesTutor(false);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  // ========================================
  // CALENDARIO ADMINISTRATIVO
  // ========================================

  useEffect(() => {
    if (
      !sesionActiva ||
      usuario.rol !== 'admin' ||
      !['Calendario Admin', 'Agregar parcial Admin'].includes(pantalla)
    ) {
      return undefined;
    }

    let vigente = true;

    const cargarParciales = async () => {
      try {
        const [parcialesBackend, monitoriasBackend] = await Promise.all([
          listarParciales(),
          listarMonitoriasAdministrativas({ tipo: 'preparcial' }),
        ]);

        if (vigente) {
          setExamenesAdmin(parcialesBackend);
          setMonitoriasCalendarioAdmin(monitoriasBackend);
          setErrorSesion('');
        }
      } catch (error) {
        if (vigente) {
          setErrorSesion(error.message || 'No se pudieron cargar los parciales.');
        }
      }
    };

    cargarParciales();

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  useEffect(() => {
    if (
      !sesionActiva ||
      usuario.rol !== 'admin' ||
      pantalla !== 'Crear monitoria pre-parcial Admin'
    ) {
      return undefined;
    }

    let vigente = true;
    Promise.all([listarParciales(), buscarTutoresApi()])
      .then(([parcialesBackend, tutoresBackend]) => {
        if (!vigente) return;
        setParcialesParaMonitoriaAdmin(parcialesBackend);
        setTutoresParaMonitoriaAdmin(tutoresBackend);
        setErrorSesion('');
      })
      .catch((error) => {
        if (vigente) setErrorSesion(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoReferenciasMonitoriaAdmin(false);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, usuario.rol, pantalla]);

  useEffect(() => {
    const manejarSesionExpirada = () => {
      revisionSesion.current += 1;
      setSesionActiva(false);
      setUsuario(USUARIO_INICIAL);
      setSolicitudes([]);
      setTutorias([]);
      setTutoresFavoritos([]);
      setSolicitudesTutor([]);
      setMonitoriasTutor([]);
      setDisponibilidadTutor([]);
      setSolicitudSeleccionada(null);
      setTutoriaSeleccionada(null);
      setSolicitudTutorSeleccionada(null);
      setErrorInicioSesion('Tu sesión expiró. Inicia sesión nuevamente.');
      setPantalla('Iniciar sesión');
    };

    window.addEventListener('nexo:session-expired', manejarSesionExpirada);
    return () => {
      window.removeEventListener('nexo:session-expired', manejarSesionExpirada);
    };
  }, []);

  // ========================================
  // BÚSQUEDA Y TUTORES
  // ========================================

  const realizarBusqueda = async (filtros) => {
    setFiltrosBusqueda(filtros);
    setErrorBusqueda('');
    setCargandoBusqueda(true);
    setPantalla('Resultados búsqueda');
    const materia = filtros.materia && filtros.materia !== 'Todas las materias'
      ? filtros.materia
      : undefined;
    try {
      const resultado = await buscarTutoresApi({ materia });
      setTutoresBusqueda(resultado);
    } catch (error) {
      setErrorBusqueda(error.message);
      setTutoresBusqueda([]);
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const abrirPerfilTutor = (tutor) => {
    setPaginaAnteriorPerfil(pantalla);
    setTutorSeleccionado(tutor ? {
      ...tutor,
      programa: tutor.programa || tutor.especialidad || tutor.programaTutor,
    } : null);
    setPantalla('Perfil tutor');
  };

  const abrirSolicitudTutor = (tutor) => {
    setPaginaAnteriorSolicitud(pantalla);
    setTutorParaSolicitud(tutor ? {
      ...tutor,
      programa: tutor.programa || tutor.especialidad || tutor.programaTutor,
    } : null);
    setPantalla('Solicitar tutoría');
  };

  const alternarFavorito = async (tutor) => {
    const idTutor = tutor?._id ?? tutor?.id;
    if (!idTutor) {
      setErrorSesion('No se pudo identificar al tutor para actualizar favoritos.');
      return;
    }

    const yaEsFavorito = tutoresFavoritos.some((favorito) =>
      String(favorito.id) === String(idTutor)
    );
    try {
      const favoritos = yaEsFavorito
        ? await quitarTutorFavorito(idTutor)
        : await agregarTutorFavorito(idTutor);
      setTutoresFavoritos(favoritos.map(adaptarTutorFavorito));
      setErrorSesion('');
    } catch (error) {
      setErrorSesion(error.message);
    }
  };

  const abrirChatEnMensajes = async (abrirConversacion) => {
    setErrorSesion('');
    setConversacionActiva(null);
    setPantalla('Mensajes');

    try {
      const conversacion = await abrirConversacion();
      setConversacionActiva(String(conversacion._id));
    } catch (error) {
      setErrorSesion(error.message);
    }
  };

  const abrirMensajesTutor = (tutor) => {
    const usuarioId = tutor?.id || tutor?._id;
    if (!usuarioId) {
      setConversacionActiva(null);
      setErrorSesion('No se pudo identificar al usuario para abrir el chat.');
      setPantalla('Mensajes');
      return;
    }

    return abrirChatEnMensajes(() => abrirConversacionDirecta(usuarioId));
  };

  // ========================================
  // MONITORÍAS
  // ========================================

  const abrirDetalleMonitoria = (monitoria) => {
    setMonitoriaSeleccionada(monitoria);
    setOrigenMonitoria('estudiante');
    setPantalla('Detalle monitoría');
  };

  const abrirDetalleMonitoriaTutor = (monitoria) => {
    setMonitoriaSeleccionada(monitoria);
    setOrigenMonitoria('tutor');
    setPantalla('Detalle monitoría');
  };

  const abrirDetalleMonitoriaCalendario = (monitoria) => {
    setMonitoriaSeleccionada(adaptarMonitoriaBackend(monitoria));
    setOrigenMonitoria(usuario.rol === 'tutor' ? 'tutor' : 'estudiante');
    setPantalla('Detalle monitoría');
  };

  const abrirMensajeMonitoria = (monitoria) => {
    if (monitoria.tipoBackend === 'par') {
      const estudianteId = monitoria.estudianteIds?.[0];
      if (!estudianteId) {
        setConversacionActiva(null);
        setErrorSesion('La monitoría no contiene un estudiante válido para el chat.');
        setPantalla('Mensajes');
        return;
      }

      return abrirChatEnMensajes(() => abrirConversacionDirecta(estudianteId));
    }

    return abrirChatEnMensajes(() => abrirConversacionGrupo(monitoria.id));
  };

  const actualizarMonitoria = (monitoriaActualizada) => {
    if (!monitoriaActualizada?.id) return;

    setMonitorias((actuales) =>
      actuales.map((monitoria) =>
        monitoria.id === monitoriaActualizada.id
          ? { ...monitoria, ...monitoriaActualizada }
          : monitoria
      )
    );
    setMonitoriaSeleccionada((actual) =>
      actual?.id === monitoriaActualizada.id
        ? { ...actual, ...monitoriaActualizada }
        : actual
    );
  };

  const inscribirEnMonitoria = async (monitoria) => {
    if (!monitoria?.id) {
      throw new Error('No se pudo identificar la monitoría.');
    }

    try {
      const resultado = await inscribirMonitoriaApi(monitoria.id);
      const monitoriaActualizada = adaptarMonitoriaCatalogoBackend(resultado);

      actualizarMonitoria(monitoriaActualizada);
      setErrorMonitorias('');

      return monitoriaActualizada;
    } catch (error) {
      setErrorMonitorias(error.message);
      throw error;
    }
  };

  const cancelarInscripcionEnMonitoria = async (monitoria) => {
    if (!monitoria?.id) {
      throw new Error('No se pudo identificar la monitoría.');
    }

    try {
      const resultado = await cancelarInscripcionMonitoria(monitoria.id);
      const monitoriaActualizada = adaptarMonitoriaCatalogoBackend(resultado);

      actualizarMonitoria(monitoriaActualizada);
      setErrorMonitorias('');

      return monitoriaActualizada;
    } catch (error) {
      setErrorMonitorias(error.message);
      throw error;
    }
  };

  // ========================================
  // SOLICITUDES
  // ========================================

  const abrirDetalleSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setPantalla('Detalle solicitud');
  };

  const abrirDetalleSolicitudTutor = (solicitud) => {
    setSolicitudTutorSeleccionada(solicitud);
    setPantalla('Detalle solicitud tutor');
  };

  const actualizarSolicitudTutor = async (id, cambios) => {
    try {
      const resultado = cambios.estado === 'Aceptada'
        ? await aceptarSolicitudMonitoria(id)
        : await rechazarSolicitudMonitoria(id, cambios.motivo);
      const solicitudActualizada = adaptarSolicitudTutorBackend(resultado);
      setSolicitudesTutor((actuales) => actuales.map((solicitud) =>
        solicitud.id === id ? solicitudActualizada : solicitud
      ));
      setSolicitudTutorSeleccionada((actual) =>
        actual?.id === id ? solicitudActualizada : actual
      );
      setErrorSesion('');
      return solicitudActualizada;
    } catch (error) {
      setErrorSesion(error.message);
      return null;
    }
  };

  const guardarPropuestaHorarioTutor = async (id, datos) => {
    const resultado = await proponerHorarioApi(id, datos);
    const solicitudActualizada = adaptarSolicitudTutorBackend(resultado);
    setSolicitudesTutor((actuales) => actuales.map((solicitud) =>
      solicitud.id === id ? solicitudActualizada : solicitud
    ));
    setSolicitudTutorSeleccionada((actual) =>
      actual?.id === id ? solicitudActualizada : actual
    );
    setErrorSesion('');
    return solicitudActualizada;
  };

  const abrirMensajesEstudiante = (solicitud) => {
    if (!solicitud.estudianteId) {
      setConversacionActiva(null);
      setErrorSesion('No se pudo identificar al estudiante para abrir el chat.');
      setPantalla('Mensajes');
      return;
    }

    return abrirChatEnMensajes(() =>
      abrirConversacionDirecta(solicitud.estudianteId)
    );
  };

  const guardarHorarioDisponibilidad = async (horario) => {
    const diasApi = {
      Lunes: 'lunes',
      Martes: 'martes',
      Miércoles: 'miercoles',
      Jueves: 'jueves',
      Viernes: 'viernes',
      Sábado: 'sabado',
      Domingo: 'domingo',
    };
    const datos = {
      diaSemana: diasApi[horario.dia],
      horaInicio: horario.inicio,
      horaFin: horario.fin,
    };
    const franjaBackend = horario.id
      ? await actualizarFranjaDisponibilidad(horario.id, datos)
      : await crearFranjaDisponibilidad(datos);
    const franjaActualizada = adaptarDisponibilidadBackend(franjaBackend);
    setDisponibilidadTutor((actuales) => horario.id
      ? actuales.map((franja) => franja.id === horario.id ? franjaActualizada : franja)
      : [...actuales, franjaActualizada]
    );
    setErrorDisponibilidadTutor('');
    return franjaActualizada;
  };

  const eliminarHorarioDisponibilidad = async (id) => {
    await eliminarFranjaDisponibilidad(id);
    setDisponibilidadTutor((actuales) =>
      actuales.filter((horario) => horario.id !== id)
    );
    setErrorDisponibilidadTutor('');
  };

  const crearSolicitud = async (solicitud) => {
    const monitoria = await solicitarMonitoriaApi({
      tutor: solicitud.tutorId,
      materia: solicitud.materia,
      tema: solicitud.tema,
      descripcion: solicitud.descripcion,
      modalidad: solicitud.modalidad === 'Virtual' ? 'virtual' : 'presencial',
      fecha: solicitud.fecha,
      horaInicio: solicitud.horaInicio,
      horaFin: solicitud.horaFin,
    });
    const creada = adaptarMonitoriaBackend(monitoria);
    setSolicitudes((actuales) => [creada, ...actuales]);
    return creada;
  };

  const cancelarSolicitud = async (id) => {
    try {
      await cancelarMonitoriaApi(id);
      const cambios = { estado: 'Cancelada', estadoApi: 'cancelada', propuesta: false, propuestaPendiente: false };
      setSolicitudes((actuales) => actuales.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, ...cambios } : solicitud
      ));
      setSolicitudSeleccionada((actual) =>
        actual?.id === id ? { ...actual, ...cambios } : actual
      );
      setErrorSesion('');
      return true;
    } catch (error) {
      setErrorSesion(error.message);
      return false;
    }
  };

  const rechazarPropuesta = async (solicitud) => {
    if (!solicitud?.id) throw new Error('No se encontró la tutoría.');
    const monitoriaBackend = await responderPropuestaHorarioApi(solicitud.id, {
      decision: 'rechazar',
    });
    const solicitudActualizada = adaptarMonitoriaBackend(monitoriaBackend);
    setSolicitudes((actuales) =>
      actuales.map((item) =>
        item.id === solicitud.id ? solicitudActualizada : item
      )
    );
    setSolicitudSeleccionada((actual) =>
      actual?.id === solicitud.id ? solicitudActualizada : actual
    );
  };

  const abrirPropuestaHorario = () => {
    setPantalla('Propuesta horario');
  };

  // ========================================
  // CONFIRMAR HORARIO
  // ========================================

  const confirmarHorario = async ({ solicitud, horario }) => {
    if (!solicitud?.id) throw new Error('No se encontró la tutoría.');
    const monitoriaBackend = await responderPropuestaHorarioApi(solicitud.id, {
      decision: 'aceptar',
      horario,
    });
    const solicitudActualizada = adaptarMonitoriaBackend(monitoriaBackend);
    setSolicitudes((actuales) =>
      actuales.map((item) => item.id === solicitud.id ? solicitudActualizada : item)
    );
    setTutorias((actuales) => actuales.some((tutoria) => tutoria.id === solicitud.id)
      ? actuales.map((tutoria) => tutoria.id === solicitud.id ? solicitudActualizada : tutoria)
      : [solicitudActualizada, ...actuales]);
    setSolicitudSeleccionada(solicitudActualizada);
    setHorarioConfirmado(`${solicitudActualizada.fecha} · ${solicitudActualizada.hora}`);
    setPantalla('Horario confirmado');
  };

  // ========================================
  // TUTORÍAS
  // ========================================

  // Abrir detalle de una tutoría
  const abrirDetalleTutoria = (tutoria) => {
    setTutoriaSeleccionada(tutoria);
    setPantalla('Detalle tutoría');
  };

  // Abrir evaluación de una tutoría
  const abrirEvaluacionTutoria = (tutoria) => {
    setTutoriaSeleccionada(tutoria);
    setPantalla('Evaluar tutoría');
  };

  // Cancelar tutoría
  const cancelarTutoria = async (id) => {
    try {
      await cancelarMonitoriaApi(id);
      const cambios = { categoria: 'Canceladas', estado: 'Cancelada' };
      setTutorias((actuales) => actuales.map((tutoria) =>
        tutoria.id === id ? { ...tutoria, ...cambios } : tutoria
      ));
      setTutoriaSeleccionada((actual) =>
        actual?.id === id ? { ...actual, ...cambios } : actual
      );
      setErrorSesion('');
      return true;
    } catch (error) {
      setErrorSesion(error.message);
      return false;
    }
  };

  // Registrar evaluación de una tutoría
  const registrarEvaluacion = async (id, evaluacion) => {
    const evaluacionGuardada = await crearEvaluacion({
      monitoria: id,
      ...evaluacion,
    });
    setTutorias((actuales) =>
      actuales.map((tutoria) =>
        tutoria.id === id
          ? {
              ...tutoria,
              evaluada: true,
              evaluacion: evaluacionGuardada,
            }
          : tutoria
      )
    );

    setTutoriaSeleccionada((actual) =>
      actual?.id === id
        ? {
            ...actual,
            evaluada: true,
            evaluacion: evaluacionGuardada,
          }
        : actual
    );
    return evaluacionGuardada;
  };

  
const crearCuenta = async (datosCuenta) => {
    setErrorSesion('');
    revisionSesion.current += 1;

    try {
      const respuesta = await registrarUsuarioNexo({
        nombre: [datosCuenta.nombre, datosCuenta.apellido]
          .filter(Boolean)
          .join(' '),
        correo: datosCuenta.correo,
        password: datosCuenta.contrasena,
        carrera: datosCuenta.programa,
        semestre: Number(datosCuenta.semestre),
        rol: datosCuenta.rol === 'admin' ? 'admin' : 'estudiante',
      });

      if (!respuesta.usuario) {
        throw new Error('El servidor no devolvió los datos de la cuenta.');
      }

      const usuarioAutenticado = adaptarUsuarioBackend(respuesta.usuario);

      setUsuario(usuarioAutenticado);
      setSesionActiva(true);
      setErrorSesion('');

      // Redirigir según el rol devuelto por el backend
      if (usuarioAutenticado.rol === 'admin') {
        setPantalla('Home Admin');
      } else {
        setPantalla('Inicio');
      }

      return true;
    } catch (error) {
      setErrorSesion(error.message || 'No se pudo crear la cuenta.');
      return false;
    }
  };



  const abrirRecuperacion = () => {
    setPantalla('Recuperar contraseña');
  };

  const continuarRecuperacion = (correo) => {
    setCorreoRecuperacion(correo);
    setPantalla('Confirmación recuperación');
  };

  const actualizarContrasena = () => {
    setPantalla('Contraseña actualizada');
  };

  const guardarMonitoriaAdmin = async (monitoria) => {
    if (monitoria.tipo === 'preparcial') {
      const monitoriaCreada = await crearMonitoriaGrupal(monitoria);
      setMonitoriasCalendarioAdmin((actuales) => [
        monitoriaCreada,
        ...actuales,
      ]);
      setErrorSesion('');
      setPantalla('Monitoría creada admin');
      return monitoriaCreada;
    }

    setMonitoriasAdmin((actuales) => [monitoria, ...actuales]);
    setPantalla('Monitoría creada admin');
    return monitoria;
  };

  const actualizarMonitoriaAdmin = (monitoria) => {
    setMonitoriasAdmin((actuales) =>
      actuales.map((actual) =>
        actual.id === monitoria.id ? { ...actual, ...monitoria } : actual
      )
    );
  };

  const guardarExamenAdmin = async (datos) => {
    const parcialCreado = await crearParcial(datos);

    setExamenesAdmin((actuales) => [parcialCreado, ...actuales]);
    setErrorSesion('');
    return parcialCreado;
  };

  const eliminarExamenAdmin = async (id) => {
    await eliminarParcial(id);

    setExamenesAdmin((actuales) =>
      actuales.filter((examen) => String(examen._id) !== String(id))
    );
    setErrorSesion('');
  };

  const registrarTutorAdmin = (tutor) => {
    setTutoresAdmin((actuales) => [tutor, ...actuales]);
    setPantalla('Tutores admin');
  };

  const actualizarTutorAdmin = (tutor) => {
    setTutoresAdmin((actuales) =>
      actuales.map((actual) =>
        actual.id === tutor.id ? { ...actual, ...tutor } : actual
      )
    );
  };

  const volverInicioSesion = () => {
    setErrorInicioSesion('');
    setPantalla('Iniciar sesión');
  };


  // ========================================
  // VISTAS
  // ========================================

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        setUsuario,
        solicitudesTutor,
      }}
    >
      <>

      {/* PÁGINA PÚBLICA DE BIENVENIDA */}
      {pantalla === 'Landing' && (
        <LandingPage
          onCrearCuenta={() => setPantalla('Crear cuenta')}
          onIniciarSesion={volverInicioSesion}
        />
      )}

      {/* CREAR CUENTA */}
      {pantalla === 'Crear cuenta' && (
        <CrearCuenta
          onVolver={() => setPantalla('Landing')}
          onIniciarSesion={volverInicioSesion}
          onCrearCuenta={crearCuenta}
        />
      )}

      {/* INICIAR SESIÓN */}
      {pantalla === 'Iniciar sesión' && (
        <>
          <IniciarSesion
            onCrearCuenta={() => {
              setErrorInicioSesion('');
              setPantalla('Crear cuenta');
            }}
            onIngresar={async (credenciales) => {
              revisionSesion.current += 1;
              setErrorInicioSesion('');
              try {
                const respuesta = await iniciarSesionNexo({
                  correo: credenciales.correo,
                  password: credenciales.contrasena,
                });
                if (!respuesta.usuario) {
                  throw new Error('El servidor no devolvió una sesión válida.');
                }

                const usuarioAutenticado = adaptarUsuarioBackend(respuesta.usuario);
                setUsuario(usuarioAutenticado);
                setSesionActiva(true);
                setErrorSesion('');
                setPantalla(usuarioAutenticado.rol === 'admin' ? 'Home Admin' : 'Inicio');
              } catch (error) {
                setErrorInicioSesion(error.message || 'No se pudo iniciar sesión.');
              }
            }}
            onOlvideContrasena={abrirRecuperacion}
          />
          {errorInicioSesion && (
            <p
              className="login-error"
              role="alert"
              style={{
                position: 'fixed',
                top: '16px',
                left: '50%',
                zIndex: 1000,
                transform: 'translateX(-50%)',
              }}
            >
              {errorInicioSesion}
            </p>
          )}
        </>
      )}


      {/* RECUPERAR CONTRASEÑA */}
      {pantalla === 'Recuperar contraseña' && (
        <RecuperarContrasena
          onVolver={volverInicioSesion}
          onContinuar={continuarRecuperacion}
        />
      )}

      {/* CONFIRMACIÓN DE ENVÍO */}
      {pantalla === 'Confirmación recuperación' && (
        <ConfirmacionRecuperacion
          correo={correoRecuperacion}
          onContinuar={() => setPantalla('Nueva contraseña')}
        />
      )}

      {/* NUEVA CONTRASEÑA */}
      {pantalla === 'Nueva contraseña' && (
        <NuevaContrasena
          onActualizar={actualizarContrasena}
        />
      )}

      {/* CONTRASEÑA ACTUALIZADA */}
      {pantalla === 'Contraseña actualizada' && (
        <ContrasenaActualizada
          onIniciarSesion={volverInicioSesion}
        />
      )}


      {/* INICIO */}
      {pantalla === 'Inicio' && (
        <HomeEstudiante
          onNavegar={navegar}
          onVerPerfilTutor={abrirPerfilTutor}
          onSolicitarTutoria={abrirSolicitudTutor}
          onInscribirMonitoria={inscribirEnMonitoria}
          monitorias={monitorias}
          tutorias={tutorias}
          tutoresFavoritos={tutoresFavoritos}
          onToggleFavorito={alternarFavorito}
          onEnviarMensajeTutor={abrirMensajesTutor}
        />
      )}

      {/* BUSCAR TUTORES */}
      {pantalla === 'Buscar tutores' && (
        <BuscarTutores
          onNavegar={navegar}
          onBuscar={realizarBusqueda}
        />
      )}

      {/* RESULTADOS DE BÚSQUEDA */}
      {pantalla === 'Resultados búsqueda' && (
        <ResultadosBusqueda
          onNavegar={navegar}
          filtrosBusqueda={filtrosBusqueda}
          tutores={tutoresBusqueda}
          cargando={cargandoBusqueda}
          error={errorBusqueda}
          onVerPerfilTutor={abrirPerfilTutor}
          onSolicitarTutoria={abrirSolicitudTutor}
          tutoresFavoritos={tutoresFavoritos}
          onToggleFavorito={alternarFavorito}
        />
      )}

      {/* LISTADO DE MONITORÍAS */}
      {pantalla === 'Monitorías' && (
        <Monitorias
          onNavegar={navegar}
          onVerDetalle={abrirDetalleMonitoria}
          monitorias={monitorias}
          onInscribir={inscribirEnMonitoria}
          onCancelarInscripcion={cancelarInscripcionEnMonitoria}
          cargando={cargandoMonitorias}
          error={errorMonitorias}
        />
      )}

      {/* DETALLE DE MONITORÍA */}
      {pantalla === 'Detalle monitoría' && (
        <DetalleMonitoria
          onNavegar={navegar}
          monitoria={monitoriaSeleccionada}
          onInscribirse={inscribirEnMonitoria}
          onCancelarInscripcion={cancelarInscripcionEnMonitoria}
          onVerPerfilTutor={abrirPerfilTutor}
          modoTutor={origenMonitoria === 'tutor'}
        />
      )}

      {pantalla === 'Solicitudes recibidas' && (
        <SolicitudesRecibidasTutor
          onNavegar={navegar}
          solicitudes={solicitudesTutor}
          cargando={cargandoSolicitudesTutor}
          onVerDetalle={abrirDetalleSolicitudTutor}
          onActualizarSolicitud={actualizarSolicitudTutor}
        />
      )}

      {pantalla === 'Detalle solicitud tutor' && (
        <DetalleSolicitudTutor
          onNavegar={navegar}
          solicitud={solicitudTutorSeleccionada}
          onEnviarMensaje={abrirMensajesEstudiante}
          onProponerHorario={guardarPropuestaHorarioTutor}
        />
      )}

      {pantalla === 'Monitorías asignadas' && (
        <MonitoriasTutor
          onNavegar={navegar}
          monitorias={monitoriasTutor}
          cargando={cargandoMonitoriasTutor}
          onVerDetalle={abrirDetalleMonitoriaTutor}
          onMensajeEstudiantes={abrirMensajeMonitoria}
        />
      )}

      {pantalla === 'Mi disponibilidad' && (
        <MiDisponibilidadTutor
          onNavegar={navegar}
          disponibilidad={disponibilidadTutor}
          cargando={cargandoDisponibilidadTutor}
          errorApi={errorDisponibilidadTutor}
          onGuardarHorario={guardarHorarioDisponibilidad}
          onEliminarHorario={eliminarHorarioDisponibilidad}
        />
      )}

      {/* CALENDARIO */}
      {pantalla === 'Calendario' && (
        <Calendario
          onNavegar={navegar}
          onVerMonitoria={abrirDetalleMonitoriaCalendario}
          onInscribirMonitoria={inscribirMonitoriaApi}
        />
      )}

      {/* MIS SOLICITUDES */}
      {pantalla === 'Mis solicitudes' && (
        <MisSolicitudes
          onNavegar={navegar}
          onVerDetalleSolicitud={abrirDetalleSolicitud}
          solicitudes={solicitudes}
          cargando={cargandoDatosEstudiante}
          onCancelarSolicitud={cancelarSolicitud}
          onNuevaSolicitud={() => abrirSolicitudTutor(null)}
        />
      )}

      {/* DETALLE DE SOLICITUD */}
      {pantalla === 'Detalle solicitud' && (
        <DetalleSolicitud
          onNavegar={navegar}
          solicitud={solicitudSeleccionada}
          onVerPropuesta={abrirPropuestaHorario}
          onVerPerfilTutor={abrirPerfilTutor}
          onEnviarMensajeTutor={abrirMensajesTutor}
        />
      )}

      {/* PROPUESTA DE HORARIO */}
      {pantalla === 'Propuesta horario' && (
        <PropuestaHorario
          onNavegar={navegar}
          solicitud={solicitudSeleccionada}
          onConfirmar={confirmarHorario}
          onRechazar={rechazarPropuesta}
        />
      )}

      {/* HORARIO CONFIRMADO */}
      {pantalla === 'Horario confirmado' && (
        <HorarioConfirmado
          onNavegar={navegar}
          solicitud={solicitudSeleccionada}
          horario={horarioConfirmado}
        />
      )}

      {/* MIS TUTORÍAS */}
      {pantalla === 'Mis monitorias' && (
        <MisMonitorias
          onNavegar={navegar}
          onVerDetalleTutoria={abrirDetalleTutoria}
          onEvaluarTutoria={abrirEvaluacionTutoria}
          onCancelarTutoria={cancelarTutoria}
          tutorias={tutorias}
          cargando={cargandoDatosEstudiante}
          setTutorias={setTutorias}
        />
      )}

      {/* DETALLE DE TUTORÍA */}
      {pantalla === 'Detalle tutoría' && (
        <DetalleTutoria
          onNavegar={navegar}
          tutoria={tutoriaSeleccionada}
          onCancelarTutoria={cancelarTutoria}
          onVerPerfilTutor={abrirPerfilTutor}
          onEnviarMensajeTutor={abrirMensajesTutor}
        />
      )}

      {/* EVALUAR TUTORÍA */}
      {pantalla === 'Evaluar tutoría' && (
        <EvaluarTutoria
          onNavegar={navegar}
          tutoria={tutoriaSeleccionada}
          onEnviarEvaluacion={registrarEvaluacion}
        />
      )}

      {/* CONFIRMACIÓN DE EVALUACIÓN */}
      {pantalla === 'Confirmacion evaluacion' && (
        <ConfirmacionEvaluacion
          onNavegar={navegar}
          calificacion={
            tutoriaSeleccionada?.evaluacion?.calificacionGeneral ?? 4
          }
        />
      )}

      {/* MENSAJES */}
      {pantalla === 'Mensajes' && (
        <Mensajes
          onNavegar={navegar}
          conversacionActiva={conversacionActiva}
          setConversacionActiva={setConversacionActiva}
          tutorias={tutorias}
          onVerPerfilTutor={abrirPerfilTutor}
          onVerDetalleTutoria={abrirDetalleTutoria}
          onVerMonitoriaTutor={abrirDetalleMonitoriaTutor}
        />
      )}

      {/* FAVORITOS */}
      {pantalla === 'Favoritos' && (
        <Favoritos
          onNavegar={navegar}
          onVerPerfilTutor={abrirPerfilTutor}
          onSolicitarTutoria={abrirSolicitudTutor}
          tutores={tutoresFavoritos}
          onToggleFavorito={alternarFavorito}
        />
      )}

      {/* MI PERFIL */}
      {pantalla === 'Mi perfil' && (
        <MiPerfil onNavegar={navegar} />
      )}

      {/* NOTIFICACIONES */}
      {pantalla === 'Notificaciones' && (
        <Notificaciones onNavegar={navegar} />
      )}

      {/* SOPORTE */}
      {pantalla === 'Soporte' && (
        <CentroSoporte onNavegar={navegar} />
      )}

      {pantalla === 'Postulación tutor' && (
        <PostulacionTutor
          onNavegar={navegar}
          onUsuarioActualizado={actualizarUsuarioDesdeBackend}
          sesionActiva={sesionActiva}
          usuario={usuario}
        />
      )}

      {/* PERFIL DEL TUTOR */}
      {pantalla === 'Perfil tutor' && (
        <PerfilTutor
          onNavegar={navegar}
          paginaAnterior={paginaAnteriorPerfil}
          onVolver={() => setPantalla(paginaAnteriorPerfil)}
          tutor={tutorSeleccionado}
          onSolicitar={abrirSolicitudTutor}
          favoritos={tutoresFavoritos}
          onToggleFavorito={alternarFavorito}
          onEnviarMensaje={abrirMensajesTutor}
        />
      )}

      {/* SOLICITAR TUTORÍA */}
      {pantalla === 'Solicitar tutoría' && (
        <SolicitarTutoria
          onNavegar={navegar}
          paginaAnterior={paginaAnteriorSolicitud}
          onVolver={() => setPantalla(paginaAnteriorSolicitud)}
          tutor={tutorParaSolicitud}
          onCrearSolicitud={crearSolicitud}
        />
      )}

      {/* MÓDULO ADMINISTRATIVO */}
      {pantalla === 'Home Admin' && (
        <HomeAdmin onNavegar={navegar} />
      )}

      {pantalla === 'Estudiantes admin' && (
        <EstudiantesAdmin
          onNavegar={navegar}
          estudiantes={estudiantesAdmin}
        />
      )}

      {pantalla === 'Monitorias admin' && (
        <MonitoriasAdmin
          onNavegar={navegar}
          monitorias={monitoriasAdmin}
          onActualizarMonitoria={actualizarMonitoriaAdmin}
        />
      )}

      {(pantalla === 'Crear monitoria admin' ||
        pantalla === 'Crear monitoria pre-parcial Admin') && (
        <CrearMonitoriaAdmin
          key={pantalla}
          onNavegar={navegar}
          tipoInicial={
            pantalla === 'Crear monitoria pre-parcial Admin'
              ? 'Pre-parcial'
              : 'Obligatoria'
          }
          onCrear={guardarMonitoriaAdmin}
          parciales={parcialesParaMonitoriaAdmin.filter(
            (parcial) => parcial.fecha >= fechaActualLocal()
          )}
          tutoresDisponibles={tutoresParaMonitoriaAdmin}
          cargandoReferencias={cargandoReferenciasMonitoriaAdmin}
          errorReferencias={errorSesion}
        />
      )}

      {pantalla === 'Monitoría creada admin' && (
        <MonitoriaCreadaAdmin onNavegar={navegar} />
      )}

      {(pantalla === 'Calendario Admin' ||
        pantalla === 'Agregar parcial Admin') && (
        <CalendarioAdmin
          onNavegar={navegar}
          examenes={examenesAdmin}
          monitorias={monitoriasCalendarioAdmin}
          onGuardarExamen={guardarExamenAdmin}
          onEliminarExamen={eliminarExamenAdmin}
          abrirFormulario={pantalla === 'Agregar parcial Admin'}
        />
      )}

      {pantalla === 'Reportes admin' && (
        <ReportesAdmin onNavegar={navegar} />
      )}

      {pantalla === 'Soporte admin' && (
        <SoporteAdmin onNavegar={navegar} />
      )}

      {pantalla === 'Mi perfil admin' && (
        <PerfilAdmin onNavegar={navegar} perfil={DEMO_PERFIL_ADMIN} />
      )}

      {pantalla === 'Notificaciones Admin' && (
        <NotificacionesAdmin onNavegar={navegar} />
      )}

      {pantalla === 'Tutores admin' && (
        <TutoresAdmin
          onNavegar={navegar}
          tutores={tutoresAdmin}
          onActualizarTutor={actualizarTutorAdmin}
        />
      )}

      {pantalla === 'Registrar tutor admin' && (
        <RegistrarTutorAdmin
          onNavegar={navegar}
          onRegistrar={registrarTutorAdmin}
        />
      )}

      {pantalla === 'Solicitudes de tutores admin' && sesionActiva && usuario.rol === 'admin' && (
        <SolicitudesTutoresAdmin
          onNavegar={navegar}
        />
      )}

      {errorSesion && (
        <p
          className="login-error"
          role="alert"
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            zIndex: 1000,
            transform: 'translateX(-50%)',
          }}
        >
          {errorSesion}
        </p>
      )}
      </>
    </UsuarioContext.Provider>
  );
}

export default App;
