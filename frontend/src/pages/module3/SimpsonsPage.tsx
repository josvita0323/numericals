import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveSimpsons } from '../../services/api';

export default function SimpsonsPage() {
  const [func, setFunc] = useState('x**2');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [n, setN] = useState('4');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setFunc('x**3'); setA('0'); setB('1'); setN('4');
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveSimpsons({
        func_str: func, a: parseFloat(a), b: parseFloat(b), n: parseInt(n),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const COEFF_COLORS: Record<number, string> = { 1: 'text-blue-400', 4: 'text-amber-400', 2: 'text-emerald-400' };

  return (
    <MethodLayout title="Simpson's 1/3 Rule" subtitle="More accurate integration using parabolic approximations between points."
      module="Module III — Integration" moduleColor="text-emerald-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>Simpson's 1/3 rule fits a parabola through each group of 3 consecutive points. It is <strong className="text-white">more accurate</strong> than the trapezoidal rule for smooth functions (O(h⁴) vs O(h²)).</p>
          <div className="formula-box mt-3 space-y-1">
            <div>∫[a,b] f(x) dx ≈ (h/3)[f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + 4f(xₙ₋₁) + f(xₙ)]</div>
            <div className="text-slate-500">Requires n to be EVEN</div>
          </div>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-blue-400">● Coefficient 1 (endpoints)</span>
            <span className="text-amber-400">● Coefficient 4 (odd positions)</span>
            <span className="text-emerald-400">● Coefficient 2 (even positions)</span>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Input</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example (∫₀¹ x³ dx = 0.25)
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Function f(x)</label>
            <input value={func} onChange={e => setFunc(e.target.value)} className="input-field"
              placeholder="e.g. x**3, sin(x)" />
          </div>
          <div>
            <label className="label">Lower limit (a)</label>
            <input type="number" value={a} onChange={e => setA(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Upper limit (b)</label>
            <input type="number" value={b} onChange={e => setB(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Subintervals n (must be even)</label>
            <input type="number" value={n} onChange={e => setN(e.target.value)} className="input-field" min="2" step="2" />
          </div>
          <div className="md:col-span-3 flex items-end">
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
            <div className="card-header"><span className="font-semibold">x, f(x) and Coefficients</span></div>
            <div className="p-4 mb-2">
              <div className="formula-box text-sm">
                h = ({result.b} − {result.a}) / {result.n} = {result.h}
              </div>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>i</th>
                    <th>xᵢ</th>
                    <th>f(xᵢ)</th>
                    <th>Coeff</th>
                    <th>Weighted</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row: any) => (
                    <tr key={row.i}>
                      <td className="text-center">{row.i}</td>
                      <td>{row.x.toFixed(6)}</td>
                      <td>{row.fx.toFixed(8)}</td>
                      <td className={`text-center font-bold ${COEFF_COLORS[row.coefficient] ?? ''}`}>
                        {row.coefficient}
                      </td>
                      <td>{row.weighted.toFixed(8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-box">
            <h3 className="text-lg font-bold text-white mb-3">✅ Integration Result</h3>
            <div className="formula-box text-xs mb-4 text-emerald-300">{result.formula}</div>
            <p className="text-3xl font-mono font-bold text-emerald-400">
              ∫ f(x) dx ≈ {result.result.toFixed(8)}
            </p>
            {result.exact_value !== null && (
              <div className="mt-4 flex gap-4 flex-wrap">
                <div className="bg-dark-700 rounded px-4 py-2">
                  <div className="text-xs text-slate-500">Exact value</div>
                  <div className="font-mono text-emerald-300">{result.exact_value.toFixed(8)}</div>
                </div>
                <div className="bg-dark-700 rounded px-4 py-2">
                  <div className="text-xs text-slate-500">Absolute error</div>
                  <div className="font-mono text-amber-300">{result.absolute_error.toFixed(10)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Function Curve</span></div>
            <div className="p-6">
              <ChartView curve={result.curve} xLabel="x" yLabel="f(x)" title={`f(x) = ${result.function}`} />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
