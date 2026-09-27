/**
 * API service — all calls to the FastAPI backend.
 * The Vite proxy forwards /moduleN requests to http://localhost:8000
 */

const API_BASE = '';  // Use Vite proxy

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail ?? `HTTP ${res.status}`);
  }
  return json;
}

// ─── Module I ────────────────────────────────────────────────────────────────

export const solveGaussJordan = (body: unknown) =>
  post('/module1/gauss-jordan', body);

export const solveGaussJacobi = (body: unknown) =>
  post('/module1/gauss-jacobi', body);

export const solveGaussSeidel = (body: unknown) =>
  post('/module1/gauss-seidel', body);

// ─── Module II ───────────────────────────────────────────────────────────────

export const solveLagrange = (body: unknown) =>
  post('/module2/lagrange', body);

export const solveCubicSpline = (body: unknown) =>
  post('/module2/cubic-spline', body);

export const solveLeastSquares = (body: unknown) =>
  post('/module2/least-squares', body);

// ─── Module III ──────────────────────────────────────────────────────────────

export const solveDifferentiation = (body: unknown) =>
  post('/module3/differentiation', body);

export const solveTrapezoidal = (body: unknown) =>
  post('/module3/trapezoidal', body);

export const solveSimpsons = (body: unknown) =>
  post('/module3/simpsons', body);

// ─── Module IV ───────────────────────────────────────────────────────────────

export const solveEuler = (body: unknown) =>
  post('/module4/euler', body);

export const solveModifiedEuler = (body: unknown) =>
  post('/module4/modified-euler', body);

export const solveRK4 = (body: unknown) =>
  post('/module4/rk4', body);

// ─── Module V ────────────────────────────────────────────────────────────────

export const solveBVP = (body: unknown) =>
  post('/module5/bvp', body);

export const solveLaplace = (body: unknown) =>
  post('/module5/laplace', body);

export const solveHeatEquation = (body: unknown) =>
  post('/module5/heat-equation', body);
