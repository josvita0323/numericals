"""
Two-Point Boundary Value Problem (BVP) using Finite Differences
Solves: y'' + P(x)y' + Q(x)y = R(x)
with y(a) = alpha, y(b) = beta.

Uses central difference approximations:
  y'' ≈ (y_{i-1} - 2y_i + y_{i+1}) / h²
  y'  ≈ (y_{i+1} - y_{i-1}) / (2h)
"""
import sympy as sp
import numpy as np
from typing import Optional


def bvp_finite_difference(
    p_str: str,
    q_str: str,
    r_str: str,
    a: float,
    b: float,
    alpha: float,
    beta: float,
    n: int
) -> dict:
    if a >= b:
        raise ValueError("a must be less than b.")
    if n < 2:
        raise ValueError("n must be at least 2.")
    if n > 100:
        raise ValueError("n must be ≤ 100 for manageable output.")

    x_sym = sp.Symbol('x')
    try:
        P_expr = sp.sympify(p_str, locals={"x": x_sym})
        Q_expr = sp.sympify(q_str, locals={"x": x_sym})
        R_expr = sp.sympify(r_str, locals={"x": x_sym})
    except Exception:
        raise ValueError("Cannot parse P(x), Q(x), or R(x).")

    def P(val): return float(P_expr.subs(x_sym, val))
    def Q(val): return float(Q_expr.subs(x_sym, val))
    def R(val): return float(R_expr.subs(x_sym, val))

    h = (b - a) / n
    x_vals = [a + i * h for i in range(n + 1)]

    # Internal nodes: i = 1, ..., n-1
    m = n - 1  # number of internal nodes

    # Build tridiagonal system
    A_mat = np.zeros((m, m))
    b_vec = np.zeros(m)

    equations = []
    for i in range(1, n):
        xi = x_vals[i]
        pi = P(xi)
        qi = Q(xi)
        ri = R(xi)

        ai = 1 / h**2 - pi / (2 * h)   # coefficient of y_{i-1}
        bi = -2 / h**2 + qi             # coefficient of y_i
        ci = 1 / h**2 + pi / (2 * h)   # coefficient of y_{i+1}

        row = i - 1
        if row > 0:
            A_mat[row, row - 1] = ai
        A_mat[row, row] = bi
        if row < m - 1:
            A_mat[row, row + 1] = ci

        # Move boundary contributions to RHS
        rhs = ri
        if i == 1:
            rhs -= ai * alpha
        if i == n - 1:
            rhs -= ci * beta
        b_vec[row] = rhs

        equations.append({
            "i": i,
            "x_i": round(xi, 6),
            "coeff_prev": round(ai, 6),
            "coeff_curr": round(bi, 6),
            "coeff_next": round(ci, 6),
            "rhs": round(rhs, 6)
        })

    # Solve using Thomas algorithm (tridiagonal)
    diag = np.diag(A_mat).copy()
    lower = np.diag(A_mat, -1).copy()
    upper = np.diag(A_mat, 1).copy()
    y_inner = _thomas(diag, lower, upper, b_vec)

    # Full solution
    y_full = np.concatenate([[alpha], y_inner, [beta]])

    solution_points = [
        {"x": round(x_vals[i], 8), "y": round(float(y_full[i]), 8)}
        for i in range(n + 1)
    ]

    return {
        "p_func": p_str,
        "q_func": q_str,
        "r_func": r_str,
        "a": a,
        "b": b,
        "alpha": alpha,
        "beta": beta,
        "n": n,
        "h": round(h, 8),
        "equations": equations,
        "solution": solution_points,
        "curve": solution_points
    }


def _thomas(diag, lower, upper, rhs):
    n = len(diag)
    d = diag.copy().astype(float)
    r = rhs.copy().astype(float)
    l = lower.copy().astype(float)
    u = upper.copy().astype(float)

    for i in range(1, n):
        if abs(d[i - 1]) < 1e-15:
            raise ValueError("Singular system in BVP solver.")
        factor = l[i - 1] / d[i - 1]
        d[i] -= factor * u[i - 1]
        r[i] -= factor * r[i - 1]

    x = np.zeros(n)
    x[-1] = r[-1] / d[-1]
    for i in range(n - 2, -1, -1):
        x[i] = (r[i] - u[i] * x[i + 1]) / d[i]
    return x
