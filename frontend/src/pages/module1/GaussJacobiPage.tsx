import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { solveGaussJacobi } from '../../services/api';

const EXAMPLE = {
  a: [[5, 1, 1], [1, 4, 1], [1, 1, 3]],
  b: [7, 6, 5],
  x0: [0, 0, 0],
  tol: 1e-6,
  maxIter: 50,
};

export default function GaussJacobiPage() {
  const [size, setSize] = useState(3);
  const [matA, setMatA] = useState(EXAMPLE.a.map(r => r.map(String)));
  const [vecB, setVecB] = useState(EXAMPLE.b.map(String));
  const [x0, setX0] = useState(EXAMPLE.x0.map(String));
  const [tol, setTol] = useState('1e-6');
  const [maxIter, setMaxIter] = useState('50');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setSize(3);
    setMatA(EXAMPLE.a.map(r => r.map(String)));
    setVecB(EXAMPLE.b.map(String));
    setX0(EXAMPLE.x0.map(String));
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveGaussJacobi({
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
    <MethodLayout title="Gauss–Jacobi Method" subtitle="Iterative solution of linear systems using old values only."
      module="Module I — Linear Systems" moduleColor="text-blue-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>The <strong className="text-white">Gauss–Jacobi</strong> method solves Ax=B by isolating each variable in its own equation and iteratively updating all values simultaneously using only values from the <em>previous</em> iteration.</p>
          <div className="formula-box mt-3">
            x<sub>i</sub><sup>(k+1)</sup> = (b<sub>i</sub> − Σ a<sub>ij</sub>·x<sub>j</sub><sup>(k)</sup>) / a<sub>ii</sub>, for j ≠ i
          </div>
          <p className="text-slate-400 text-xs mt-2">⚠️ Converges only when the matrix is diagonally dominant.</p>
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
            {/* Matrix */}
            <div>
              <label className="label">Coefficient Matrix A ({size}×{size})</label>
              <div className="space-y-1">
                {Array.from({ length: size }, (_, i) => (
                  <div key={i} className="flex gap-1">
                    {Array.from({ length: size }, (_, j) => (
                      <input key={j} type="number" value={matA[i]?.[j] ?? '0'}
                        onChange={e => { const m = matA.map(r => [...r]); m[i][j] = e.target.value; setMatA(m); }}
                        className="input-field w-14 text-center" />
                    ))}
                    <span className="flex items-center px-2 text-slate-500 text-sm">=</span>
                    <input type="number" value={vecB[i] ?? '0'}
                      onChange={e => { const v = [...vecB]; v[i] = e.target.value; setVecB(v); }}
                      className="input-field w-14 text-center text-blue-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-4">
              <div>
                <label className="label">Initial Guess x⁰</label>
                <div className="flex gap-1">
                  {Array.from({ length: size }, (_, i) => (
                    <input key={i} type="number" value={x0[i] ?? '0'}
                      onChange={e => { const v = [...x0]; v[i] = e.target.value; setX0(v); }}
                      className="input-field w-14 text-center" placeholder={`x${i+1}`} />
                  ))}
                </div>
              </div>
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
          {result.diagonal_dominance_warning && (
            <Alert type="warning" message={result.diagonal_dominance_warning} />
          )}

          {/* Iteration Table */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <span className="font-semibold">Iteration Table</span>
              <div className="flex gap-2">
                <span className={`badge ${result.converged ? 'badge-green' : 'badge-red'}`}>
                  {result.converged ? `Converged in ${result.total_iterations} iterations` : 'Did not converge'}
                </span>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Iteration</th>
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
                      <td className={it.max_error < 0.01 ? 'text-emerald-400' : 'text-slate-200'}>
                        {it.max_error.toFixed(6)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Solution */}
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
