"""
Least Squares Curve Fitting
Supports linear (y = a + bx) and quadratic (y = a + bx + cx²) fits.
Normal equations are set up and solved manually (Gauss elimination).
"""
import numpy as np
from typing import List


def least_squares(
    x_data: List[float],
    y_data: List[float],
    degree: int = 1  # 1 for linear, 2 for quadratic
) -> dict:
    n = len(x_data)
    if len(y_data) != n:
        raise ValueError("x and y data must have same length.")
    if n < degree + 2:
        raise ValueError(f"Need at least {degree + 2} data points for degree-{degree} fit.")
    if degree not in (1, 2):
        raise ValueError("Degree must be 1 (linear) or 2 (quadratic).")

    x = np.array(x_data, dtype=float)
    y = np.array(y_data, dtype=float)

    # Build normal equations matrix [A | b]
    # For degree d, we need sums: Σ1, Σx, Σx², ..., Σx^(2d)
    # and Σy, Σxy, Σx²y, ...
    d = degree
    m = d + 1  # number of coefficients

    # Compute necessary sums
    sums = {}
    for k in range(2 * d + 1):
        sums[f"x^{k}"] = float(np.sum(x**k))
    for k in range(d + 1):
        sums[f"x^{k}y"] = float(np.sum(x**k * y))

    # Build normal equation matrix
    A_mat = np.zeros((m, m))
    b_vec = np.zeros(m)
    for i in range(m):
        for j in range(m):
            A_mat[i, j] = sums[f"x^{i+j}"]
        b_vec[i] = sums[f"x^{i}y"]

    # Display normal equations as strings
    normal_eq_strings = _format_normal_equations(A_mat, b_vec, m)

    # Solve using Gaussian elimination (manual)
    coeffs = _gauss_elim(A_mat.copy(), b_vec.copy())

    # Compute fitted values and residuals
    fitted = []
    residuals = []
    for i in range(n):
        yp = sum(coeffs[k] * x[i]**k for k in range(m))
        fitted.append(round(float(yp), 6))
        residuals.append(round(float(y[i] - yp), 6))

    # SSE and R²
    ss_res = float(np.sum(np.array(residuals)**2))
    ss_tot = float(np.sum((y - np.mean(y))**2))
    r_squared = 1 - ss_res / ss_tot if ss_tot > 1e-15 else 1.0

    # Equation string
    equation = _equation_string(coeffs, degree)

    # Curve
    curve = _build_curve(coeffs, x_data, 80)

    return {
        "degree": degree,
        "n_points": n,
        "sums": {k: round(v, 6) for k, v in sums.items()},
        "normal_equations": normal_eq_strings,
        "coefficients": {chr(97 + k): round(float(coeffs[k]), 8) for k in range(m)},
        "equation": equation,
        "fitted_values": [
            {"x": x_data[i], "y_actual": y_data[i], "y_fitted": fitted[i], "residual": residuals[i]}
            for i in range(n)
        ],
        "sse": round(ss_res, 8),
        "r_squared": round(r_squared, 6),
        "data_points": [{"x": x_data[i], "y": y_data[i]} for i in range(n)],
        "curve": curve
    }


def _gauss_elim(A, b):
    n = len(b)
    aug = np.hstack([A, b.reshape(-1, 1)]).astype(float)
    for col in range(n):
        # Partial pivoting
        max_r = col + np.argmax(np.abs(aug[col:, col]))
        aug[[col, max_r]] = aug[[max_r, col]]
        for row in range(col + 1, n):
            if abs(aug[col, col]) < 1e-15:
                raise ValueError("Singular normal equations matrix.")
            factor = aug[row, col] / aug[col, col]
            aug[row] -= factor * aug[col]
    # Back substitution
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (aug[i, n] - sum(aug[i, j] * x[j] for j in range(i + 1, n))) / aug[i, i]
    return x


def _format_normal_equations(A, b, m):
    eqs = []
    labels = list("abcdefg")
    for i in range(m):
        parts = []
        for j in range(m):
            parts.append(f"{round(float(A[i,j]),4)}·{labels[j]}")
        eqs.append(" + ".join(parts) + f" = {round(float(b[i]),4)}")
    return eqs


def _equation_string(coeffs, degree):
    labels = ["a", "b", "c"]
    terms = [f"{round(float(coeffs[0]),4)}"]
    for k in range(1, degree + 1):
        c = round(float(coeffs[k]), 4)
        xpow = "x" if k == 1 else f"x^{k}"
        sign = "+" if c >= 0 else "-"
        terms.append(f"{sign} {abs(c)}{xpow}")
    return "y = " + " ".join(terms)


def _build_curve(coeffs, x_data, num_pts):
    x_min = min(x_data) - (max(x_data) - min(x_data)) * 0.1
    x_max = max(x_data) + (max(x_data) - min(x_data)) * 0.1
    step = (x_max - x_min) / (num_pts - 1)
    m = len(coeffs)
    pts = []
    for k in range(num_pts):
        xv = x_min + k * step
        yv = sum(coeffs[j] * xv**j for j in range(m))
        pts.append({"x": round(xv, 6), "y": round(float(yv), 6)})
    return pts
