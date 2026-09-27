"""
Numerical Differentiation
Supports Forward, Backward, and Central difference formulas.
Uses SymPy to parse expressions and compute exact derivatives for comparison.
"""
import sympy as sp
from typing import Optional


def numerical_differentiation(
    func_str: str,
    x_val: float,
    h: float,
    method: str = "central"  # "forward", "backward", "central"
) -> dict:
    if abs(h) < 1e-15:
        raise ValueError("Step size h must not be zero.")

    x = sp.Symbol('x')
    try:
        expr = sp.sympify(func_str, locals={"x": x})
    except Exception:
        raise ValueError(f"Cannot parse function: '{func_str}'. Use standard math notation.")

    def f(val):
        return float(expr.subs(x, val))

    try:
        fx = f(x_val)
        fx_ph = f(x_val + h)
        fx_mh = f(x_val - h)
    except Exception as e:
        raise ValueError(f"Error evaluating function: {e}")

    method = method.lower()
    if method == "forward":
        derivative = (fx_ph - fx) / h
        formula = "f'(x) ≈ [f(x+h) - f(x)] / h"
        substituted = f"[f({x_val}+{h}) - f({x_val})] / {h} = [{round(fx_ph,6)} - {round(fx,6)}] / {h}"
        order = "O(h) — First order"
    elif method == "backward":
        derivative = (fx - fx_mh) / h
        formula = "f'(x) ≈ [f(x) - f(x-h)] / h"
        substituted = f"[f({x_val}) - f({x_val}-{h})] / {h} = [{round(fx,6)} - {round(fx_mh,6)}] / {h}"
        order = "O(h) — First order"
    elif method == "central":
        derivative = (fx_ph - fx_mh) / (2 * h)
        formula = "f'(x) ≈ [f(x+h) - f(x-h)] / (2h)"
        substituted = f"[f({x_val}+{h}) - f({x_val}-{h})] / (2×{h}) = [{round(fx_ph,6)} - {round(fx_mh,6)}] / {2*h}"
        order = "O(h²) — Second order"
    else:
        raise ValueError("method must be 'forward', 'backward', or 'central'.")

    # Exact derivative using SymPy
    try:
        exact_expr = sp.diff(expr, x)
        exact_val = float(exact_expr.subs(x, x_val))
        exact_formula = str(exact_expr)
        abs_error = abs(derivative - exact_val)
        rel_error = abs_error / abs(exact_val) * 100 if abs(exact_val) > 1e-12 else None
    except Exception:
        exact_val = None
        exact_formula = "Could not compute"
        abs_error = None
        rel_error = None

    # Build curve data
    x_range_start = x_val - max(10 * h, 1.0)
    x_range_end = x_val + max(10 * h, 1.0)
    curve = _build_curve(expr, x, x_range_start, x_range_end, 80)

    return {
        "method": method,
        "function": func_str,
        "x_val": x_val,
        "h": h,
        "f_x": round(fx, 8),
        "f_x_plus_h": round(fx_ph, 8),
        "f_x_minus_h": round(fx_mh, 8),
        "formula": formula,
        "substituted": substituted,
        "derivative": round(float(derivative), 8),
        "order": order,
        "exact_formula": exact_formula,
        "exact_value": round(float(exact_val), 8) if exact_val is not None else None,
        "absolute_error": round(float(abs_error), 8) if abs_error is not None else None,
        "relative_error_pct": round(float(rel_error), 6) if rel_error is not None else None,
        "curve": curve
    }


def _build_curve(expr, x_sym, x_min, x_max, num_pts):
    step = (x_max - x_min) / (num_pts - 1)
    pts = []
    for k in range(num_pts):
        xv = x_min + k * step
        try:
            yv = float(expr.subs(x_sym, xv))
            pts.append({"x": round(xv, 5), "y": round(yv, 6)})
        except Exception:
            pass
    return pts
