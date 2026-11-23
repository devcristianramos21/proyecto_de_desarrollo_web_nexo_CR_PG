
import { useState } from 'react';

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
import MisMonitorias, { tutoriasIniciales } from './pages/misMonitorias';
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

function App() {
  const [pantalla, setPantalla] = useState('Landing');

  // Búsqueda de tutores
  const [filtrosBusqueda, setFiltrosBusqueda] = useState({});
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const [tutorParaSolicitud, setTutorParaSolicitud] = useState(null);

  // Monitorías
  const [monitoriaSeleccionada, setMonitoriaSeleccionada] = useState(null);

  // Solicitudes
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // Horario confirmado
  const [horarioConfirmado, setHorarioConfirmado] = useState('');

  // Tutorías
  const [tutorias, setTutorias] = useState(tutoriasIniciales);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState(null);

  // ========================================
  // NAVEGACIÓN GENERAL
  // ========================================

  const navegar = (destino) => {
    const pantallasDisponibles = [
      'Inicio',
      'Buscar tutores',
      'Resultados búsqueda',
      'Monitorías',
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
    setTutorSeleccionado(tutor);
    setPantalla('Perfil tutor');
  };

  const abrirSolicitudTutor = (tutor) => {
    setTutorParaSolicitud(tutor);
    setPantalla('Solicitar tutoría');
  };

  // ========================================
  // MONITORÍAS
  // ========================================

  const abrirDetalleMonitoria = (monitoria) => {
    setMonitoriaSeleccionada(monitoria);
    setPantalla('Detalle monitoría');
  };

  // ========================================
  // SOLICITUDES
  // ========================================

  const abrirDetalleSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setPantalla('Detalle solicitud');
  };

  const abrirPropuestaHorario = () => {
    setPantalla('Propuesta horario');
  };

  // ========================================
  // CONFIRMAR HORARIO
  // ========================================

  const confirmarHorario = ({ solicitud, horario }) => {
    setSolicitudSeleccionada(solicitud);
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

  const crearCuenta = (datos) => {
    console.log('Datos del registro:', datos);

    alert('Formulario completado. La creación de cuentas se conectará al backend posteriormente.');

    setPantalla('Inicio');
  };

  // ========================================
  // VISTAS
  // ========================================

  return (
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
            console.log('Credenciales:', credenciales);
            alert('El inicio de sesión se conectará al backend posteriormente.');
          }}
        />
      )}

      {/* INICIO */}
      {pantalla === 'Inicio' && (
        <HomeEstudiante
          onNavegar={navegar}
          onVerPerfilTutor={abrirPerfilTutor}
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
        />
      )}

      {/* LISTADO DE MONITORÍAS */}
      {pantalla === 'Monitorías' && (
        <Monitorias
          onNavegar={navegar}
          onVerDetalle={abrirDetalleMonitoria}
        />
      )}

      {/* DETALLE DE MONITORÍA */}
      {pantalla === 'Detalle monitoría' && (
        <DetalleMonitoria
          onNavegar={navegar}
          monitoria={monitoriaSeleccionada}
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
        />
      )}

      {/* DETALLE DE SOLICITUD */}
      {pantalla === 'Detalle solicitud' && (
        <DetalleSolicitud
          onNavegar={navegar}
          solicitud={solicitudSeleccionada}
          onVerPropuesta={abrirPropuestaHorario}
        />
      )}

      {/* PROPUESTA DE HORARIO */}
      {pantalla === 'Propuesta horario' && (
        <PropuestaHorario
          onNavegar={navegar}
          solicitud={solicitudSeleccionada}
          onConfirmar={confirmarHorario}
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
        <Mensajes onNavegar={navegar} />
      )}

      {/* FAVORITOS */}
      {pantalla === 'Favoritos' && (
        <Favoritos
          onNavegar={navegar}
          onVerPerfilTutor={abrirPerfilTutor}
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
          tutor={tutorSeleccionado}
        />
      )}

      {/* SOLICITAR TUTORÍA */}
      {pantalla === 'Solicitar tutoría' && (
        <SolicitarTutoria
          onNavegar={navegar}
          tutor={tutorParaSolicitud}
        />
      )}
    </>
  );
}

export default App;
