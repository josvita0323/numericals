import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen, Plus, Minus } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveCubicSpline } from '../../services/api';

const EXAMPLE = { x: [0, 1, 2, 3, 4], y: [0, 1, 4, 9, 16], target: 1.5 };

export default function CubicSplinePage() {
  const [points, setPoints] = useState(
    EXAMPLE.x.map((x, i) => ({ x: String(x), y: String(EXAMPLE.y[i]) }))
  );
  const [xTarget, setXTarget] = useState(String(EXAMPLE.target));
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setPoints(EXAMPLE.x.map((x, i) => ({ x: String(x), y: String(EXAMPLE.y[i]) })));
    setXTarget(String(EXAMPLE.target));
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveCubicSpline({
        x_data: points.map(p => parseFloat(p.x)),
        y_data: points.map(p => parseFloat(p.y)),
        x_target: parseFloat(xTarget),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Cubic Spline Interpolation" subtitle="Smooth piecewise cubic polynomial passing through all data points."
      module="Module II — Interpolation" moduleColor="text-purple-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>A <strong className="text-white">cubic spline</strong> fits a smooth cubic polynomial between each pair of adjacent data points. The natural spline ensures the second derivative is zero at both endpoints (M₀ = Mₙ = 0).</p>
          <div className="formula-box mt-3 space-y-1">
            <div>Sᵢ(x) = a + b(x−xᵢ) + c(x−xᵢ)² + d(x−xᵢ)³</div>
            <div>Conditions: C0, C1, C2 continuity at interior knots</div>
            <div>Natural: S''(x₀) = S''(xₙ) = 0</div>
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
          {points.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input type="number" placeholder={`x${i}`} value={p.x}
                onChange={e => { const ps = [...points]; ps[i] = { ...ps[i], x: e.target.value }; setPoints(ps); }}
                className="input-field w-24" />
              <input type="number" placeholder={`y${i}`} value={p.y}
                onChange={e => { const ps = [...points]; ps[i] = { ...ps[i], y: e.target.value }; setPoints(ps); }}
                className="input-field w-24" />
              {points.length > 3 && (
                <button onClick={() => setPoints(points.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-400">
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setPoints([...points, { x: '', y: '' }])}
            className="btn-secondary flex items-center gap-1.5 text-xs mt-2">
            <Plus size={12} /> Add Point
          </button>

          <div className="border-t border-dark-600 pt-4 mt-4">
            <label className="label">Target x (must be within data range)</label>
            <input type="number" value={xTarget} onChange={e => setXTarget(e.target.value)}
              className="input-field w-48" />
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
          {/* M values */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Second Derivative Values (Mᵢ)</span></div>
            <div className="p-4">
              <div className="flex gap-3 flex-wrap">
                {result.M_values.map((m: number, i: number) => (
                  <div key={i} className="bg-dark-700 rounded px-3 py-2 text-center">
                    <div className="text-xs text-slate-500">M{i}</div>
                    <div className="font-mono text-sm text-purple-300">{m.toFixed(6)}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Natural spline: M₀ = M{result.M_values.length-1} = 0</p>
            </div>
          </div>

          {/* Coefficients */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Spline Coefficients</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Interval</th>
                    <th>a</th>
                    <th>b</th>
                    <th>c</th>
                    <th>d</th>
                  </tr>
                </thead>
                <tbody>
                  {result.coefficients.map((c: any, i: number) => (
                    <tr key={i} className={i === result.segment_used ? 'bg-primary-900/20' : ''}>
                      <td className={i === result.segment_used ? 'text-primary-300' : ''}>{c.interval}</td>
                      <td>{c.a.toFixed(6)}</td>
                      <td>{c.b.toFixed(6)}</td>
                      <td>{c.c.toFixed(6)}</td>
                      <td>{c.d.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 px-4 pb-3">
              Highlighted row = segment used for interpolation at x = {result.x_target}
            </p>
          </div>

          <div className="result-box">
            <h3 className="text-lg font-bold text-white mb-2">✅ Interpolated Value</h3>
            <p className="text-3xl font-mono font-bold text-primary-400">
              S({result.x_target}) = {result.result.toFixed(8)}
            </p>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Spline Curve</span></div>
            <div className="p-6">
              <ChartView
                curve={result.curve}
                dataPoints={result.data_points}
                referenceX={result.x_target}
                referenceY={result.result}
                title="Natural cubic spline with original data points"
              />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
