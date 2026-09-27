"""
Natural Cubic Spline Interpolation
Given n data points, construct the natural cubic spline and evaluate at x_target.
The spline is C2 continuous with zero second derivatives at endpoints.
"""
import numpy as np
from typing import List


def cubic_spline(
    x_data: List[float],
    y_data: List[float],
    x_target: float
) -> dict:
    n = len(x_data)
    if len(y_data) != n:
        raise ValueError("x and y data must have the same length.")
    if n < 3:
        raise ValueError("At least 3 data points are required for cubic spline.")
    
    # Sort by x
    pairs = sorted(zip(x_data, y_data), key=lambda p: p[0])
    x = np.array([p[0] for p in pairs], dtype=float)
    y = np.array([p[1] for p in pairs], dtype=float)

    if len(set(x)) != n:
        raise ValueError("All x values must be distinct.")

    if x_target < x[0] or x_target > x[-1]:
        raise ValueError(
            f"x_target={x_target} is outside the data range [{x[0]}, {x[-1]}]."
        )

    m = n - 1  # number of intervals
    h = np.diff(x)  # h[i] = x[i+1] - x[i]

    # Build tridiagonal system for natural cubic spline
    # Natural conditions: M[0] = M[n-1] = 0
    # System size: (n-2) x (n-2)
    size = n - 2
    M = np.zeros(n)

    if size > 0:
        # Tridiagonal matrix coefficients
        diag = np.array([2 * (h[i] + h[i + 1]) for i in range(size)])
        lower = np.array([h[i + 1] for i in range(size - 1)])
        upper = np.array([h[i + 1] for i in range(size - 1)])
        rhs = np.array([
            6 * ((y[i + 2] - y[i + 1]) / h[i + 1] - (y[i + 1] - y[i]) / h[i])
            for i in range(size)
        ])

        # Thomas algorithm (tridiagonal solver) - manual implementation
        M_inner = _thomas_algorithm(diag, lower, upper, rhs)
        M[1:-1] = M_inner

    # Spline coefficients for each interval
    # S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3
    coefficients = []
    for i in range(m):
        a = y[i]
        b = (y[i + 1] - y[i]) / h[i] - h[i] * (2 * M[i] + M[i + 1]) / 6
        c = M[i] / 2
        d = (M[i + 1] - M[i]) / (6 * h[i])
        coefficients.append({
            "interval": f"[{round(float(x[i]), 4)}, {round(float(x[i+1]), 4)}]",
            "a": round(float(a), 8),
            "b": round(float(b), 8),
            "c": round(float(c), 8),
            "d": round(float(d), 8)
        })

    # Evaluate at x_target
    seg = _find_segment(x, x_target, m)
    dx = x_target - x[seg]
    a = coefficients[seg]["a"]
    b = coefficients[seg]["b"]
    c = coefficients[seg]["c"]
    d = coefficients[seg]["d"]
    result = a + b * dx + c * dx**2 + d * dx**3

    # Build curve
    curve = _build_curve(x, coefficients, m, 80)

    return {
        "x_target": x_target,
        "result": round(float(result), 8),
        "n_intervals": m,
        "h_values": [round(float(v), 6) for v in h],
        "M_values": [round(float(v), 8) for v in M],
        "coefficients": coefficients,
        "segment_used": seg,
        "data_points": [{"x": round(float(x[i]), 6), "y": round(float(y[i]), 6)} for i in range(n)],
        "curve": curve
    }


def _thomas_algorithm(diag, lower, upper, rhs):
    """Forward sweep and back substitution for tridiagonal system."""
    n = len(diag)
    d = diag.copy().astype(float)
    r = rhs.copy().astype(float)
    u = upper.copy().astype(float)
    l = lower.copy().astype(float)

    # Forward elimination
    for i in range(1, n):
        factor = l[i - 1] / d[i - 1]
        d[i] -= factor * u[i - 1]
        r[i] -= factor * r[i - 1]

    # Back substitution
    x = np.zeros(n)
    x[-1] = r[-1] / d[-1]
    for i in range(n - 2, -1, -1):
        x[i] = (r[i] - u[i] * x[i + 1]) / d[i]
    return x


def _find_segment(x, x_target, m):
    for i in range(m - 1):
        if x_target <= x[i + 1]:
            return i
    return m - 1


def _build_curve(x, coefficients, m, num_pts):
    x_min = float(x[0])
    x_max = float(x[-1])
    step = (x_max - x_min) / (num_pts - 1)
    pts = []
    for k in range(num_pts):
        xv = x_min + k * step
        seg = _find_segment(x, xv, m)
        dx = xv - x[seg]
        a = coefficients[seg]["a"]
        b = coefficients[seg]["b"]
        c = coefficients[seg]["c"]
        d = coefficients[seg]["d"]
        yv = a + b * dx + c * dx**2 + d * dx**3
        pts.append({"x": round(xv, 6), "y": round(float(yv), 6)})
    return pts
