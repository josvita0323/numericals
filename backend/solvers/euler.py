"""
Euler's Method for ODE: dy/dx = f(x,y)
y_{n+1} = y_n + h * f(x_n, y_n)
"""
import sympy as sp
import numpy as np
from typing import Optional


def euler_method(
    func_str: str,
    x0: float,
    y0: float,
    h: float,
    x_end: float
) -> dict:
    if abs(h) < 1e-15:
        raise ValueError("Step size h must not be zero.")
    if x_end <= x0:
        raise ValueError("x_end must be greater than x0.")
    if h <= 0:
        raise ValueError("Step size h must be positive.")

    n_steps = int(round((x_end - x0) / h))
    if n_steps > 1000:
        raise ValueError("Too many steps (>1000). Increase step size h.")
    if n_steps < 1:
        raise ValueError("Step size h is too large — no steps would be taken.")

    x_sym, y_sym = sp.symbols('x y')
    try:
        expr = sp.sympify(func_str, locals={"x": x_sym, "y": y_sym})
    except Exception:
        raise ValueError(f"Cannot parse function: '{func_str}'. Use variables x and y.")

    def f(xv, yv):
        return float(expr.subs([(x_sym, xv), (y_sym, yv)]))

    iterations = []
    x_cur = x0
    y_cur = y0

    for step in range(n_steps):
        try:
            fval = f(x_cur, y_cur)
        except Exception as e:
            raise ValueError(f"Error evaluating f({x_cur}, {y_cur}): {e}")
        y_next = y_cur + h * fval
        iterations.append({
            "n": step,
            "x_n": round(x_cur, 8),
            "y_n": round(y_cur, 8),
            "f_xn_yn": round(fval, 8),
            "y_next": round(y_next, 8)
        })
        x_cur = round(x_cur + h, 10)
        y_cur = y_next

    # Final point
    iterations.append({
        "n": n_steps,
        "x_n": round(x_cur, 8),
        "y_n": round(y_cur, 8),
        "f_xn_yn": None,
        "y_next": None
    })

    solution_curve = [{"x": it["x_n"], "y": it["y_n"]} for it in iterations]

    return {
        "method": "Euler's Method",
        "function": func_str,
        "x0": x0,
        "y0": y0,
        "h": h,
        "x_end": x_end,
        "n_steps": n_steps,
        "iterations": iterations,
        "final_x": round(x_cur, 8),
        "final_y": round(y_cur, 8),
        "curve": solution_curve
    }
