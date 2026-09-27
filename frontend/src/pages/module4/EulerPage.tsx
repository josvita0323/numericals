import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveEuler } from '../../services/api';

export default function EulerPage() {
  const [func, setFunc] = useState('x + y');
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
      const res: any = await solveEuler({
        func_str: func, x0: parseFloat(x0), y0: parseFloat(y0),
        h: parseFloat(h), x_end: parseFloat(xEnd),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Euler's Method" subtitle="Simple first-order ODE solver using forward differences."
      module="Module IV — ODE" moduleColor="text-amber-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>Euler's method solves dy/dx = f(x,y) numerically. Starting from (x₀, y₀), it takes small steps of size h, computing the next y-value using the tangent slope at the current point.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>{"y_{n+1} = y_n + h · f(x_n, y_n)"}</div>
            <div>{"x_{n+1} = x_n + h"}</div>
          </div>
          <p className="text-xs text-slate-500">Note: Accuracy is O(h). Use smaller h for better results.</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Input</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example (dy/dx = y)
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="label">dy/dx = f(x, y)</label>
            <input value={func} onChange={e => setFunc(e.target.value)} className="input-field"
              placeholder="e.g. x + y, -y, x*y" />
            <p className="text-xs text-slate-600 mt-1">Use x and y as variable names.</p>
          </div>
          <div>
            <label className="label">x₀ (initial x)</label>
            <input type="number" value={x0} onChange={e => setX0(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">y₀ (initial y)</label>
            <input type="number" value={y0} onChange={e => setY0(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Step size h</label>
            <input type="number" value={h} step="0.01" onChange={e => setH(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Final x</label>
            <input type="number" value={xEnd} onChange={e => setXEnd(e.target.value)} className="input-field" />
          </div>
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
            <div className="card-header"><span className="font-semibold">Iteration Table</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>n</th>
                    <th>xₙ</th>
                    <th>yₙ</th>
                    <th>f(xₙ, yₙ)</th>
                    <th>yₙ₊₁</th>
                  </tr>
                </thead>
                <tbody>
                  {result.iterations.slice(0, -1).map((it: any) => (
                    <tr key={it.n}>
                      <td className="text-center">{it.n}</td>
                      <td>{it.x_n.toFixed(6)}</td>
                      <td>{it.y_n.toFixed(8)}</td>
                      <td className="text-amber-300">{it.f_xn_yn.toFixed(8)}</td>
                      <td className="text-primary-300 font-medium">{it.y_next.toFixed(8)}</td>
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
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Numerical Solution Curve</span></div>
            <div className="p-6">
              <ChartView curve={result.curve} xLabel="x" yLabel="y" title={`dy/dx = ${result.function}`} />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
