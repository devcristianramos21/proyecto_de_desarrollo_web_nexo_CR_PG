
import { useState } from 'react';
import { UsuarioContext } from './components/layout/usuarioContext';

import HomeEstudiante from './pages/homeEstudiantes';
import BuscarTutores from './pages/buscarTutores';
import ResultadosBusqueda from './pages/resultadosBusqueda';
import Monitorias, { monitoriasIniciales } from './pages/monitorias';
import DetalleMonitoria from './pages/detalleMonitoria';
import Calendario from './pages/calendario';
import MisSolicitudes, { solicitudesIniciales } from './pages/misSolicitudes';
import DetalleSolicitud from './pages/detalleSolicitud';
import PropuestaHorario from './pages/propuestaHorario';
import HorarioConfirmado from './pages/horarioConfirmado';
import MisMonitorias, { tutoriasIniciales } from './pages/misMonitorias';
import DetalleTutoria from './pages/detalleMisMonitorias';
import EvaluarTutoria from './pages/evaluarTutoria';
import ConfirmacionEvaluacion from './pages/confirmacionEvaluacion';
import Mensajes, { conversacionesIniciales } from './pages/mensajes';
import Favoritos, { tutoresIniciales as tutoresFavoritosIniciales } from './pages/favoritos';
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
import SolicitudesRecibidasTutor, {
  solicitudesTutorIniciales,
} from './pages/solicitudesRecibidasTutor';
import DetalleSolicitudTutor from './pages/detalleSolicitudTutor';
import MonitoriasTutor, {
  monitoriasTutorIniciales,
} from './pages/monitoriasTutor';
import MiDisponibilidadTutor, {
  disponibilidadTutorInicial,
} from './pages/miDisponibilidadTutor';
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
import {
  DEMO_ESTUDIANTES_ADMIN,
  DEMO_TUTORES_ADMIN,
  DEMO_MONITORIAS_ADMIN,
  DEMO_EXAMENES_ADMIN,
  DEMO_TICKETS_ADMIN,
  DEMO_NOTIFICACIONES_ADMIN,
  DEMO_PERFIL_ADMIN,
} from './pages/admin/adminMockData';


function App() {
  const [pantalla, setPantalla] = useState('Landing');
  const [usuario, setUsuario] = useState({
    nombre: 'Nombre del estudiante',
    correo: 'correo@ejemplo.com',
    programa: 'Ingeniería de Sistemas',
    semestre: '5°',
    rol: 'Estudiante',
    iniciales: 'NE',
  });

  // Búsqueda de tutores
  const [filtrosBusqueda, setFiltrosBusqueda] = useState({});
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const [paginaAnteriorPerfil, setPaginaAnteriorPerfil] = useState('Resultados búsqueda');
  const [tutorParaSolicitud, setTutorParaSolicitud] = useState(null);
  const [paginaAnteriorSolicitud, setPaginaAnteriorSolicitud] = useState('Perfil tutor');
  const [tutoresFavoritos, setTutoresFavoritos] = useState(tutoresFavoritosIniciales);
  const [monitorias, setMonitorias] = useState(monitoriasIniciales);

  // Monitorías
  const [monitoriaSeleccionada, setMonitoriaSeleccionada] = useState(null);
  const [origenMonitoria, setOrigenMonitoria] = useState('estudiante');

  // Solicitudes
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [solicitudesTutor, setSolicitudesTutor] = useState(
    solicitudesTutorIniciales
  );
  const [solicitudTutorSeleccionada, setSolicitudTutorSeleccionada] =
    useState(null);
  const [monitoriasTutor] = useState(monitoriasTutorIniciales);
  const [disponibilidadTutor, setDisponibilidadTutor] = useState(
    disponibilidadTutorInicial
  );

  // Horario confirmado
  const [horarioConfirmado, setHorarioConfirmado] = useState('');

  // Tutorías
  const [tutorias, setTutorias] = useState(tutoriasIniciales);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  // Mensajes
  const [conversaciones, setConversaciones] = useState(conversacionesIniciales);
  const [conversacionActiva, setConversacionActiva] = useState(1);

  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [estudiantesAdmin] = useState(DEMO_ESTUDIANTES_ADMIN);
  const [tutoresAdmin, setTutoresAdmin] = useState(DEMO_TUTORES_ADMIN);
  const [monitoriasAdmin, setMonitoriasAdmin] = useState(DEMO_MONITORIAS_ADMIN);
  const [examenesAdmin, setExamenesAdmin] = useState(DEMO_EXAMENES_ADMIN);
  const [ticketsAdmin, setTicketsAdmin] = useState(DEMO_TICKETS_ADMIN);
  const [notificacionesAdmin, setNotificacionesAdmin] = useState(
    DEMO_NOTIFICACIONES_ADMIN
  );


  // ========================================
  // NAVEGACIÓN GENERAL
  // ========================================

  const navegar = (destino) => {
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

    ];

    if (pantallasDisponibles.includes(destino)) {
      setPantalla(destino);
    }
  };

  // ========================================
  // BÚSQUEDA Y TUTORES
  // ========================================

  const realizarBusqueda = (filtros) => {
    setFiltrosBusqueda(filtros);
    setPantalla('Resultados búsqueda');
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

  const alternarFavorito = (tutor) => {
    if (!tutor) return;

    setTutoresFavoritos((actuales) => {
      const existe = actuales.some((favorito) =>
        tutor.id != null
          ? favorito.id === tutor.id
          : favorito.nombre === tutor.nombre
      );

      return existe
        ? actuales.filter((favorito) =>
            tutor.id != null
              ? favorito.id !== tutor.id
              : favorito.nombre !== tutor.nombre
          )
        : [{ ...tutor }, ...actuales];
    });
  };

  const abrirMensajesTutor = (tutor) => {
    const datosTutor = tutor ? {
      ...tutor,
      programa: tutor.programa || tutor.especialidad || tutor.programaTutor,
    } : null;

    if (datosTutor) {
      const conversacionPorId = datosTutor.id == null
        ? null
        : conversaciones.find((item) => item.tutorId === datosTutor.id);
      const coincidenciasPorNombre = conversaciones.filter(
        (item) => item.tutor === datosTutor.nombre
      );
      const conversacion = conversacionPorId || (
        coincidenciasPorNombre.length === 1
          ? coincidenciasPorNombre[0]
          : null
      );

      if (conversacion) {
        setConversacionActiva(conversacion.id);
        setConversaciones((actuales) =>
          actuales.map((item) =>
            item.id === conversacion.id
              ? {
                  ...item,
                  tutorId: datosTutor.id ?? item.tutorId,
                  tutorInfo: datosTutor,
                }
              : item
          )
        );
      } else {
        const id = Date.now();
        setConversaciones((actuales) => [
          ...actuales,
          {
            id,
            tutorId: datosTutor.id,
            tutor: datosTutor.nombre || 'Tutor',
            tutorInfo: datosTutor,
            hora: 'Ahora',
            ultimoMensaje: 'Inicia la conversación',
            noLeidos: false,
            mensajes: [],
          },
        ]);
        setConversacionActiva(id);
      }
    }

    setPantalla('Mensajes');
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

  const abrirMensajeMonitoria = (monitoria) => {
    const conversacionExistente = conversaciones.find(
      (item) => item.monitoriaId === monitoria.id
    );

    if (conversacionExistente) {
      setConversacionActiva(conversacionExistente.id);
    } else {
      const id = Date.now();
      setConversaciones((actuales) => [
        ...actuales,
        {
          id,
          tipo: 'monitoria',
          monitoriaId: monitoria.id,
          monitoriaInfo: monitoria,
          tutor: `Estudiantes de ${monitoria.titulo}`,
          iniciales: 'ES',
          hora: 'Ahora',
          ultimoMensaje: 'Inicia la conversación',
          noLeidos: false,
          mensajes: [],
        },
      ]);
      setConversacionActiva(id);
    }

    setPantalla('Mensajes');
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

  const inscribirEnMonitoria = (monitoria) => {
    const actual = monitorias.find((item) => item.id === monitoria?.id);

    if (
      !actual ||
      actual.estado === 'Inscrito' ||
      actual.estado === 'Cupo lleno' ||
      actual.inscritos >= actual.cupo
    ) {
      return;
    }

    actualizarMonitoria({
      ...actual,
      estado: 'Inscrito',
      inscritos: actual.inscritos + 1,
    });
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

  const actualizarSolicitudTutor = (id, cambios) => {
    setSolicitudesTutor((actuales) =>
      actuales.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, ...cambios } : solicitud
      )
    );
    setSolicitudTutorSeleccionada((actual) =>
      actual?.id === id ? { ...actual, ...cambios } : actual
    );
  };

  const abrirMensajesEstudiante = (solicitud) => {
    const contactoId = `solicitud-${solicitud.id}`;
    const conversacionExistente = conversaciones.find(
      (item) => item.contactoId === contactoId
    );

    if (conversacionExistente) {
      setConversacionActiva(conversacionExistente.id);
    } else {
      const id = Date.now();
      setConversaciones((actuales) => [
        ...actuales,
        {
          id,
          tipo: 'estudiante',
          contactoId,
          tutor: solicitud.estudiante,
          iniciales: solicitud.iniciales || 'NE',
          hora: 'Ahora',
          ultimoMensaje: 'Inicia la conversación',
          noLeidos: false,
          mensajes: [],
        },
      ]);
      setConversacionActiva(id);
    }

    setPantalla('Mensajes');
  };

  const guardarHorarioDisponibilidad = (horario) => {
    setDisponibilidadTutor((actuales) =>
      actuales.some((item) => item.id === horario.id)
        ? actuales.map((item) =>
            item.id === horario.id ? horario : item
          )
        : [...actuales, horario]
    );
  };

  const eliminarHorarioDisponibilidad = (id) => {
    setDisponibilidadTutor((actuales) =>
      actuales.filter((horario) => horario.id !== id)
    );
  };

  const crearSolicitud = (solicitud) => {
    setSolicitudes((actuales) => [solicitud, ...actuales]);
  };

  const cancelarSolicitud = (id) => {
    const cambios = { estado: 'Cancelada', propuesta: false };
    setSolicitudes((actuales) =>
      actuales.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, ...cambios } : solicitud
      )
    );
    setSolicitudSeleccionada((actual) =>
      actual?.id === id ? { ...actual, ...cambios } : actual
    );
  };

  const rechazarPropuesta = (solicitud) => {
    if (!solicitud?.id) return;

    const cambios = {
      estado: 'Rechazada',
      estadoPropuesta: 'Rechazado',
      propuesta: false,
    };
    setSolicitudes((actuales) =>
      actuales.map((item) =>
        item.id === solicitud.id ? { ...item, ...cambios } : item
      )
    );
    setSolicitudSeleccionada((actual) =>
      actual?.id === solicitud.id ? { ...actual, ...cambios } : actual
    );
  };

  const abrirPropuestaHorario = () => {
    setPantalla('Propuesta horario');
  };

  // ========================================
  // CONFIRMAR HORARIO
  // ========================================

  const confirmarHorario = ({ solicitud, horario }) => {
    const solicitudActualizada = {
      ...solicitud,
      estado: 'Aceptada',
      estadoPropuesta: 'Aceptado',
      propuesta: true,
      horario,
    };

    setSolicitudes((actuales) =>
      actuales.map((item) =>
        item.id === solicitud.id ? { ...item, ...solicitudActualizada } : item
      )
    );

    const [fechaPropuesta, ...horaPropuesta] = horario.split('·');
    const nuevaTutoria = {
      id: `solicitud-${solicitud.id ?? Date.now()}`,
      solicitudId: solicitud.id,
      tutorId: solicitud.tutorId,
      materia: solicitud.materia,
      tema: solicitud.tema,
      tutor: solicitud.tutor,
      programaTutor: solicitud.programaTutor,
      semestreTutor: solicitud.semestreTutor,
      calificacion: solicitud.calificacion,
      fecha: fechaPropuesta.trim(),
      hora: horaPropuesta.join('·').trim(),
      duracion: '60 minutos',
      modalidad: solicitud.modalidad,
      estado: 'Programada',
      categoria: 'Proximas',
    };

    setTutorias((actuales) => {
      const existe = actuales.some(
        (tutoria) => tutoria.solicitudId === solicitud.id
      );

      return existe
        ? actuales.map((tutoria) =>
            tutoria.solicitudId === solicitud.id
              ? { ...tutoria, ...nuevaTutoria }
              : tutoria
          )
        : [nuevaTutoria, ...actuales];
    });
    setSolicitudSeleccionada(solicitudActualizada);
    setHorarioConfirmado(horario);
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
  const cancelarTutoria = (id) => {
    setTutorias((actuales) =>
      actuales.map((tutoria) =>
        tutoria.id === id
          ? {
              ...tutoria,
              categoria: 'Canceladas',
              estado: 'Cancelada',
            }
          : tutoria
      )
    );

    setTutoriaSeleccionada((actual) =>
      actual?.id === id
        ? {
            ...actual,
            categoria: 'Canceladas',
            estado: 'Cancelada',
          }
        : actual
    );
  };

  // Registrar evaluación de una tutoría
  const registrarEvaluacion = (id, evaluacion) => {
    setTutorias((actuales) =>
      actuales.map((tutoria) =>
        tutoria.id === id
          ? {
              ...tutoria,
              evaluada: true,
              evaluacion,
            }
          : tutoria
      )
    );

    setTutoriaSeleccionada((actual) =>
      actual?.id === id
        ? {
            ...actual,
            evaluada: true,
            evaluacion,
          }
        : actual
    );

    // Mostrar confirmación después de enviar
    setPantalla('Confirmacion evaluacion');
  };

  const crearCuenta = (datosCuenta) => {
    const rolSeleccionado = datosCuenta?.rol || usuario.rol;
    if (datosCuenta) {
      setUsuario((actual) => ({
        ...actual,
        nombre: [datosCuenta.nombre, datosCuenta.apellido]
          .filter(Boolean)
          .join(' '),
        iniciales: `${datosCuenta.nombre?.[0] || ''}${datosCuenta.apellido?.[0] || ''}` || actual.iniciales,
        correo: datosCuenta.correo || actual.correo,
        programa: datosCuenta.programa || actual.programa,
        semestre: datosCuenta.semestre
          ? `${datosCuenta.semestre}°`
          : actual.semestre,
        rol: rolSeleccionado,
      }));
    }
    setPantalla(rolSeleccionado === 'Administrador' ? 'Home Admin' : 'Inicio');
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

  const guardarMonitoriaAdmin = (monitoria) => {
    setMonitoriasAdmin((actuales) => [monitoria, ...actuales]);
    if (monitoria.tipo === 'Pre-parcial') {
      setExamenesAdmin((actuales) => {
        const indice = actuales.findIndex(
          (examen) =>
            !examen.monitoriaAsignada &&
            (examen.materia === monitoria.asignatura ||
              monitoria.asignatura?.includes(examen.materia))
        );
        if (indice < 0) return actuales;
        return actuales.map((examen, index) =>
          index === indice ? { ...examen, monitoriaAsignada: true } : examen
        );
      });
    }
    setPantalla('Monitoría creada admin');
  };

  const actualizarMonitoriaAdmin = (monitoria) => {
    setMonitoriasAdmin((actuales) =>
      actuales.map((actual) =>
        actual.id === monitoria.id ? { ...actual, ...monitoria } : actual
      )
    );
  };

  const guardarExamenAdmin = (examen) => {
    setExamenesAdmin((actuales) => [examen, ...actuales]);
  };

  const eliminarExamenAdmin = (id) => {
    setExamenesAdmin((actuales) =>
      actuales.filter((examen) => examen.id !== id)
    );
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

  const actualizarTicketAdmin = (ticket) => {
    setTicketsAdmin((actuales) =>
      actuales.map((actual) =>
        actual.id === ticket.id ? { ...actual, ...ticket } : actual
      )
    );
  };

  const marcarNotificacionLeidaAdmin = (id) => {
    setNotificacionesAdmin((actuales) =>
      actuales.map((notificacion) =>
        notificacion.id === id ? { ...notificacion, leida: true } : notificacion
      )
    );
  };

  const marcarTodasNotificacionesLeidasAdmin = () => {
    setNotificacionesAdmin((actuales) =>
      actuales.map((notificacion) => ({ ...notificacion, leida: true }))
    );
  };


  const volverInicioSesion = () => {
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
          onIniciarSesion={() => setPantalla('Iniciar sesión')}
        />
      )}

      {/* CREAR CUENTA */}
      {pantalla === 'Crear cuenta' && (
        <CrearCuenta
          onVolver={() => setPantalla('Landing')}
          onIniciarSesion={() => setPantalla('Iniciar sesión')}
          onCrearCuenta={crearCuenta}
        />
      )}

      {/* INICIAR SESIÓN */}
      {pantalla === 'Iniciar sesión' && (
        <IniciarSesion
          onCrearCuenta={() => setPantalla('Crear cuenta')}
          onIngresar={(credenciales) => {
            const rolSeleccionado = credenciales.rol || usuario.rol;
            setUsuario((actual) => ({
              ...actual,
              correo: credenciales.correo,
              rol: rolSeleccionado,
            }));
            setPantalla(rolSeleccionado === 'Administrador' ? 'Home Admin' : 'Inicio');
          }}
          onOlvideContrasena={abrirRecuperacion}
        />
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
          onActualizarMonitoria={actualizarMonitoria}
        />
      )}

      {/* DETALLE DE MONITORÍA */}
      {pantalla === 'Detalle monitoría' && (
        <DetalleMonitoria
          onNavegar={navegar}
          monitoria={monitoriaSeleccionada}
          onInscribirse={actualizarMonitoria}
          onVerPerfilTutor={abrirPerfilTutor}
          modoTutor={origenMonitoria === 'tutor'}
        />
      )}

      {pantalla === 'Solicitudes recibidas' && (
        <SolicitudesRecibidasTutor
          onNavegar={navegar}
          solicitudes={solicitudesTutor}
          onVerDetalle={abrirDetalleSolicitudTutor}
          onActualizarSolicitud={actualizarSolicitudTutor}
        />
      )}

      {pantalla === 'Detalle solicitud tutor' && (
        <DetalleSolicitudTutor
          onNavegar={navegar}
          solicitud={solicitudTutorSeleccionada}
          onEnviarMensaje={abrirMensajesEstudiante}
        />
      )}

      {pantalla === 'Monitorías asignadas' && (
        <MonitoriasTutor
          onNavegar={navegar}
          monitorias={monitoriasTutor}
          onVerDetalle={abrirDetalleMonitoriaTutor}
          onMensajeEstudiantes={abrirMensajeMonitoria}
        />
      )}

      {pantalla === 'Mi disponibilidad' && (
        <MiDisponibilidadTutor
          onNavegar={navegar}
          disponibilidad={disponibilidadTutor}
          onGuardarHorario={guardarHorarioDisponibilidad}
          onEliminarHorario={eliminarHorarioDisponibilidad}
          onGuardarDisponibilidad={setDisponibilidadTutor}
        />
      )}

      {/* CALENDARIO */}
      {pantalla === 'Calendario' && (
        <Calendario onNavegar={navegar} />
      )}

      {/* MIS SOLICITUDES */}
      {pantalla === 'Mis solicitudes' && (
        <MisSolicitudes
          onNavegar={navegar}
          onVerDetalleSolicitud={abrirDetalleSolicitud}
          solicitudes={solicitudes}
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
          tutorias={tutorias}
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
          conversaciones={conversaciones}
          setConversaciones={setConversaciones}
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
          onNavegar={navegar}
          tipoInicial={
            pantalla === 'Crear monitoria pre-parcial Admin'
              ? 'Pre-parcial'
              : 'Obligatoria'
          }
          onCrear={guardarMonitoriaAdmin}
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
          onGuardarExamen={guardarExamenAdmin}
          onEliminarExamen={eliminarExamenAdmin}
          abrirFormulario={pantalla === 'Agregar parcial Admin'}
        />
      )}

      {pantalla === 'Reportes admin' && (
        <ReportesAdmin onNavegar={navegar} />
      )}

      {pantalla === 'Soporte admin' && (
        <SoporteAdmin
          onNavegar={navegar}
          tickets={ticketsAdmin}
          onActualizarTicket={actualizarTicketAdmin}
        />
      )}

      {pantalla === 'Mi perfil admin' && (
        <PerfilAdmin onNavegar={navegar} perfil={DEMO_PERFIL_ADMIN} />
      )}

      {pantalla === 'Notificaciones Admin' && (
        <NotificacionesAdmin
          onNavegar={navegar}
          notificaciones={notificacionesAdmin}
          onMarcarLeida={marcarNotificacionLeidaAdmin}
          onMarcarTodasLeidas={marcarTodasNotificacionesLeidasAdmin}
        />
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
      </>
    </UsuarioContext.Provider>
  );
}

export default App;
