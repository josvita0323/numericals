import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveDifferentiation } from '../../services/api';

const METHODS = [
  { key: 'forward', label: 'Forward Difference', formula: "f'(x) ≈ [f(x+h) − f(x)] / h", order: 'O(h)' },
  { key: 'backward', label: 'Backward Difference', formula: "f'(x) ≈ [f(x) − f(x−h)] / h", order: 'O(h)' },
  { key: 'central', label: 'Central Difference', formula: "f'(x) ≈ [f(x+h) − f(x−h)] / (2h)", order: 'O(h²)' },
];

export default function DifferentiationPage() {
  const [func, setFunc] = useState('x**2 + sin(x)');
  const [xVal, setXVal] = useState('1.0');
  const [h, setH] = useState('0.1');
  const [method, setMethod] = useState('central');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveDifferentiation({
        func_str: func, x_val: parseFloat(xVal), h: parseFloat(h), method,
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const selected = METHODS.find(m => m.key === method)!;

  return (
    <MethodLayout title="Numerical Differentiation" subtitle="Approximate f'(x) using finite-difference formulas."
      module="Module III — Differentiation & Integration" moduleColor="text-emerald-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-3">
          <p>Numerical differentiation approximates the derivative f'(x) using function evaluations at nearby points.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {METHODS.map(m => (
              <div key={m.key} className="formula-box text-xs space-y-1">
                <div className="text-emerald-300 font-medium">{m.label}</div>
                <div>{m.formula}</div>
                <div className="text-slate-500">Accuracy: {m.order}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header"><span className="font-semibold">Input</span></div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Method</label>
            <div className="flex gap-2 flex-wrap">
              {METHODS.map(m => (
                <button key={m.key} onClick={() => setMethod(m.key)}
                  className={`px-3 py-1.5 rounded text-sm transition-all ${
                    method === m.key ? 'bg-emerald-600 text-white' : 'bg-dark-600 text-slate-400 hover:text-white'
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Function f(x)</label>
              <input value={func} onChange={e => setFunc(e.target.value)} className="input-field"
                placeholder="e.g. x**2 + sin(x)" />
              <p className="text-xs text-slate-600 mt-1">Example: x**2 + sin(x), cos(x), exp(x)</p>
            </div>
            <div>
              <label className="label">x value</label>
              <input type="number" value={xVal} onChange={e => setXVal(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Step size h</label>
              <input type="number" value={h} step="0.01" onChange={e => setH(e.target.value)} className="input-field" />
            </div>
          </div>

          <button onClick={handleCalculate} disabled={loading} className="btn-primary flex items-center gap-2">
            <Play size={16} /> Calculate
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <Alert type="error" message={error} />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Formula display */}
          <div className="card">
            <div className="card-header"><span className="font-semibold">Calculation Steps</span></div>
            <div className="p-6 space-y-4">
              <div className="step-box">
                <div className="badge badge-blue mb-2">Formula Used</div>
                <div className="formula-box">{result.formula}</div>
              </div>
              <div className="step-box">
                <div className="badge badge-blue mb-2">Function Values</div>
                <div className="grid grid-cols-3 gap-3 text-sm font-mono">
                  <div className="bg-dark-700 rounded px-3 py-2">
                    <div className="text-xs text-slate-500">f({result.x_val}−{result.h})</div>
                    <div className="text-slate-200">{result.f_x_minus_h?.toFixed(8)}</div>
                  </div>
                  <div className="bg-dark-700 rounded px-3 py-2 border border-primary-700/30">
                    <div className="text-xs text-slate-500">f({result.x_val})</div>
                    <div className="text-primary-300">{result.f_x.toFixed(8)}</div>
                  </div>
                  <div className="bg-dark-700 rounded px-3 py-2">
                    <div className="text-xs text-slate-500">f({result.x_val}+{result.h})</div>
                    <div className="text-slate-200">{result.f_x_plus_h?.toFixed(8)}</div>
                  </div>
                </div>
              </div>
              <div className="step-box">
                <div className="badge badge-blue mb-2">Substituted</div>
                <div className="formula-box text-xs break-words">{result.substituted}</div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="result-box">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">✅ Numerical Derivative</h3>
                <p className="text-3xl font-mono font-bold text-emerald-400">
                  f'({result.x_val}) ≈ {result.derivative.toFixed(8)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Accuracy: {result.order}</p>
              </div>
              {result.exact_value !== null && (
                <div className="bg-dark-700 rounded-lg p-4 text-sm">
                  <div className="text-xs text-slate-500 mb-1">Exact (via SymPy)</div>
                  <div className="font-mono text-emerald-300">{result.exact_value.toFixed(8)}</div>
                  <div className="text-xs text-slate-500 mt-2">Abs. Error</div>
                  <div className="font-mono text-amber-300">{result.absolute_error?.toFixed(2e-8)}</div>
                  {result.relative_error_pct !== null && (
                    <div className="text-xs text-slate-400 mt-1">{result.relative_error_pct?.toFixed(6)}%</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Function Curve</span></div>
            <div className="p-6">
              <ChartView curve={result.curve} xLabel="x" yLabel="f(x)"
                referenceX={result.x_val}
                title={`f(x) = ${result.function}`} />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
