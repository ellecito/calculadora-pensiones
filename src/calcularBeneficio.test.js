import { describe, it, expect } from 'vitest';
import { calcularBeneficio } from './calcularBeneficio';

const SBM = 1_000_000;

describe('calcularBeneficio', () => {
  describe('Sin beneficio (grado < 15%)', () => {
    it('grado 0% → NINGUNO', () => {
      const r = calcularBeneficio(SBM, 0);
      expect(r.tipoBeneficio).toBe('NINGUNO');
      expect(r.monto).toBe(0);
      expect(r.periodicidad).toBeNull();
    });

    it('grado 14.99% → NINGUNO', () => {
      const r = calcularBeneficio(SBM, 14.99);
      expect(r.tipoBeneficio).toBe('NINGUNO');
      expect(r.monto).toBe(0);
      expect(r.periodicidad).toBeNull();
    });
  });

  describe('Indemnización global (15% ≤ grado < 40%)', () => {
    const casos = [
      { grado: 15.0, factor: 1.5 },
      { grado: 16.0, factor: 1.5 },
      { grado: 17.5, factor: 3.0 },
      { grado: 19.0, factor: 3.0 },
      { grado: 20.0, factor: 4.5 },
      { grado: 22.5, factor: 6.5 },
      { grado: 25.0, factor: 7.5 },
      { grado: 27.5, factor: 9.0 },
      { grado: 30.0, factor: 10.5 },
      { grado: 32.5, factor: 12.0 },
      { grado: 35.0, factor: 13.5 },
      { grado: 37.5, factor: 15.0 },
      { grado: 39.99, factor: 15.0 },
    ];

    it.each(casos)('grado $grado% → factor $factor', ({ grado, factor }) => {
      const r = calcularBeneficio(SBM, grado);
      expect(r.tipoBeneficio).toBe('INDEMNIZACION');
      expect(r.monto).toBe(SBM * factor);
      expect(r.periodicidad).toBe('UNICO');
    });
  });

  describe('Pensión parcial (40% ≤ grado < 70%)', () => {
    it('grado 40% → PENSION_PARCIAL, 30% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 40);
      expect(r.tipoBeneficio).toBe('PENSION_PARCIAL');
      expect(r.monto).toBe(SBM * 0.3);
      expect(r.periodicidad).toBe('MENSUAL');
    });

    it('grado 55% → PENSION_PARCIAL, 30% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 55);
      expect(r.tipoBeneficio).toBe('PENSION_PARCIAL');
      expect(r.monto).toBe(SBM * 0.3);
      expect(r.periodicidad).toBe('MENSUAL');
    });

    it('grado 69.99% → PENSION_PARCIAL, 30% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 69.99);
      expect(r.tipoBeneficio).toBe('PENSION_PARCIAL');
      expect(r.monto).toBe(SBM * 0.3);
      expect(r.periodicidad).toBe('MENSUAL');
    });
  });

  describe('Pensión total (grado ≥ 70%)', () => {
    it('grado 70% sin gran invalidez → 70% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 70);
      expect(r.tipoBeneficio).toBe('PENSION_TOTAL');
      expect(r.monto).toBe(SBM * 0.7);
      expect(r.periodicidad).toBe('MENSUAL');
    });

    it('grado 100% sin gran invalidez → 70% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 100);
      expect(r.tipoBeneficio).toBe('PENSION_TOTAL');
      expect(r.monto).toBe(SBM * 0.7);
      expect(r.periodicidad).toBe('MENSUAL');
    });

    it('grado 70% con gran invalidez → 100% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 70, { granInvalidez: true });
      expect(r.tipoBeneficio).toBe('PENSION_TOTAL');
      expect(r.monto).toBe(SBM * 1.0);
      expect(r.periodicidad).toBe('MENSUAL');
    });

    it('grado 85% con gran invalidez → 100% SBM mensual', () => {
      const r = calcularBeneficio(SBM, 85, { granInvalidez: true });
      expect(r.tipoBeneficio).toBe('PENSION_TOTAL');
      expect(r.monto).toBe(SBM * 1.0);
      expect(r.periodicidad).toBe('MENSUAL');
    });

    it('gran invalidez no afecta pensión parcial', () => {
      const r = calcularBeneficio(SBM, 55, { granInvalidez: true });
      expect(r.tipoBeneficio).toBe('PENSION_PARCIAL');
      expect(r.monto).toBe(SBM * 0.3);
    });
  });

  describe('Opciones por defecto', () => {
    it('sin pasar opciones, granInvalidez es false', () => {
      const r = calcularBeneficio(SBM, 70);
      expect(r.monto).toBe(SBM * 0.7);
    });
  });
});
