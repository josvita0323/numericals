"""
Lagrange Interpolation
Given n data points, construct the Lagrange polynomial and evaluate at x_target.
"""
from typing import List
import sympy as sp


def lagrange_interpolation(
    x_data: List[float],
    y_data: List[float],
    x_target: float
) -> dict:
    n = len(x_data)
    if len(y_data) != n:
        raise ValueError("x and y data must have the same length.")
    if len(set(x_data)) != n:
        raise ValueError("All x values must be distinct.")
    if n < 2:
        raise ValueError("At least 2 data points are required.")

    x = sp.Symbol('x')
    basis_terms = []
    contributions = []
    total = 0.0

    for i in range(n):
        # Compute L_i(x_target) numerically
        Li_val = 1.0
        numerator_parts = []
        denominator_parts = []
        for j in range(n):
            if j != i:
                Li_val *= (x_target - x_data[j]) / (x_data[i] - x_data[j])
                numerator_parts.append(f"(x - {x_data[j]})")
                denominator_parts.append(f"({x_data[i]} - {x_data[j]})")

        contribution = Li_val * y_data[i]
        total += contribution

        numerator_str = " × ".join(numerator_parts)
        denominator_str = " × ".join(denominator_parts)

        basis_terms.append({
            "index": i,
            "label": f"L{i}(x)",
            "numerator": numerator_str,
            "denominator": denominator_str,
            "value_at_target": round(float(Li_val), 8),
            "y_i": y_data[i],
            "contribution": round(float(contribution), 8)
        })
        contributions.append(round(float(contribution), 8))

    # Build curve data for plotting
    x_min = min(x_data) - (max(x_data) - min(x_data)) * 0.1
    x_max = max(x_data) + (max(x_data) - min(x_data)) * 0.1
    curve_points = _build_curve(x_data, y_data, x_min, x_max, 80)

    return {
        "x_target": x_target,
        "result": round(float(total), 8),
        "basis_terms": basis_terms,
        "contributions": contributions,
        "data_points": [{"x": x_data[i], "y": y_data[i]} for i in range(n)],
        "curve": curve_points
    }


def _evaluate_lagrange(x_data, y_data, x_val):
    n = len(x_data)
    total = 0.0
    for i in range(n):
        Li = 1.0
        for j in range(n):
            if j != i:
                denom = x_data[i] - x_data[j]
                if abs(denom) < 1e-15:
                    continue
                Li *= (x_val - x_data[j]) / denom
        total += Li * y_data[i]
    return total


def _build_curve(x_data, y_data, x_min, x_max, num_pts):
    step = (x_max - x_min) / (num_pts - 1)
    pts = []
    for k in range(num_pts):
        xv = x_min + k * step
        yv = _evaluate_lagrange(x_data, y_data, xv)
        pts.append({"x": round(xv, 6), "y": round(float(yv), 6)})
    return pts
