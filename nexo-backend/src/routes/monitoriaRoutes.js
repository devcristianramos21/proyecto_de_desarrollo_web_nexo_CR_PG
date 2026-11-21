import { Router } from 'express';
import * as c from '../controllers/monitoriaController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { permitir } from '../middlewares/permitir.js';

const router = Router();

router.use(autenticar);

// Consultas (las rutas fijas van antes de /:id)
router.get('/', permitir('admin'), c.listarTodas);
router.get('/disponibles', c.listarDisponibles);
router.get('/mis-tutorias', permitir('estudiante'), c.listarMisTutorias);
router.get('/como-tutor', permitir('tutor'), c.listarComoTutor);

// Crear
router.post('/par', permitir('estudiante'), c.solicitarPar);
router.post('/grupales', permitir('admin'), c.crearGrupal);

router.get('/:id', c.verMonitoria);
router.put('/:id', permitir('admin'), c.actualizarGrupal);

// Respuesta del tutor a una solicitud par
router.patch('/:id/aceptar', permitir('tutor'), c.aceptarSolicitud);
router.patch('/:id/rechazar', permitir('tutor'), c.rechazarSolicitud);

// Cancelar (participantes o admin; el service decide) y finalizar (tutor o admin)
router.patch('/:id/cancelar', c.cancelarMonitoria);
router.patch('/:id/finalizar', permitir('tutor', 'admin'), c.finalizarMonitoria);

// Inscripción del estudiante (preparcial y Saber Pro) y cambio de grupo (obligatoria)
router.post('/:id/inscripcion', permitir('estudiante'), c.inscribirse);
router.delete('/:id/inscripcion', permitir('estudiante'), c.cancelarInscripcion);
router.post('/:id/cambio-grupo', permitir('estudiante'), c.cambiarGrupo);

// Asignación de estudiantes por el administrador
router.post('/:id/estudiantes', permitir('admin'), c.agregarEstudiantes);
router.delete('/:id/estudiantes/:estudianteId', permitir('admin'), c.quitarEstudiante);

export default router;
