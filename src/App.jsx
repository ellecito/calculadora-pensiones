import { useState } from 'react';
import { calcularBeneficio } from './calcularBeneficio';
import './App.css';

const TIPO_LABEL = {
  NINGUNO: 'Sin Beneficio',
  INDEMNIZACION: 'Indemnización Global',
  PENSION_PARCIAL: 'Pensión de Invalidez Parcial',
  PENSION_TOTAL: 'Pensión de Invalidez Total',
};

const PERIODICIDAD_LABEL = {
  UNICO: 'Pago único',
  MENSUAL: 'Mensual',
};

function formatCLP(valor) {
  return valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

export default function App() {
  const [sbm, setSbm] = useState('');
  const [grado, setGrado] = useState('');
  const [granInvalidez, setGranInvalidez] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  function calcular(e) {
    e.preventDefault();
    setError('');
    setResultado(null);

    const sbmNum = parseFloat(sbm);
    const gradoNum = parseFloat(grado);

    if (isNaN(sbmNum) || sbmNum <= 0) {
      setError('El SBM debe ser un número mayor a 0.');
      return;
    }
    if (isNaN(gradoNum) || gradoNum < 0 || gradoNum > 100) {
      setError('El grado de discapacidad debe estar entre 0 y 100.');
      return;
    }

    setResultado(calcularBeneficio(sbmNum, gradoNum, { granInvalidez }));
  }

  function limpiar() {
    setSbm('');
    setGrado('');
    setGranInvalidez(false);
    setResultado(null);
    setError('');
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">ACHS</div>
        <div>
          <h1>Calculadora de Indemnizaciones</h1>
          <p>Beneficios económicos por incapacidad permanente</p>
        </div>
      </header>

      <main className="main">
        <form className="card form-card" onSubmit={calcular}>
          <h2>Datos del Trabajador</h2>

          <div className="field">
            <label htmlFor="sbm">Sueldo Base Mensual (SBM)</label>
            <div className="input-prefix">
              <span>$</span>
              <input
                id="sbm"
                type="number"
                min="1"
                step="1"
                placeholder="Ej: 800000"
                value={sbm}
                onChange={(e) => setSbm(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="grado">Grado de Discapacidad (%)</label>
            <div className="input-suffix">
              <input
                id="grado"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="Ej: 35"
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                required
              />
              <span>%</span>
            </div>
          </div>

          <div className="field field-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={granInvalidez}
                onChange={(e) => setGranInvalidez(e.target.checked)}
              />
              <span>Gran Invalidez (requiere auxilio de terceros)</span>
            </label>
            <p className="field-hint">
              Aplica suplemento del 30% SBM sobre pensión total.
            </p>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Calcular
            </button>
            <button type="button" className="btn btn-secondary" onClick={limpiar}>
              Limpiar
            </button>
          </div>
        </form>

        {resultado && (
          <div className={`card result-card result-${resultado.tipoBeneficio.toLowerCase()}`}>
            <h2>Resultado del Cálculo</h2>

            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Tipo de Beneficio</span>
                <span className="result-value tipo">
                  {TIPO_LABEL[resultado.tipoBeneficio]}
                </span>
              </div>

              {resultado.tipoBeneficio !== 'NINGUNO' && (
                <>
                  <div className="result-item">
                    <span className="result-label">Monto</span>
                    <span className="result-value monto">
                      {formatCLP(resultado.monto)}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Periodicidad</span>
                    <span className="result-value">
                      {PERIODICIDAD_LABEL[resultado.periodicidad]}
                    </span>
                  </div>
                </>
              )}

              {resultado.tipoBeneficio === 'NINGUNO' && (
                <p className="no-benefit">
                  El grado de discapacidad ingresado es inferior al 15%, por lo que
                  no corresponde pago de beneficio económico.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="card info-card">
          <h3>Tabla de Referencia</h3>
          <table>
            <thead>
              <tr>
                <th>Grado de Discapacidad</th>
                <th>Tipo de Beneficio</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Menor a 15%</td>
                <td>Sin beneficio</td>
                <td>—</td>
              </tr>
              <tr>
                <td>15% a &lt;40%</td>
                <td>Indemnización Global</td>
                <td>SBM × Factor (1.5 – 15)</td>
              </tr>
              <tr>
                <td>40% a &lt;70%</td>
                <td>Pensión Parcial</td>
                <td>30% del SBM / mes</td>
              </tr>
              <tr>
                <td>70% o más</td>
                <td>Pensión Total</td>
                <td>70% del SBM / mes (+30% si Gran Invalidez)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
