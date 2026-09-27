import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  TrendingUp,
  Divide,
  GitBranch,
  Grid3X3,
  ChevronRight,
  Calculator,
  Info,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  indent?: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  color: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Module I',
    icon: <FlaskConical size={16} />,
    color: 'text-blue-400',
    items: [
      { label: 'Gauss–Jordan', to: '/gauss-jordan', indent: true },
      { label: 'Gauss–Jacobi', to: '/gauss-jacobi', indent: true },
      { label: 'Gauss–Seidel', to: '/gauss-seidel', indent: true },
    ],
  },
  {
    label: 'Module II',
    icon: <TrendingUp size={16} />,
    color: 'text-purple-400',
    items: [
      { label: 'Lagrange', to: '/lagrange', indent: true },
      { label: 'Cubic Spline', to: '/cubic-spline', indent: true },
      { label: 'Least Squares', to: '/least-squares', indent: true },
    ],
  },
  {
    label: 'Module III',
    icon: <Divide size={16} />,
    color: 'text-emerald-400',
    items: [
      { label: 'Differentiation', to: '/differentiation', indent: true },
      { label: 'Trapezoidal Rule', to: '/trapezoidal', indent: true },
      { label: "Simpson's 1/3", to: '/simpsons', indent: true },
    ],
  },
  {
    label: 'Module IV',
    icon: <GitBranch size={16} />,
    color: 'text-amber-400',
    items: [
      { label: "Euler's Method", to: '/euler', indent: true },
      { label: 'Modified Euler', to: '/modified-euler', indent: true },
      { label: 'RK4 Method', to: '/rk4', indent: true },
    ],
  },
  {
    label: 'Module V',
    icon: <Grid3X3 size={16} />,
    color: 'text-rose-400',
    items: [
      { label: 'Two-Point BVP', to: '/bvp', indent: true },
      { label: 'Laplace Equation', to: '/laplace', indent: true },
      { label: 'Heat Equation', to: '/heat-equation', indent: true },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-dark-800 border-r border-dark-600 flex flex-col z-40 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-dark-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg">
            <Calculator size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Numerical</h1>
            <h1 className="text-sm font-bold text-primary-400 leading-tight">Methods Lab</h1>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              isActive
                ? 'bg-primary-600/20 text-primary-300 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700'
            }`
          }
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${group.color}`}>
              {group.icon}
              {group.label}
            </div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 font-medium'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-dark-700'
                  }`
                }
              >
                <ChevronRight size={12} className="opacity-50" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Comparison */}
        <div className="mt-3">
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BarChart3 size={16} />
            Tools
          </div>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-primary-600/20 text-primary-300 font-medium'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-dark-700'
              }`
            }
          >
            <ChevronRight size={12} className="opacity-50" />
            Compare Methods
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-primary-600/20 text-primary-300 font-medium'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-dark-700'
              }`
            }
          >
            <ChevronRight size={12} className="opacity-50" />
            About
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-dark-600">
        <p className="text-xs text-slate-600">7th Sem CSE Project</p>
        <p className="text-xs text-slate-700">5 Modules · 15 Methods</p>
      </div>
    </aside>
  );
}
