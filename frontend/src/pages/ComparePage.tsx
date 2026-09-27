import React, { useState } from 'react';
import { BarChart3, Play } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ChartView from '../components/ChartView';
import { solveGaussJacobi, solveGaussSeidel, solveTrapezoidal, solveSimpsons, solveEuler, solveModifiedEuler, solveRK4 } from '../services/api';

type CompMode = 'iterative' | 'integration' | 'ode';

const EXAMPLES = {
  iterative: {
    matrix_a: [[5,1,1],[1,4,1],[1,1,3]],
    vector_b: [7,6,5],
  },
  integration: { func_str: 'x**4', a: 0, b: 1, n: 100 },
  ode: { func_str: 'y', x0: 0, y0: 1, h: 0.1, x_end: 1.0, exact: Math.E },
};

export default function ComparePage() {
  const [mode, setMode] = useState<CompMode>('ode');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setError(''); setResults(null); setLoading(true);
    try {
      if (mode === 'iterative') {
        const [rj, rs] = await Promise.all([
          solveGaussJacobi({ ...EXAMPLES.iterative, tolerance: 1e-8, max_iterations: 100 }) as any,
          solveGaussSeidel({ ...EXAMPLES.iterative, tolerance: 1e-8, max_iterations: 100 }) as any,
        ]);
        setResults({ mode, jacobi: rj.data, seidel: rs.data });
      } else if (mode === 'integration') {
        const [rt, rs] = await Promise.all([
          solveTrapezoidal(EXAMPLES.integration) as any,
          solveSimpsons(EXAMPLES.integration) as any,
        ]);
        setResults({ mode, trap: rt.data, simp: rs.data });
      } else {
        const [re, rm, rr] = await Promise.all([
          solveEuler(EXAMPLES.ode) as any,
          solveModifiedEuler(EXAMPLES.ode) as any,
          solveRK4(EXAMPLES.ode) as any,
        ]);
        setResults({ mode, euler: re.data, modEuler: rm.data, rk4: rr.data });
      }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={20} className="text-primary-400" />
          <h1 className="text-2xl font-bold text-white">Compare Methods</h1>
        </div>
        <p className="text-slate-400 text-sm">Run related methods side-by-side and compare their results.</p>
      </div>

      {/* Mode selector */}
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'ode', label: 'ODE Methods: Euler vs Modified Euler vs RK4' },
            { key: 'integration', label: 'Integration: Trapezoidal vs Simpson' },
            { key: 'iterative', label: 'Iterative: Jacobi vs Gauss-Seidel' },
          ] as { key: CompMode, label: string }[]).map(m => (
            <button key={m.key} onClick={() => { setMode(m.key); setResults(null); }}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                mode === m.key ? 'bg-primary-600 text-white' : 'bg-dark-600 text-slate-400 hover:text-white'
              }`}>
              {m.label}
            </button>
          ))}
        </div>
        <button onClick={run} disabled={loading} className="btn-primary flex items-center gap-2 mt-4">
          <Play size={16} /> Run Comparison
        </button>
      </div>

      {loading && <LoadingSpinner text="Running all methods..." />}
      {error && <Alert type="error" message={error} />}

      {results && results.mode === 'ode' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Euler's Method", data: results.euler, color: 'text-blue-400', acc: 'O(h)' },
              { label: 'Modified Euler', data: results.modEuler, color: 'text-purple-400', acc: 'O(h²)' },
              { label: 'RK4', data: results.rk4, color: 'text-emerald-400', acc: 'O(h⁴)' },
            ].map(m => (
              <div key={m.label} className="card p-4">
                <h3 className={`font-semibold ${m.color} mb-2`}>{m.label}</h3>
                <div className="text-xs text-slate-500 mb-2">Accuracy: {m.acc}</div>
                <div className="bg-dark-700 rounded p-3 font-mono text-center">
                  <div className="text-xs text-slate-500">y(1.0) ≈</div>
                  <div className="text-xl font-bold text-white">{m.data.final_y.toFixed(8)}</div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Error vs e: {Math.abs(m.data.final_y - EXAMPLES.ode.exact).toExponential(4)}
                </div>
                <div className="text-xs text-slate-500">{m.data.n_steps} steps</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Solution Curves Comparison</span></div>
            <div className="p-6">
              <div className="text-xs text-slate-500 mb-3">
                Problem: dy/dx = y, y(0) = 1, h = 0.1 — Exact: y = eˣ, y(1) = e ≈ {EXAMPLES.ode.exact.toFixed(8)}
              </div>
              <ChartView
                curve={results.euler.curve.map((p: any) => ({ ...p, curve_y: p.y }))}
                fittedCurve={results.rk4.curve.map((p: any) => ({ ...p, y: p.y }))}
                dataPoints={results.modEuler.curve.map((p: any) => ({ ...p }))}
                title="All three curves (Euler, Modified Euler, RK4)"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Summary Table</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>y(1.0)</th>
                    <th>Absolute Error</th>
                    <th>Accuracy Order</th>
                    <th>Steps</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Euler's", d: results.euler, acc: 'O(h) — 1st order' },
                    { name: 'Modified Euler', d: results.modEuler, acc: 'O(h²) — 2nd order' },
                    { name: 'RK4', d: results.rk4, acc: 'O(h⁴) — 4th order' },
                  ].map(m => (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td className="font-mono">{m.d.final_y.toFixed(8)}</td>
                      <td className="font-mono text-amber-300">{Math.abs(m.d.final_y - EXAMPLES.ode.exact).toExponential(4)}</td>
                      <td>{m.acc}</td>
                      <td>{m.d.n_steps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {results && results.mode === 'integration' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card">
            <div className="card-header"><span className="font-semibold">Integration Comparison — ∫₀¹ x⁴ dx = 0.2 (exact)</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>Method</th><th>Result</th><th>Exact</th><th>Abs. Error</th><th>Order</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Trapezoidal Rule</td>
                    <td className="font-mono">{results.trap.result.toFixed(10)}</td>
                    <td className="font-mono">{results.trap.exact_value?.toFixed(10)}</td>
                    <td className="text-amber-300 font-mono">{results.trap.absolute_error?.toFixed(10)}</td>
                    <td>O(h²)</td>
                  </tr>
                  <tr>
                    <td>Simpson's 1/3</td>
                    <td className="font-mono">{results.simp.result.toFixed(10)}</td>
                    <td className="font-mono">{results.simp.exact_value?.toFixed(10)}</td>
                    <td className="text-emerald-300 font-mono">{results.simp.absolute_error?.toFixed(10)}</td>
                    <td>O(h⁴)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <Alert type="info" message="Simpson's 1/3 rule generally achieves lower error than the Trapezoidal rule for smooth functions, due to its higher order of accuracy O(h⁴) vs O(h²)." />
        </div>
      )}

      {results && results.mode === 'iterative' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card">
            <div className="card-header"><span className="font-semibold">Convergence Comparison — 5x₁+x₂+x₃=7, x₁+4x₂+x₃=6, x₁+x₂+3x₃=5</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>Method</th><th>Converged</th><th>Iterations</th><th>x₁</th><th>x₂</th><th>x₃</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Gauss–Jacobi</td>
                    <td className={results.jacobi.converged ? 'text-emerald-400' : 'text-red-400'}>
                      {results.jacobi.converged ? 'Yes' : 'No'}
                    </td>
                    <td>{results.jacobi.total_iterations}</td>
                    {results.jacobi.solution.map((v: number, i: number) => (
                      <td key={i} className="font-mono">{v.toFixed(6)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Gauss–Seidel</td>
                    <td className={results.seidel.converged ? 'text-emerald-400' : 'text-red-400'}>
                      {results.seidel.converged ? 'Yes' : 'No'}
                    </td>
                    <td>{results.seidel.total_iterations}</td>
                    {results.seidel.solution.map((v: number, i: number) => (
                      <td key={i} className="font-mono">{v.toFixed(6)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <Alert type="info" message="Gauss-Seidel typically converges faster than Jacobi because it uses the most recently updated values immediately, rather than waiting for the next iteration." />
        </div>
      )}
    </div>
  );
}
