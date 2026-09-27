import React, { useState } from 'react';
import { Plus, Minus, Play, BookOpen, RefreshCw } from 'lucide-react';
import MethodLayout from '../../components/MethodLayout';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import MatrixDisplay from '../../components/MatrixDisplay';
import { solveGaussJordan } from '../../services/api';

const EXAMPLE_3X3 = {
  a: [[2, 1, -1], [1, 3, 2], [1, -1, 3]],
  b: [8, 13, 5],
};

export default function GaussJordanPage() {
  const [size, setSize] = useState(3);
  const [matA, setMatA] = useState<string[][]>(
    EXAMPLE_3X3.a.map(row => row.map(String))
  );
  const [vecB, setVecB] = useState<string[]>(EXAMPLE_3X3.b.map(String));
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resize = (n: number) => {
    setSize(n);
    setMatA(Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (matA[i]?.[j] ?? '0'))
    ));
    setVecB(Array.from({ length: n }, (_, i) => vecB[i] ?? '0'));
    setResult(null);
    setError('');
  };

  const loadExample = () => {
    setSize(3);
    setMatA(EXAMPLE_3X3.a.map(row => row.map(String)));
    setVecB(EXAMPLE_3X3.b.map(String));
    setResult(null); setError('');
  };

  const handleCalculate = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const a = matA.map(row => row.map(Number));
      const b = vecB.map(Number);
      const res: any = await solveGaussJordan({ matrix_a: a, vector_b: b });
      setResult(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MethodLayout
      title="Gauss–Jordan Method"
      subtitle="Solve a system of linear equations Ax = B using row reduction to RREF."
      module="Module I — Linear Systems"
      moduleColor="text-blue-400"
    >
      {/* Description */}
      <div className="card mb-6">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold text-slate-200">What is this method?</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-2">
          <p>The <strong className="text-white">Gauss–Jordan method</strong> solves a linear system by augmenting matrix A with vector B to form <code className="text-primary-300">[A|B]</code>, then applying row operations until the left part becomes the identity matrix. The right column then directly gives the solution.</p>
          <div className="formula-box mt-3 space-y-1">
            <div>Augmented matrix: [A | B]</div>
            <div>Row operations: swap rows, scale rows, add multiples of rows</div>
            <div>Goal: reduce to [I | x] where I is the identity matrix</div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <span className="font-semibold text-slate-200">Input</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Size:</span>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => resize(n)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${size === n ? 'bg-primary-600 text-white' : 'bg-dark-600 text-slate-400 hover:text-white'}`}>
                {n}×{n}
              </button>
            ))}
            <button onClick={loadExample} className="btn-secondary flex items-center gap-1.5 text-xs ml-2">
              <RefreshCw size={12} /> Load Example
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs text-slate-500 mb-4">Enter coefficients for the {size}×{size} system Ax = B</p>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr>
                  {Array.from({ length: size }, (_, j) => (
                    <th key={j} className="px-2 pb-2 text-xs text-slate-500 font-medium">x{j + 1}</th>
                  ))}
                  <th className="px-2 pb-2 text-xs text-blue-400 font-medium border-l border-dashed border-dark-500 pl-4">b</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: size }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: size }, (_, j) => (
                      <td key={j} className="px-1 py-1">
                        <input
                          type="number"
                          value={matA[i]?.[j] ?? '0'}
                          onChange={e => {
                            const m = matA.map(r => [...r]);
                            m[i][j] = e.target.value;
                            setMatA(m);
                          }}
                          className="input-field w-16 text-center"
                        />
                      </td>
                    ))}
                    <td className="px-1 py-1 border-l border-dashed border-dark-500 pl-3">
                      <input
                        type="number"
                        value={vecB[i] ?? '0'}
                        onChange={e => {
                          const v = [...vecB]; v[i] = e.target.value; setVecB(v);
                        }}
                        className="input-field w-16 text-center text-blue-300"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={handleCalculate} disabled={loading}
            className="btn-primary flex items-center gap-2 mt-6">
            <Play size={16} /> Calculate
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && <LoadingSpinner />}
      {error && <Alert type="error" message={error} />}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Steps */}
          <div className="card">
            <div className="card-header">
              <span className="font-semibold text-slate-200">Step-by-Step Solution</span>
            </div>
            <div className="p-6 space-y-6">
              {result.steps.map((step: any, idx: number) => (
                <div key={idx} className="step-box">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-blue">Step {idx + 1}</span>
                    <span className="text-sm text-slate-300">{step.description}</span>
                  </div>
                  {step.operation && (
                    <div className="formula-box mb-3 text-xs">{step.operation}</div>
                  )}
                  <div className="overflow-x-auto">
                    <MatrixDisplay
                      matrix={step.matrix}
                      highlightLastCol={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="result-box animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-4">✅ Solution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.solution.map((val: number, i: number) => (
                <div key={i} className="bg-dark-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400 mb-1">x{i + 1}</div>
                  <div className="font-mono text-lg font-bold text-primary-300">
                    {Math.abs(val) < 1e-8 ? 0 : val.toFixed(6)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-4">
              The system Ax = B has a unique solution: {
                result.solution.map((v: number, i: number) =>
                  `x${i + 1} = ${Math.abs(v) < 1e-8 ? 0 : v.toFixed(4)}`
                ).join(', ')
              }
            </p>
          </div>
        </div>
      )}
    </MethodLayout>
  );
}
