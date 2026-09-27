# Numerical Methods Learning Lab

An interactive, full-stack educational web application implementing **15 classical numerical methods** across **5 core modules** of Computational Mathematics and Numerical Analysis.

Designed with a modern **React 19 + TypeScript** frontend and a high-performance **FastAPI (Python 3.12)** computational backend.

---

## 🚀 Features

- **15 Numerical Algorithms** with step-by-step intermediate calculations.
- **Analytical Error Assessment:** Uses **SymPy** for exact symbolic solutions and error percentage tracking.
- **Dynamic Visualizations:** Interactive charts and curves built with **Recharts**.
- **LaTeX Math Equations:** Crisp formula rendering powered by **KaTeX**.
- **Comparative Analysis Tool:** Side-by-side solver comparisons (Jacobi vs. Seidel, Trapezoid vs. Simpson, Euler vs. Heun vs. RK4).
- **Automated Tests:** Comprehensive **Pytest** test suite verifying algorithm correctness.

---

## 📚 Modules & Algorithms

### Module I: Linear Systems ($A\mathbf{x} = \mathbf{b}$)
- **Gauss–Jordan Elimination:** Direct row reduction to Reduced Row Echelon Form (RREF).
- **Gauss–Jacobi Iteration:** Simultaneous updates with diagonal dominance diagnostics.
- **Gauss–Seidel Iteration:** Successive updates with accelerated convergence.

### Module II: Interpolation & Curve Fitting
- **Lagrange Interpolation:** Arbitrary-spaced node interpolation with explicit basis polynomials.
- **Natural Cubic Spline:** $C^2$-continuous piecewise cubic curves.
- **Least Squares Approximation:** Linear ($y = mx + c$) and quadratic curve fitting ($R^2$ evaluation).

### Module III: Numerical Differentiation & Quadrature
- **Numerical Differentiation:** Forward, backward, and central finite difference formulas.
- **Trapezoidal Rule:** Composite numerical integration ($O(h^2)$).
- **Simpson’s 1/3 Rule:** Composite parabolic integration ($O(h^4)$).

### Module IV: Ordinary Differential Equations (ODEs)
- **Euler’s Method:** Standard first-order initial value problem solver.
- **Modified Euler (Heun's):** Predictor-corrector scheme ($O(h^2)$).
- **Runge-Kutta 4th Order (RK4):** Classical 4th-order weighted slope method ($O(h^4)$).

### Module V: Boundary Value Problems & PDEs
- **Two-Point Boundary Value Problem (BVP):** Finite difference tridiagonal linear system.
- **Laplace’s Equation (2D Elliptic PDE):** 5-point Liebmann / Gauss-Seidel steady-state solver.
- **1D Transient Heat Equation (Parabolic PDE):** Explicit FTCS finite-difference scheme.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts, KaTeX, Lucide React
- **Backend:** Python 3.12, FastAPI, NumPy, SymPy, Pydantic v2, Pytest, Uvicorn

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Documentation (Swagger): `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### 3. Run Automated Tests
```bash
cd backend
pytest tests/ -v
```

---

## 📄 License
MIT License
