# Calculadora de Indemnizaciones ACHS

Aplicación web para el cálculo de beneficios económicos por incapacidad permanente derivada de accidentes laborales o enfermedades profesionales, según la normativa de la Asociación Chilena de Seguridad (ACHS).

## Contexto del negocio

La ACHS otorga beneficios económicos a trabajadores que sufren una incapacidad permanente como consecuencia de un accidente laboral o enfermedad profesional. El tipo de beneficio y su monto dependen del **Sueldo Base Mensual (SBM)**, el **grado de incapacidad (%)** y las opciones del trabajador.

### Reglas de negocio

| Grado de incapacidad | Tipo de beneficio | Monto base | Tope | Periodicidad |
|---|---|---|---|---|
| Menor a 15% | Sin beneficio | — | — | — |
| 15% a \<40% | Indemnización Global | SBM × factor (ver tabla) | — | Pago único |
| 40% a \<70% | Pensión de Invalidez Parcial | 35% del SBM | 50% del SBM | Mensual |
| 70% o más | Pensión de Invalidez Total | 70% del SBM | 100% del SBM | Mensual |

> **Gran Invalidez:** cuando el trabajador requiere auxilio permanente de terceras personas, se suma un 30% adicional del SBM a la Pensión de Invalidez Total. El tope con gran invalidez es el 140% del SBM.

> **Incremento por hijo:** las pensiones se incrementan en un 5% del SBM por cada hijo a partir del tercero que cause asignación familiar. Los topes aplican después del incremento.

### Tabla de factores — Indemnización Global

| Grado | Factor |
|---|---|
| 15.0% a \<17.5% | 1.5 |
| 17.5% a \<20.0% | 3.0 |
| 20.0% a \<22.5% | 4.5 |
| 22.5% a \<25.0% | 6.0 |
| 25.0% a \<27.5% | 7.5 |
| 27.5% a \<30.0% | 9.0 |
| 30.0% a \<32.5% | 10.5 |
| 32.5% a \<35.0% | 12.0 |
| 35.0% a \<37.5% | 13.5 |
| 37.5% a \<40.0% | 15.0 |

---

## Tecnologías

- [React 19](https://react.dev/) con [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/) para pruebas unitarias

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

## Instalación y ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

### 3. Ejecutar las pruebas unitarias

```bash
npm test
```

Para modo observador (re-ejecuta al guardar cambios):

```bash
npm run test:watch
```

Para ver el reporte de cobertura:

```bash
npm run test:coverage
```

### 4. Generar build de producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `dist/`.

---

## Estructura del proyecto

```
src/
├── calcularBeneficio.js       # Función principal de cálculo con las reglas de negocio
├── calcularBeneficio.test.js  # Pruebas unitarias (39 casos)
├── App.jsx                    # Componente principal de la interfaz
├── App.css                    # Estilos
└── main.jsx                   # Punto de entrada de la aplicación
```

### Función `calcularBeneficio`

```js
calcularBeneficio(sbm, grado, opciones)
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `sbm` | `number` | Sueldo Base Mensual del trabajador |
| `grado` | `number` | Grado de incapacidad en porcentaje (0–100) |
| `opciones.granInvalidez` | `boolean` | Indica si el trabajador requiere auxilio de terceros |
| `opciones.numHijos` | `number` | Número de hijos que causan asignación familiar |

**Retorna:**

```js
{
  tipoBeneficio: 'NINGUNO' | 'INDEMNIZACION' | 'PENSION_PARCIAL' | 'PENSION_TOTAL',
  monto: number,
  periodicidad: 'UNICO' | 'MENSUAL' | null
}
```
