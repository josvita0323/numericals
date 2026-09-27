import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { solveLaplace } from '../../services/api';

// Simple heatmap display using CSS grid
function HeatmapGrid({ grid, uMin, uMax }: { grid: number[][], uMin: number, uMax: number }) {
  const ny = grid.length;
  const nx = grid[0]?.length ?? 0;
  if (!ny || !nx) return null;
  const range = uMax - uMin || 1;

  const getColor = (val: number) => {
    const t = (val - uMin) / range;
    const r = Math.round(255 * Math.min(1, 2 * t));
    const b = Math.round(255 * Math.min(1, 2 * (1 - t)));
    const g = Math.round(255 * (1 - Math.abs(2 * t - 1)));
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="overflow-auto">
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${nx}, minmax(0, 1fr))`,
        gap: '1px',
        maxWidth: '100%'
      }}>
        {[...grid].reverse().map((row, ri) =>
          row.map((val, ci) => (
            <div
              key={`${ri}-${ci}`}
              title={`(${ci}, ${ny-1-ri}): ${val.toFixed(2)}`}
              style={{
                backgroundColor: getColor(val),
                width: '100%',
                paddingBottom: '100%',
                position: 'relative'
              }}
            />
          ))
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-slate-500">{uMin.toFixed(1)}</span>
        <div className="flex-1 h-2 rounded" style={{
          background: 'linear-gradient(to right, rgb(0,0,255), rgb(0,255,0), rgb(255,0,0))'
        }} />
        <span className="text-xs text-slate-500">{uMax.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function LaplacePage() {
  const [nx, setNx] = useState('10');
  const [ny, setNy] = useState('10');
  const [top, setTop] = useState('100');
  const [bottom, setBottom] = useState('0');
  const [left, setLeft] = useState('0');
  const [right, setRight] = useState('0');
  const [tol, setTol] = useState('1e-4');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setNx('12'); setNy('12'); setTop('100'); setBottom('0'); setLeft('0'); setRight('0');
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveLaplace({
        nx: parseInt(nx), ny: parseInt(ny),
        top: parseFloat(top), bottom: parseFloat(bottom),
        left: parseFloat(left), right: parseFloat(right),
        tolerance: parseFloat(tol),
        max_iterations: 2000,
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="2D Laplace Equation" subtitle="Solve ∇²u = 0 on a rectangular domain using finite differences."
      module="Module V — BVP & PDE" moduleColor="text-rose-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>The Laplace equation ∇²u = 0 models steady-state heat, potential fields, etc. We use the 5-point finite difference stencil and iterate using Gauss-Seidel until convergence.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>∂²u/∂x² + ∂²u/∂y² = 0</div>
            <div>5-point stencil: u[i,j] = (u[i+1,j] + u[i-1,j] + u[i,j+1] + u[i,j-1]) / 4</div>
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
        <div className="p-6 space-y-4">
          {/* Grid visualization of boundaries */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto text-center text-sm">
            <div />
            <div>
              <label className="label text-center">Top boundary</label>
              <input type="number" value={top} onChange={e => setTop(e.target.value)} className="input-field text-center" />
            </div>
            <div />
            <div>
              <label className="label text-center">Left</label>
              <input type="number" value={left} onChange={e => setLeft(e.target.value)} className="input-field text-center" />
            </div>
            <div className="bg-dark-700 rounded flex items-center justify-center text-slate-500 text-xs py-4">
              Grid<br/>{nx}×{ny}
            </div>
            <div>
              <label className="label text-center">Right</label>
              <input type="number" value={right} onChange={e => setRight(e.target.value)} className="input-field text-center" />
            </div>
            <div />
            <div>
              <label className="label text-center">Bottom boundary</label>
              <input type="number" value={bottom} onChange={e => setBottom(e.target.value)} className="input-field text-center" />
            </div>
            <div />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="label">Grid width (nx)</label>
              <input type="number" value={nx} onChange={e => setNx(e.target.value)} className="input-field" min="3" max="30" /></div>
            <div><label className="label">Grid height (ny)</label>
              <input type="number" value={ny} onChange={e => setNy(e.target.value)} className="input-field" min="3" max="30" /></div>
            <div><label className="label">Tolerance</label>
              <input type="text" value={tol} onChange={e => setTol(e.target.value)} className="input-field" /></div>
          </div>

          <button onClick={handleCalculate} disabled={loading} className="btn-primary flex items-center gap-2">
            <Play size={16} /> Solve
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner text="Iterating to convergence..." />}
      {error && <Alert type="error" message={error} />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex gap-3 flex-wrap">
            <div className={`badge ${result.converged ? 'badge-green' : 'badge-amber'}`}>
              {result.converged ? `✓ Converged (${result.iterations_used} iters)` : 'Max iterations'}
            </div>
            <div className="badge badge-blue">Final error: {result.final_error.toFixed(2e-5)}</div>
            <div className="badge badge-blue">Range: [{result.u_min.toFixed(2)}, {result.u_max.toFixed(2)}]</div>
          </div>

          {/* Heatmap */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Solution Heatmap</span></div>
            <div className="p-6">
              <HeatmapGrid grid={result.grid} uMin={result.u_min} uMax={result.u_max} />
            </div>
          </div>

          {/* Grid values (small grid) */}
          {result.grid.length <= 12 && (
            <div className="card">
              <div className="card-header"><span className="font-semibold">Grid Values (u[i,j])</span></div>
              <div className="overflow-x-auto p-4">
                <table className="text-xs font-mono">
                  <tbody>
                    {[...result.grid].reverse().map((row: number[], ri: number) => (
                      <tr key={ri}>
                        {row.map((val: number, ci: number) => (
                          <td key={ci} className="px-2 py-1 text-right text-slate-300">
                            {val.toFixed(1)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </MethodLayout>
  );
}
