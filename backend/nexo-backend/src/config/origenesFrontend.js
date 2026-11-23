const ORIGENES_LOCALES = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const origenesConfigurados = process.env.FRONTEND_ORIGINS
  ?.split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

export const ORIGENES_FRONTEND = origenesConfigurados?.length
  ? origenesConfigurados
  : process.env.NODE_ENV === 'production'
    ? []
    : ORIGENES_LOCALES;

export function origenFrontendPermitido(origen) {
  return Boolean(origen) && ORIGENES_FRONTEND.includes(origen);
}
