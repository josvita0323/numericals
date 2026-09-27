import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { solveHeatEquation } from '../../services/api';

const COLORS = ['#3b82f6','#a78bfa','#34d399','#f59e0b','#f87171','#60a5fa','#fb923c','#4ade80','#e879f9','#38bdf8'];

export default function HeatEquationPage() {
  const [length, setLength] = useState('1.0');
  const [alpha, setAlpha] = useState('0.01');
  const [dx, setDx] = useState('0.1');
  const [dt, setDt] = useState('0.4');
  const [tEnd, setTEnd] = useState('2.0');
  const [initTemp, setInitTemp] = useState('100');
  const [leftTemp, setLeftTemp] = useState('0');
  const [rightTemp, setRightTemp] = useState('0');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setLength('1.0'); setAlpha('0.01'); setDx('0.1'); setDt('0.4'); setTEnd('2.0');
    setInitTemp('100'); setLeftTemp('0'); setRightTemp('0');
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveHeatEquation({
        length: parseFloat(length), alpha: parseFloat(alpha),
        dx: parseFloat(dx), dt: parseFloat(dt), t_end: parseFloat(tEnd),
        initial_temp: parseFloat(initTemp),
        left_temp: parseFloat(leftTemp), right_temp: parseFloat(rightTemp),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  // Build recharts data: one entry per x, with temp at each snapshot time
  const buildChartData = (res: any) => {
    if (!res?.snapshots || !res?.x_vals) return [];
    return res.x_vals.map((xv: number, xi: number) => {
      const pt: any = { x: xv };
      res.snapshots.forEach((snap: any) => {
        pt[`t=${snap.time.toFixed(3)}`] = snap.temperatures[xi];
      });
      return pt;
    });
  };

  return (
    <MethodLayout title="1D Heat Equation" subtitle="Explicit finite-difference solution of ∂u/∂t = α ∂²u/∂x²"
      module="Module V — BVP & PDE" moduleColor="text-rose-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>The 1D heat equation models temperature distribution in a rod over time. The explicit method is simple but has a <strong className="text-rose-400">stability constraint</strong>.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>∂u/∂t = α · ∂²u/∂x²</div>
            <div>Explicit scheme: u[i,n+1] = u[i,n] + r·(u[i+1,n] − 2u[i,n] + u[i-1,n])</div>
            <div>r = αΔt/(Δx)² — must satisfy r ≤ 0.5 for stability!</div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Input Parameters</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="label">Rod Length (L)</label>
            <input type="number" value={length} onChange={e => setLength(e.target.value)} className="input-field" /></div>
          <div><label className="label">Thermal diffusivity (α)</label>
            <input type="number" value={alpha} step="0.001" onChange={e => setAlpha(e.target.value)} className="input-field" /></div>
          <div><label className="label">Spatial step (Δx)</label>
            <input type="number" value={dx} step="0.01" onChange={e => setDx(e.target.value)} className="input-field" /></div>
          <div><label className="label">Time step (Δt)</label>
            <input type="number" value={dt} step="0.01" onChange={e => setDt(e.target.value)} className="input-field" /></div>
          <div><label className="label">End time (t_end)</label>
            <input type="number" value={tEnd} onChange={e => setTEnd(e.target.value)} className="input-field" /></div>
          <div><label className="label">Initial temperature</label>
            <input type="number" value={initTemp} onChange={e => setInitTemp(e.target.value)} className="input-field" /></div>
          <div><label className="label">Left BC (u(0,t))</label>
            <input type="number" value={leftTemp} onChange={e => setLeftTemp(e.target.value)} className="input-field" /></div>
          <div><label className="label">Right BC (u(L,t))</label>
            <input type="number" value={rightTemp} onChange={e => setRightTemp(e.target.value)} className="input-field" /></div>
          <div className="md:col-span-4">
            {/* Stability preview */}
            {dx && dt && alpha && (
              <div className="text-xs text-slate-500 mb-3">
                r = α·Δt/Δx² = {(parseFloat(alpha) * parseFloat(dt) / Math.pow(parseFloat(dx), 2)).toFixed(4)}
                {' '}
                {(parseFloat(alpha) * parseFloat(dt) / Math.pow(parseFloat(dx), 2)) > 0.5
                  ? <span className="text-red-400 ml-1">⚠ r &gt; 0.5 — unstable!</span>
                  : <span className="text-emerald-400 ml-1">✓ Stable</span>
                }
              </div>
            )}
            <button onClick={handleCalculate} disabled={loading} className="btn-primary flex items-center gap-2">
              <Play size={16} /> Solve
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Computing time steps..." />}
      {error && <Alert type="error" message={error} />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Stability */}
          <div className={`rounded-lg px-4 py-3 border text-sm font-mono flex items-center gap-3 ${
            result.stability_satisfied
              ? 'bg-emerald-900/20 border-emerald-700/40 text-emerald-300'
              : 'bg-red-900/20 border-red-700/40 text-red-300'
          }`}>
            {result.stability_satisfied ? '✓' : <AlertTriangle size={16} />}
            Stability condition: r = {result.r} {result.stability_satisfied ? '≤' : '>'} 0.5
            {result.stability_warning && <span className="ml-2 font-sans text-xs">{result.stability_warning}</span>}
          </div>

          {/* Snapshots table */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Temperature Snapshots</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>t</th>
                    {result.x_vals.map((xv: number) => (
                      <th key={xv}>x={xv.toFixed(2)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.snapshots.map((snap: any) => (
                    <tr key={snap.time}>
                      <td className="text-amber-300">{snap.time.toFixed(3)}</td>
                      {snap.temperatures.map((t: number, i: number) => (
                        <td key={i}>{t.toFixed(2)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Temperature Distribution Over Time</span></div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={buildChartData(result)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#253048" />
                  <XAxis dataKey="x" tick={{ fill: '#94a3b8', fontSize: 11 }}
                    label={{ value: 'x (position)', position: 'insideBottom', fill: '#64748b', dy: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
                    label={{ value: 'u (temp)', angle: -90, fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e2640', border: '1px solid #3d4e72', fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {result.snapshots.map((snap: any, i: number) => (
                    <Line
                      key={snap.time}
                      dataKey={`t=${snap.time.toFixed(3)}`}
                      stroke={COLORS[i % COLORS.length]}
                      dot={false}
                      strokeWidth={1.5}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
