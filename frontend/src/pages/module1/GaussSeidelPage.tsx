import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { solveGaussSeidel } from '../../services/api';

const EXAMPLE = {
  a: [[5, 1, 1], [1, 4, 1], [1, 1, 3]],
  b: [7, 6, 5],
};

export default function GaussSeidelPage() {
  const [size] = useState(3);
  const [matA, setMatA] = useState(EXAMPLE.a.map(r => r.map(String)));
  const [vecB, setVecB] = useState(EXAMPLE.b.map(String));
  const [x0] = useState(['0', '0', '0']);
  const [tol, setTol] = useState('1e-6');
  const [maxIter, setMaxIter] = useState('50');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setMatA(EXAMPLE.a.map(r => r.map(String)));
    setVecB(EXAMPLE.b.map(String));
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveGaussSeidel({
        matrix_a: matA.map(r => r.map(Number)),
        vector_b: vecB.map(Number),
        initial_guess: x0.map(Number),
        tolerance: parseFloat(tol),
        max_iterations: parseInt(maxIter),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Gauss–Seidel Method" subtitle="Like Jacobi, but uses updated values immediately within each iteration."
      module="Module I — Linear Systems" moduleColor="text-blue-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>The <strong className="text-white">Gauss–Seidel method</strong> is similar to Jacobi, but the key difference is that it <em>immediately uses</em> the latest updated values during each iteration. This typically leads to faster convergence.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>x₁ = (b₁ − a₁₂·x₂⁽ᵒˡᵈ⁾ − a₁₃·x₃⁽ᵒˡᵈ⁾) / a₁₁</div>
            <div>x₂ = (b₂ − a₂₁·x₁⁽ⁿᵉʷ⁾ − a₂₃·x₃⁽ᵒˡᵈ⁾) / a₂₂  ← uses new x₁!</div>
            <div>x₃ = (b₃ − a₃₁·x₁⁽ⁿᵉʷ⁾ − a₃₂·x₂⁽ⁿᵉʷ⁾) / a₃₃  ← uses new x₁, x₂!</div>
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
              <label className="label">System Ax = b</label>
              <div className="space-y-1">
                {Array.from({ length: size }, (_, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    {Array.from({ length: size }, (_, j) => (
                      <input key={j} type="number" value={matA[i]?.[j] ?? '0'}
                        onChange={e => { const m = matA.map(r => [...r]); m[i][j] = e.target.value; setMatA(m); }}
                        className="input-field w-14 text-center" />
                    ))}
                    <span className="text-slate-500 px-1">=</span>
                    <input type="number" value={vecB[i] ?? '0'}
                      onChange={e => { const v = [...vecB]; v[i] = e.target.value; setVecB(v); }}
                      className="input-field w-14 text-center text-blue-300" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tolerance</label>
                  <input type="text" value={tol} onChange={e => setTol(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="label">Max Iterations</label>
                  <input type="number" value={maxIter} onChange={e => setMaxIter(e.target.value)} className="input-field" />
                </div>
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
          {result.diagonal_dominance_warning && <Alert type="warning" message={result.diagonal_dominance_warning} />}

          <div className="card">
            <div className="card-header flex items-center justify-between">
              <span className="font-semibold">Iteration Table</span>
              <span className={`badge ${result.converged ? 'badge-green' : 'badge-red'}`}>
                {result.converged ? `✓ Converged (${result.total_iterations} iters)` : 'Max iterations reached'}
              </span>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Iter</th>
                    {result.variable_names.map((v: string) => <th key={v}>{v}</th>)}
                    <th>Max Error (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.iterations.map((it: any) => (
                    <tr key={it.iteration}>
                      <td className="text-center">{it.iteration}</td>
                      {it.values.map((v: number, i: number) => (
                        <td key={i}>{v.toFixed(8)}</td>
                      ))}
                      <td className={it.max_error < 0.01 ? 'text-emerald-400' : ''}>{it.max_error.toFixed(6)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Show how new values were used */}
          {result.iterations.length > 0 && result.iterations[0].update_details && (
            <div className="card">
              <div className="card-header">
                <span className="font-semibold">First Iteration — Value Update Details</span>
              </div>
              <div className="p-4 space-y-2">
                {result.iterations[0].update_details.map((d: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="badge badge-blue">{d.var}</span>
                    <span className="text-slate-400">computed using</span>
                    {d.uses_new.length > 0 && (
                      <span className="text-emerald-400 font-mono text-xs">
                        new: {d.uses_new.join(', ')}
                      </span>
                    )}
                    {d.uses_old.length > 0 && (
                      <span className="text-amber-400 font-mono text-xs">
                        old: {d.uses_old.join(', ')}
                      </span>
                    )}
                    <span className="text-slate-500">→</span>
                    <span className="font-mono text-primary-300">{d.value.toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-box">
            <h3 className="text-lg font-bold text-white mb-4">
              {result.converged ? '✅' : '⚠️'} Final Solution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.solution.map((val: number, i: number) => (
                <div key={i} className="bg-dark-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400 mb-1">{result.variable_names[i]}</div>
                  <div className="font-mono text-lg font-bold text-primary-300">{val.toFixed(6)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
