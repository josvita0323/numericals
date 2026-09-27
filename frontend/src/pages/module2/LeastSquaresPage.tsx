import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen, Plus, Minus } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveLeastSquares } from '../../services/api';

const EXAMPLE = {
  x: [1, 2, 3, 4, 5, 6],
  y: [2.1, 3.9, 6.2, 7.8, 10.1, 12.0],
};

export default function LeastSquaresPage() {
  const [points, setPoints] = useState(
    EXAMPLE.x.map((x, i) => ({ x: String(x), y: String(EXAMPLE.y[i]) }))
  );
  const [degree, setDegree] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setPoints(EXAMPLE.x.map((x, i) => ({ x: String(x), y: String(EXAMPLE.y[i]) })));
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveLeastSquares({
        x_data: points.map(p => parseFloat(p.x)),
        y_data: points.map(p => parseFloat(p.y)),
        degree,
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Least Squares Curve Fitting" subtitle="Find the best-fit polynomial through a set of data points."
      module="Module II — Interpolation" moduleColor="text-purple-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>Least squares fitting finds the polynomial coefficients that <strong className="text-white">minimize the sum of squared residuals</strong> (the differences between actual and predicted y values).</p>
          <div className="formula-box mt-3 space-y-1">
            <div>Linear: y = a + bx</div>
            <div>Quadratic: y = a + bx + cx²</div>
            <div>Normal equations: AᵀA · c = Aᵀb → solve for coefficients</div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Input</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Data Points (x, y)</label>
              {points.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="number" value={p.x}
                    onChange={e => { const ps = [...points]; ps[i] = { ...ps[i], x: e.target.value }; setPoints(ps); }}
                    className="input-field w-20" placeholder="x" />
                  <input type="number" value={p.y}
                    onChange={e => { const ps = [...points]; ps[i] = { ...ps[i], y: e.target.value }; setPoints(ps); }}
                    className="input-field w-20" placeholder="y" />
                  {points.length > 3 && (
                    <button onClick={() => setPoints(points.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400">
                      <Minus size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => setPoints([...points, { x: '', y: '' }])}
                className="btn-secondary flex items-center gap-1.5 text-xs mt-1">
                <Plus size={12} /> Add Point
              </button>
            </div>
            <div>
              <label className="label">Polynomial Degree</label>
              <div className="flex gap-2">
                {[1, 2].map(d => (
                  <button key={d} onClick={() => setDegree(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      degree === d ? 'bg-primary-600 text-white' : 'bg-dark-600 text-slate-400 hover:text-white'
                    }`}>
                    {d === 1 ? 'Linear (y = a + bx)' : 'Quadratic (y = a + bx + cx²)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleCalculate} disabled={loading} className="btn-primary flex items-center gap-2 mt-6">
            <Play size={16} /> Calculate
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <Alert type="error" message={error} />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Normal Equations */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Normal Equations</span></div>
            <div className="p-4 space-y-2">
              {result.normal_equations.map((eq: string, i: number) => (
                <div key={i} className="formula-box text-xs">{eq}</div>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="result-box">
            <h3 className="text-lg font-bold text-white mb-3">✅ Fitted Equation</h3>
            <div className="formula-box text-base mb-4 text-emerald-300">{result.equation}</div>
            <div className="flex gap-4">
              <div className="bg-dark-700 rounded-lg px-4 py-2">
                <div className="text-xs text-slate-500">R²</div>
                <div className="font-mono font-bold text-white">{result.r_squared.toFixed(6)}</div>
              </div>
              <div className="bg-dark-700 rounded-lg px-4 py-2">
                <div className="text-xs text-slate-500">SSE</div>
                <div className="font-mono font-bold text-white">{result.sse.toFixed(6)}</div>
              </div>
            </div>
          </div>

          {/* Fitted values table */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Fitted Values & Residuals</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>x</th>
                    <th>y (actual)</th>
                    <th>y (fitted)</th>
                    <th>Residual</th>
                  </tr>
                </thead>
                <tbody>
                  {result.fitted_values.map((row: any, i: number) => (
                    <tr key={i}>
                      <td>{row.x}</td>
                      <td>{row.y_actual}</td>
                      <td className="text-purple-300">{row.y_fitted.toFixed(6)}</td>
                      <td className={Math.abs(row.residual) < 0.1 ? 'text-emerald-400' : 'text-amber-400'}>
                        {row.residual.toFixed(6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Visualization</span></div>
            <div className="p-6">
              <ChartView
                dataPoints={result.data_points}
                fittedCurve={result.curve}
                title={`Least squares ${result.degree === 1 ? 'linear' : 'quadratic'} fit`}
              />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
