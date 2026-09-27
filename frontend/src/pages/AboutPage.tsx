import React from 'react';
import { BookOpen, Github, Calculator } from 'lucide-react';

const METHODS = [
  { name: 'Gauss–Jordan', module: 'I', desc: 'Direct row reduction to RREF. Transforms [A|B] to [I|x].' },
  { name: 'Gauss–Jacobi', module: 'I', desc: 'Iterative method. Updates all variables simultaneously using old values.' },
  { name: 'Gauss–Seidel', module: 'I', desc: 'Iterative method. Uses new values immediately, converges faster.' },
  { name: 'Lagrange Interpolation', module: 'II', desc: 'Constructs polynomial through n points using basis functions Lᵢ(x).' },
  { name: 'Cubic Spline', module: 'II', desc: 'Natural cubic spline — C2-continuous piecewise cubic polynomials.' },
  { name: 'Least Squares', module: 'II', desc: 'Minimizes Σ(yᵢ - f(xᵢ))² to fit linear or quadratic polynomials.' },
  { name: 'Numerical Differentiation', module: 'III', desc: 'Forward, backward, and central finite-difference formulas for f\'(x).' },
  { name: 'Trapezoidal Rule', module: 'III', desc: 'Approximates integrals using trapezoid areas. O(h²) accuracy.' },
  { name: "Simpson's 1/3 Rule", module: 'III', desc: 'Uses parabolic approximation. O(h⁴) accuracy. Requires even n.' },
  { name: "Euler's Method", module: 'IV', desc: 'Simple first-order ODE solver. y_{n+1} = y_n + h·f(x_n, y_n).' },
  { name: 'Modified Euler', module: 'IV', desc: 'Predictor-corrector (Heun\'s method). O(h²) accuracy.' },
  { name: 'RK4', module: 'IV', desc: 'Classical 4th-order Runge-Kutta. Uses k₁,k₂,k₃,k₄. O(h⁴) accuracy.' },
  { name: 'Two-Point BVP', module: 'V', desc: 'Finite differences for y\'\'+ P(x)y\' + Q(x)y = R(x).' },
  { name: 'Laplace Equation', module: 'V', desc: '2D ∇²u=0 solved by Gauss-Seidel iteration on rectangular grid.' },
  { name: 'Heat Equation', module: 'V', desc: '1D ∂u/∂t = α∂²u/∂x² solved by explicit finite differences.' },
];

const MODULE_COLORS: Record<string, string> = {
  'I': 'badge-blue', 'II': 'bg-purple-900/40 text-purple-300 border border-purple-800',
  'III': 'badge-green', 'IV': 'badge-amber', 'V': 'badge-red'
};

export default function AboutPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">About This Project</h1>
        <p className="text-slate-400 text-sm">Numerical Methods Learning Lab — 7th Semester CSE Project</p>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <BookOpen size={16} className="text-primary-400" />
          <span className="font-semibold">Project Description</span>
        </div>
        <div className="p-6 text-sm text-slate-300 space-y-3">
          <p>
            The <strong className="text-white">Numerical Methods Learning Lab</strong> is a full-stack educational application that implements 15 numerical methods from 5 modules of a standard college-level Numerical Methods curriculum.
          </p>
          <p>
            Each method features step-by-step calculations, visualizations, input validation, and pre-filled examples — helping students understand not just the answer, but <em>how</em> the computation works.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="font-semibold">Technology Stack</span></div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Frontend</h3>
            <ul className="space-y-1.5 text-sm text-slate-400">
              {['React 19 + TypeScript', 'Vite (build tool)', 'Tailwind CSS (styling)', 'React Router (navigation)', 'Recharts (visualizations)', 'Lucide React (icons)'].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Backend</h3>
            <ul className="space-y-1.5 text-sm text-slate-400">
              {['Python 3.12', 'FastAPI (REST API)', 'NumPy (arrays/math)', 'SymPy (symbolic math)', 'Pydantic (validation)', 'Pytest (testing)'].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="font-semibold">All 15 Implemented Methods</span></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Method</th><th>Module</th><th>Description</th></tr>
            </thead>
            <tbody>
              {METHODS.map((m, i) => (
                <tr key={m.name}>
                  <td className="text-center text-slate-500">{i + 1}</td>
                  <td className="font-medium text-slate-200">{m.name}</td>
                  <td><span className={`badge ${MODULE_COLORS[m.module]}`}>Module {m.module}</span></td>
                  <td className="text-slate-400">{m.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="font-semibold">Architecture</span></div>
        <div className="p-6">
          <div className="formula-box text-sm space-y-1">
            <div>React Frontend (port 5173)</div>
            <div className="text-slate-500 pl-4">↓ HTTP POST (via Vite proxy)</div>
            <div>FastAPI Backend (port 8000)</div>
            <div className="text-slate-500 pl-4">↓ calls solver function</div>
            <div>Python Solver (gauss_jordan.py, rk4.py, etc.)</div>
            <div className="text-slate-500 pl-4">↓ returns step-by-step JSON</div>
            <div>React renders results + charts</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="font-semibold">How to Run</span></div>
        <div className="p-6 space-y-4 text-sm">
          <div>
            <p className="text-slate-400 mb-2 font-medium">Backend:</p>
            <div className="formula-box text-xs space-y-1">
              <div>cd backend</div>
              <div>pip install -r requirements.txt</div>
              <div>uvicorn main:app --reload</div>
            </div>
          </div>
          <div>
            <p className="text-slate-400 mb-2 font-medium">Frontend:</p>
            <div className="formula-box text-xs space-y-1">
              <div>cd frontend</div>
              <div>npm install</div>
              <div>npm run dev</div>
            </div>
          </div>
          <div>
            <p className="text-slate-400 mb-2 font-medium">Tests:</p>
            <div className="formula-box text-xs">
              <div>cd backend && pytest tests/ -v</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
