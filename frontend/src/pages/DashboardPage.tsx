import React from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical, TrendingUp, Divide, GitBranch, Grid3X3,
  ArrowRight, Calculator, BookOpen, BarChart3
} from 'lucide-react';

const MODULES = [
  {
    id: 1,
    label: 'Module I',
    title: 'Linear Systems',
    color: 'from-blue-600 to-blue-800',
    border: 'border-blue-700/30',
    textColor: 'text-blue-400',
    bgGlow: 'shadow-blue-900/20',
    icon: <FlaskConical size={24} />,
    methods: [
      { name: 'Gauss–Jordan Method', path: '/gauss-jordan', desc: 'Direct row reduction to RREF' },
      { name: 'Gauss–Jacobi Method', path: '/gauss-jacobi', desc: 'Simultaneous iterative update' },
      { name: 'Gauss–Seidel Method', path: '/gauss-seidel', desc: 'Sequential iterative update' },
    ],
  },
  {
    id: 2,
    label: 'Module II',
    title: 'Interpolation',
    color: 'from-purple-600 to-purple-800',
    border: 'border-purple-700/30',
    textColor: 'text-purple-400',
    bgGlow: 'shadow-purple-900/20',
    icon: <TrendingUp size={24} />,
    methods: [
      { name: 'Lagrange Interpolation', path: '/lagrange', desc: 'Weighted polynomial basis' },
      { name: 'Cubic Spline', path: '/cubic-spline', desc: 'C2-smooth piecewise cubic' },
      { name: 'Least Squares Fit', path: '/least-squares', desc: 'Best-fit polynomial curves' },
    ],
  },
  {
    id: 3,
    label: 'Module III',
    title: 'Differentiation & Integration',
    color: 'from-emerald-600 to-emerald-800',
    border: 'border-emerald-700/30',
    textColor: 'text-emerald-400',
    bgGlow: 'shadow-emerald-900/20',
    icon: <Divide size={24} />,
    methods: [
      { name: 'Numerical Differentiation', path: '/differentiation', desc: 'Forward/Backward/Central' },
      { name: 'Trapezoidal Rule', path: '/trapezoidal', desc: 'Area under curve via trapezoids' },
      { name: "Simpson's 1/3 Rule", path: '/simpsons', desc: 'Parabolic approximation' },
    ],
  },
  {
    id: 4,
    label: 'Module IV',
    title: 'Ordinary Differential Equations',
    color: 'from-amber-600 to-amber-800',
    border: 'border-amber-700/30',
    textColor: 'text-amber-400',
    bgGlow: 'shadow-amber-900/20',
    icon: <GitBranch size={24} />,
    methods: [
      { name: "Euler's Method", path: '/euler', desc: 'Simple first-order ODE solver' },
      { name: 'Modified Euler', path: '/modified-euler', desc: 'Predictor-corrector scheme' },
      { name: 'Runge-Kutta RK4', path: '/rk4', desc: 'Fourth-order accuracy' },
    ],
  },
  {
    id: 5,
    label: 'Module V',
    title: 'BVP & PDE',
    color: 'from-rose-600 to-rose-800',
    border: 'border-rose-700/30',
    textColor: 'text-rose-400',
    bgGlow: 'shadow-rose-900/20',
    icon: <Grid3X3 size={24} />,
    methods: [
      { name: 'Two-Point BVP', path: '/bvp', desc: 'Finite difference for BVPs' },
      { name: 'Laplace Equation', path: '/laplace', desc: '2D steady-state heat' },
      { name: 'Heat Equation', path: '/heat-equation', desc: '1D transient heat conduction' },
    ],
  },
];

const STATS = [
  { label: 'Modules', value: '5', icon: BookOpen, color: 'text-blue-400' },
  { label: 'Methods', value: '15', icon: Calculator, color: 'text-purple-400' },
  { label: 'ODE Solvers', value: '3', icon: GitBranch, color: 'text-amber-400' },
  { label: 'PDE Methods', value: '3', icon: Grid3X3, color: 'text-rose-400' },
];

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900 border border-dark-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-900/40">
              <Calculator size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Numerical Methods</h1>
              <h1 className="text-2xl font-bold text-primary-400">Learning Lab</h1>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            An interactive educational tool implementing <strong className="text-white">15 numerical methods</strong> across
            <strong className="text-white"> 5 modules</strong>. Each method features step-by-step calculations, visualizations,
            and example problems — designed for 7th-semester CSE students.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link to="/gauss-jordan" className="btn-primary flex items-center gap-2 text-sm">
              Start Exploring <ArrowRight size={14} />
            </Link>
            <Link to="/compare" className="btn-secondary flex items-center gap-2 text-sm">
              <BarChart3 size={14} /> Compare Methods
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`${stat.color} bg-dark-700 p-3 rounded-lg`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">All Modules</h2>
        <div className="space-y-4">
          {MODULES.map(mod => (
            <div key={mod.id} className={`card border ${mod.border} shadow-lg ${mod.bgGlow}`}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center text-white`}>
                    {mod.icon}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${mod.textColor}`}>{mod.label}</span>
                    <h3 className="text-base font-bold text-white">{mod.title}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {mod.methods.map(m => (
                    <Link
                      key={m.path}
                      to={m.path}
                      className="group bg-dark-700/60 hover:bg-dark-700 border border-dark-500 hover:border-dark-400 rounded-lg p-3 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {m.name}
                        </span>
                        <ArrowRight size={12} className={`${mod.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </div>
                      <p className="text-xs text-slate-500">{m.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
