import { DIAS_SEMANA } from '../models/Disponibilidad.js';

// Todas las horas del sistema son de Colombia (UTC-5, sin horario de verano)
const ZONA_COLOMBIA = '-05:00';
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Convierte "2026-11-24" en una fecha guardable (medianoche UTC de ese día).
 * Devuelve null si el texto no tiene el formato AAAA-MM-DD o el día no existe (ej. 2026-02-30).
 */
export function parsearFecha(texto) {
  if (typeof texto !== 'string' || !FORMATO_FECHA.test(texto)) return null;

  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && aTextoFecha(fecha) === texto ? fecha : null;
}

/** Date guardada -> "2026-11-24" */
export function aTextoFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

/** Día de la semana ("lunes"...) de una fecha guardada */
export function diaSemanaDe(fecha) {
  // getUTCDay: 0 = domingo. DIAS_SEMANA empieza en lunes.
  return DIAS_SEMANA[(fecha.getUTCDay() + 6) % 7];
}

/** Fecha de hoy en Colombia, como fecha guardable */
export function hoyEnColombia() {
  const ahoraEnColombia = new Date(Date.now() - 5 * 60 * 60 * 1000);
  return parsearFecha(ahoraEnColombia.toISOString().slice(0, 10));
}

/** Momento exacto (hora de Colombia) en que empieza un día a cierta hora */
export function momentoEnColombia(fecha, hora) {
  return new Date(`${aTextoFecha(fecha)}T${hora}:00${ZONA_COLOMBIA}`);
}
