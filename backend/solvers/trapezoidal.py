"""
Trapezoidal Rule for Numerical Integration
∫[a,b] f(x) dx ≈ (h/2)[f(x0) + 2f(x1) + ... + 2f(xn-1) + f(xn)]
"""
import sympy as sp
from typing import Optional


def trapezoidal(
    func_str: str,
    a: float,
    b: float,
    n: int
) -> dict:
    if a >= b:
        raise ValueError("Lower limit a must be less than upper limit b.")
    if n < 1:
        raise ValueError("Number of subintervals n must be at least 1.")

    x = sp.Symbol('x')
    try:
        expr = sp.sympify(func_str, locals={"x": x})
    except Exception:
        raise ValueError(f"Cannot parse function: '{func_str}'.")

    def f(val):
        return float(expr.subs(x, val))

    h = (b - a) / n

    # Compute x_i and f(x_i)
    x_vals = [a + i * h for i in range(n + 1)]
    try:
        f_vals = [f(xv) for xv in x_vals]
    except Exception as e:
        raise ValueError(f"Error evaluating function: {e}")

    # Coefficients: 1, 2, 2, ..., 2, 1
    coefficients = [1] + [2] * (n - 1) + [1]

    # Weighted sum
    weighted_sum = sum(coefficients[i] * f_vals[i] for i in range(n + 1))
    result = (h / 2) * weighted_sum

    # Build table
    table = [
        {
            "i": i,
            "x": round(x_vals[i], 8),
            "fx": round(f_vals[i], 8),
            "coefficient": coefficients[i],
            "weighted": round(coefficients[i] * f_vals[i], 8)
        }
        for i in range(n + 1)
    ]

    # Exact value using SymPy
    exact_val = None
    abs_error = None
    try:
        exact_expr = sp.integrate(expr, (x, a, b))
        exact_val = float(exact_expr)
        abs_error = abs(result - exact_val)
    except Exception:
        pass

    # Formula string
    formula_str = f"(h/2)[f(x₀) + 2f(x₁) + ... + 2f(x{n-1}) + f(x{n})]"
    calculation_str = (
        f"h = ({b} - {a}) / {n} = {round(h, 6)}\n"
        f"Σ weighted = {round(weighted_sum, 8)}\n"
        f"Result = ({round(h,6)}/2) × {round(weighted_sum,8)} = {round(result, 8)}"
    )

    # Curve for plot
    curve = _build_curve(expr, x, a, b, 80)

    return {
        "function": func_str,
        "a": a,
        "b": b,
        "n": n,
        "h": round(h, 8),
        "table": table,
        "formula": formula_str,
        "calculation": calculation_str,
        "weighted_sum": round(weighted_sum, 8),
        "result": round(result, 8),
        "exact_value": round(exact_val, 8) if exact_val is not None else None,
        "absolute_error": round(abs_error, 8) if abs_error is not None else None,
        "curve": curve,
        "x_vals": [round(v, 6) for v in x_vals],
        "f_vals": [round(v, 8) for v in f_vals]
    }


def _build_curve(expr, x_sym, a, b, num_pts):
    step = (b - a) / (num_pts - 1)
    pts = []
    for k in range(num_pts):
        xv = a + k * step
        try:
            yv = float(expr.subs(x_sym, xv))
            pts.append({"x": round(xv, 6), "y": round(yv, 6)})
        except Exception:
            pass
    return pts
