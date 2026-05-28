# Calculadora de Indemnizaciones ACHS

## Contexto del negocio

Aplicación React para ACHS (Asociación Chilena de Seguridad) que calcula beneficios económicos por incapacidad permanente derivada de accidentes laborales o enfermedades profesionales.

Las dos variables de entrada son el **Sueldo Base Mensual (SBM)** y el **grado de incapacidad (%)**.

### Reglas de negocio

| Grado | Tipo | Monto | Periodicidad |
|---|---|---|---|
| < 15% | NINGUNO | 0 | — |
| 15% – <40% | INDEMNIZACION | SBM × factor | UNICO |
| 40% – <70% | PENSION_PARCIAL | SBM × 0.30 | MENSUAL |
| ≥ 70% | PENSION_TOTAL | SBM × 0.70 | MENSUAL |

**Gran Invalidez:** si `opciones.granInvalidez = true`, se suma SBM × 0.30 al monto de PENSION_TOTAL (total: SBM × 1.00).

La tabla de factores para INDEMNIZACION tiene 10 tramos entre 15% y <40%, con factores de 1.5 a 15.0 (ver `src/calcularBeneficio.js`).

## Arquitectura

```
src/
├── calcularBeneficio.js       # Lógica de negocio — función principal
├── calcularBeneficio.test.js  # 24 pruebas unitarias (Vitest)
├── App.jsx                    # UI de la calculadora
├── App.css                    # Estilos
├── setupTests.js              # Setup de Vitest + jest-dom
└── main.jsx                   # Punto de entrada
```

### Función principal

```js
calcularBeneficio(sbm, grado, opciones)
// Retorna: { tipoBeneficio, monto, periodicidad }
```

Cualquier extensión de reglas de negocio debe hacerse en `calcularBeneficio.js` y cubrirse con nuevos tests en `calcularBeneficio.test.js`.

## Comandos

```bash
npm run dev          # Servidor de desarrollo en http://localhost:5173
npm run dev -- --host  # Expuesto en red local
npm test             # Pruebas unitarias (24 tests)
npm run test:watch   # Modo observador
npm run test:coverage  # Reporte de cobertura
npm run build        # Build de producción → dist/
```

## Estado actual

- 24/24 tests pasando
- Build de producción limpio
