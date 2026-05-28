const FACTORES_INDEMNIZACION = [
  { desde: 15.0, hasta: 17.5, factor: 1.5 },
  { desde: 17.5, hasta: 20.0, factor: 3.0 },
  { desde: 20.0, hasta: 22.5, factor: 4.5 },
  { desde: 22.5, hasta: 25.0, factor: 6.5 },
  { desde: 25.0, hasta: 27.5, factor: 7.5 },
  { desde: 27.5, hasta: 30.0, factor: 9.0 },
  { desde: 30.0, hasta: 32.5, factor: 10.5 },
  { desde: 32.5, hasta: 35.0, factor: 12.0 },
  { desde: 35.0, hasta: 37.5, factor: 13.5 },
  { desde: 37.5, hasta: 40.0, factor: 15.0 },
];

function obtenerFactorIndemnizacion(grado) {
  const tramo = FACTORES_INDEMNIZACION.find(
    ({ desde, hasta }) => grado >= desde && grado < hasta
  );
  return tramo ? tramo.factor : null;
}

/**
 * @param {number} sbm - Sueldo Base Mensual del trabajador
 * @param {number} grado - Grado de discapacidad (%)
 * @param {{ granInvalidez?: boolean }} opciones
 * @returns {{ tipoBeneficio: 'INDEMNIZACION'|'PENSION_PARCIAL'|'PENSION_TOTAL'|'NINGUNO', monto: number, periodicidad: 'UNICO'|'MENSUAL'|null }}
 */
export function calcularBeneficio(sbm, grado, opciones = {}) {
  const { granInvalidez = false } = opciones;

  if (grado < 15) {
    return { tipoBeneficio: 'NINGUNO', monto: 0, periodicidad: null };
  }

  if (grado < 40) {
    const factor = obtenerFactorIndemnizacion(grado);
    return {
      tipoBeneficio: 'INDEMNIZACION',
      monto: sbm * factor,
      periodicidad: 'UNICO',
    };
  }

  if (grado < 70) {
    return {
      tipoBeneficio: 'PENSION_PARCIAL',
      monto: sbm * 0.3,
      periodicidad: 'MENSUAL',
    };
  }

  const montoBase = sbm * 0.7;
  const suplemento = granInvalidez ? sbm * 0.3 : 0;
  return {
    tipoBeneficio: 'PENSION_TOTAL',
    monto: montoBase + suplemento,
    periodicidad: 'MENSUAL',
  };
}
