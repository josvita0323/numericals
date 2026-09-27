import React, { useState } from 'react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChartView from '../../components/ChartView';
import { solveBVP } from '../../services/api';

export default function BVPPage() {
  const [P, setP] = useState('0');
  const [Q, setQ] = useState('-1');
  const [R, setR] = useState('0');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [alpha, setAlpha] = useState('0');
  const [beta, setBeta] = useState('1');
  const [n, setN] = useState('10');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExample = () => {
    setP('0'); setQ('-1'); setR('0'); setA('0'); setB('1'); setAlpha('0'); setBeta('1'); setN('10');
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res: any = await solveBVP({
        p_str: P, q_str: Q, r_str: R,
        a: parseFloat(a), b: parseFloat(b),
        alpha: parseFloat(alpha), beta: parseFloat(beta),
        n: parseInt(n),
      });
      setResult(res.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <MethodLayout title="Two-Point Boundary Value Problem" subtitle="Solve y'' + P(x)y' + Q(x)y = R(x) with boundary conditions."
      module="Module V — BVP & PDE" moduleColor="text-rose-400">

      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>A BVP requires conditions at <strong className="text-white">both ends</strong> of the domain instead of initial conditions. We discretize the domain and replace derivatives with finite differences.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>y'' + P(x)y' + Q(x)y = R(x), y(a) = α, y(b) = β</div>
            <div className="mt-2 text-slate-500">Central differences:</div>
            <div>y'' ≈ (y_{'{'}i-1{'}'} − 2yᵢ + y_{'{'}i+1{'}'}) / h²</div>
            <div>y' ≈ (y_{'{'}i+1{'}'} − y_{'{'}i-1{'}'}) / (2h)</div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold">Input</span>
          <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RefreshCw size={12} /> Load Example (y'' − y = 0)
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">P(x) coefficient of y'</label>
              <input value={P} onChange={e => setP(e.target.value)} className="input-field" placeholder="e.g. 0" />
            </div>
            <div>
              <label className="label">Q(x) coefficient of y</label>
              <input value={Q} onChange={e => setQ(e.target.value)} className="input-field" placeholder="e.g. -1" />
            </div>
            <div>
              <label className="label">R(x) right-hand side</label>
              <input value={R} onChange={e => setR(e.target.value)} className="input-field" placeholder="e.g. 0" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="label">a (left bound)</label>
              <input type="number" value={a} onChange={e => setA(e.target.value)} className="input-field" /></div>
            <div><label className="label">b (right bound)</label>
              <input type="number" value={b} onChange={e => setB(e.target.value)} className="input-field" /></div>
            <div><label className="label">α = y(a)</label>
              <input type="number" value={alpha} onChange={e => setAlpha(e.target.value)} className="input-field" /></div>
            <div><label className="label">β = y(b)</label>
              <input type="number" value={beta} onChange={e => setBeta(e.target.value)} className="input-field" /></div>
            <div><label className="label">n (grid points)</label>
              <input type="number" value={n} onChange={e => setN(e.target.value)} className="input-field" min="2" max="100" /></div>
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
          <div className="card">
            <div className="card-header"><span className="font-semibold">Finite Difference System (Selected Equations)</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>i</th>
                    <th>xᵢ</th>
                    <th>Coeff yᵢ₋₁</th>
                    <th>Coeff yᵢ</th>
                    <th>Coeff yᵢ₊₁</th>
                    <th>RHS</th>
                  </tr>
                </thead>
                <tbody>
                  {result.equations.map((eq: any) => (
                    <tr key={eq.i}>
                      <td>{eq.i}</td>
                      <td>{eq.x_i.toFixed(4)}</td>
                      <td className="text-blue-300">{eq.coeff_prev.toFixed(6)}</td>
                      <td className="text-primary-300">{eq.coeff_curr.toFixed(6)}</td>
                      <td className="text-blue-300">{eq.coeff_next.toFixed(6)}</td>
                      <td>{eq.rhs.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Solution at Grid Points</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>x</th>
                    <th>y(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.solution.map((pt: any) => (
                    <tr key={pt.x}>
                      <td>{pt.x.toFixed(6)}</td>
                      <td className="text-primary-300 font-medium">{pt.y.toFixed(8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="font-semibold">Solution Curve</span></div>
            <div className="p-6">
              <ChartView curve={result.curve} xLabel="x" yLabel="y(x)"
                title="BVP numerical solution" />
            </div>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
