import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveModifiedEuler } from '../../services/api';

export default function ModifiedEulerPage() {
  const [func, setFunc] = useState('y');
  const [x0, setX0] = useState('0');
  const [y0, setY0] = useState('1');
  const [h, setH] = useState('0.1');
  const [xEnd, setXEnd] = useState('1.0');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setFunc('y'); setX0('0'); setY0('1'); setH('0.1'); setXEnd('1.0');
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveModifiedEuler({
        func_str: func, x0: parseFloat(x0), y0: parseFloat(y0),
        h: parseFloat(h), x_end: parseFloat(xEnd),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Modified Euler's Method" subtitle="Predictor-corrector method (Heun's method) — more accurate than simple Euler."
      module="Module IV — ODE" moduleColor="text-amber-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>Modified Euler uses a two-step predictor-corrector approach:</p>
          <div className="formula-box mt-3 space-y-2">
            <div className="text-amber-300 font-medium">Step 1 — Predictor (Euler step):</div>
            <div>{"y*_{n+1} = y_n + h · f(x_n, y_n)"}</div>
            <div className="text-amber-300 font-medium mt-2">Step 2 — Corrector (average of slopes):</div>
            <div>{"y_{n+1} = y_n + (h/2) · [f(x_n, y_n) + f(x_{n+1}, y*_{n+1})]"}</div>
          </div>
          <p className="text-xs text-slate-500">Accuracy: O(h²) — better than plain Euler O(h).</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Input</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="label">dy/dx = f(x, y)</label>
            <input value={func} onChange={e => setFunc(e.target.value)} className="input-field"
              placeholder="e.g. y, x + y" />
          </div>
          <div><label className="label">x₀</label>
            <input type="number" value={x0} onChange={e => setX0(e.target.value)} className="input-field" /></div>
          <div><label className="label">y₀</label>
            <input type="number" value={y0} onChange={e => setY0(e.target.value)} className="input-field" /></div>
          <div><label className="label">Step h</label>
            <input type="number" value={h} step="0.01" onChange={e => setH(e.target.value)} className="input-field" /></div>
          <div><label className="label">Final x</label>
            <input type="number" value={xEnd} onChange={e => setXEnd(e.target.value)} className="input-field" /></div>
          <div className="md:col-span-2 flex items-end">
            <button onClick={handleCalculate} disabled={loading} className="btn-primary flex items-center gap-2">
              <Play size={16} /> Calculate
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <Alert type="error" message={error} />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="card">
            <div className="card-header"><span className="font-semibold">Predictor-Corrector Table</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>n</th>
                    <th>xₙ</th>
                    <th>yₙ</th>
                    <th>f(xₙ,yₙ)</th>
                    <th>Predictor y*</th>
                    <th>Corrected y</th>
                  </tr>
                </thead>
                <tbody>
                  {result.iterations.slice(0, -1).map((it: any) => (
                    <tr key={it.n}>
                      <td className="text-center">{it.n}</td>
                      <td>{it.x_n.toFixed(6)}</td>
                      <td>{it.y_n.toFixed(8)}</td>
                      <td>{it.f_xn_yn?.toFixed(8)}</td>
                      <td className="text-amber-300">{it.y_predictor?.toFixed(8)}</td>
                      <td className="text-emerald-300 font-medium">{it.y_corrected?.toFixed(8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-box">
            <h3 className="text-lg font-bold text-white mb-2">✅ Final Result</h3>
            <p className="text-3xl font-mono font-bold text-amber-400">
              y({result.final_x}) ≈ {result.final_y.toFixed(8)}
            </p>
            <p className="text-sm text-slate-400 mt-2">Accuracy: O(h²) — Modified Euler is more accurate than Euler O(h)</p>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Solution Curve</span></div>
            <div className="p-6">
              <ChartView curve={result.curve} xLabel="x" yLabel="y" title={`dy/dx = ${result.function}`} />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
