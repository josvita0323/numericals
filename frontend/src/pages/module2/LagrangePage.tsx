import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen, Plus, Minus } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveLagrange } from '../../services/api';

const EXAMPLE = { x: [1, 2, 4, 5], y: [1, 4, 16, 25], target: 3 };

export default function LagrangePage() {
  const [points, setPoints] = useState(
    EXAMPLE.x.map((x, i) => ({ x: String(x), y: String(EXAMPLE.y[i]) }))
  );
  const [xTarget, setXTarget] = useState(String(EXAMPLE.target));
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addPoint = () => setPoints([...points, { x: '', y: '' }]);
  const removePoint = (i: number) => setPoints(points.filter((_, idx) => idx !== i));

  const loadExample = () => {
    setPoints(EXAMPLE.x.map((x, i) => ({ x: String(x), y: String(EXAMPLE.y[i]) })));
    setXTarget(String(EXAMPLE.target));
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveLagrange({
        x_data: points.map(p => parseFloat(p.x)),
        y_data: points.map(p => parseFloat(p.y)),
        x_target: parseFloat(xTarget),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Lagrange Interpolation" subtitle="Interpolate y at a new x value using weighted polynomial basis functions."
      module="Module II — Interpolation" moduleColor="text-purple-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>Given n data points (x₀,y₀), (x₁,y₁), …, (xₙ₋₁,yₙ₋₁), Lagrange interpolation constructs a unique polynomial of degree ≤ n−1 passing through all points.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>P(x) = Σ yᵢ · Lᵢ(x)</div>
            <div>Lᵢ(x) = Π (x − xⱼ)/(xᵢ − xⱼ) for j ≠ i</div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Data Points &amp; Target</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex gap-3 text-xs text-slate-500 mb-2 px-1">
              <span className="w-24">x value</span>
              <span className="w-24">y value</span>
            </div>
            {points.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input type="number" placeholder="x" value={p.x}
                  onChange={e => { const ps = [...points]; ps[i] = { ...ps[i], x: e.target.value }; setPoints(ps); }}
                  className="input-field w-24" />
                <input type="number" placeholder="y" value={p.y}
                  onChange={e => { const ps = [...points]; ps[i] = { ...ps[i], y: e.target.value }; setPoints(ps); }}
                  className="input-field w-24" />
                <button onClick={() => removePoint(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Minus size={14} />
                </button>
              </div>
            ))}
            <button onClick={addPoint} className="btn-secondary flex items-center gap-1.5 text-xs mt-2">
              <Plus size={12} /> Add Point
            </button>
          </div>
          <div className="border-t border-dark-600 pt-4 mt-4">
            <label className="label">Target x value (interpolate at x = ?)</label>
            <input type="number" value={xTarget} onChange={e => setXTarget(e.target.value)}
              className="input-field w-48" placeholder="e.g. 3.0" />
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
          {/* Basis terms */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Lagrange Basis Terms</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Numerator</th>
                    <th>Denominator</th>
                    <th>Lᵢ(x*)</th>
                    <th>yᵢ</th>
                    <th>yᵢ · Lᵢ(x*)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.basis_terms.map((t: any) => (
                    <tr key={t.index}>
                      <td className="text-purple-300 font-medium">L{t.index}(x)</td>
                      <td className="text-xs">{t.numerator}</td>
                      <td className="text-xs">{t.denominator}</td>
                      <td>{t.value_at_target.toFixed(6)}</td>
                      <td>{t.y_i}</td>
                      <td className="text-primary-300">{t.contribution.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Result */}
          <div className="result-box">
            <h3 className="text-lg font-bold text-white mb-2">✅ Interpolated Value</h3>
            <p className="text-3xl font-mono font-bold text-primary-400">
              P({result.x_target}) = {result.result.toFixed(8)}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Sum = {result.contributions.map((c: number) => c.toFixed(4)).join(' + ')} = {result.result.toFixed(6)}
            </p>
          </div>

          {/* Chart */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Visualization</span></div>
            <div className="p-6">
              <ChartView
                curve={result.curve}
                dataPoints={result.data_points}
                title="Lagrange interpolation curve with original data points"
                referenceX={result.x_target}
                referenceY={result.result}
              />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
