// Formato de 24 horas: "08:00", "14:30".
// Al tener siempre dos dígitos, las horas se pueden comparar como texto ("09:00" < "14:30").
export const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export function esHoraValida(hora) {
  return typeof hora === 'string' && FORMATO_HORA.test(hora);
}
