import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Pages
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ComparePage from './pages/ComparePage';

// Module I
import GaussJordanPage from './pages/module1/GaussJordanPage';
import GaussJacobiPage from './pages/module1/GaussJacobiPage';
import GaussSeidelPage from './pages/module1/GaussSeidelPage';

// Module II
import LagrangePage from './pages/module2/LagrangePage';
import CubicSplinePage from './pages/module2/CubicSplinePage';
import LeastSquaresPage from './pages/module2/LeastSquaresPage';

// Module III
import DifferentiationPage from './pages/module3/DifferentiationPage';
import TrapezoidalPage from './pages/module3/TrapezoidalPage';
import SimpsonsPage from './pages/module3/SimpsonsPage';

// Module IV
import EulerPage from './pages/module4/EulerPage';
import ModifiedEulerPage from './pages/module4/ModifiedEulerPage';
import RK4Page from './pages/module4/RK4Page';

// Module V
import BVPPage from './pages/module5/BVPPage';
import LaplacePage from './pages/module5/LaplacePage';
import HeatEquationPage from './pages/module5/HeatEquationPage';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />
      <main className="ml-60 flex-1 p-6 md:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/compare" element={<ComparePage />} />

            {/* Module I */}
            <Route path="/gauss-jordan" element={<GaussJordanPage />} />
            <Route path="/gauss-jacobi" element={<GaussJacobiPage />} />
            <Route path="/gauss-seidel" element={<GaussSeidelPage />} />

            {/* Module II */}
            <Route path="/lagrange" element={<LagrangePage />} />
            <Route path="/cubic-spline" element={<CubicSplinePage />} />
            <Route path="/least-squares" element={<LeastSquaresPage />} />

            {/* Module III */}
            <Route path="/differentiation" element={<DifferentiationPage />} />
            <Route path="/trapezoidal" element={<TrapezoidalPage />} />
            <Route path="/simpsons" element={<SimpsonsPage />} />

            {/* Module IV */}
            <Route path="/euler" element={<EulerPage />} />
            <Route path="/modified-euler" element={<ModifiedEulerPage />} />
            <Route path="/rk4" element={<RK4Page />} />

            {/* Module V */}
            <Route path="/bvp" element={<BVPPage />} />
            <Route path="/laplace" element={<LaplacePage />} />
            <Route path="/heat-equation" element={<HeatEquationPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
