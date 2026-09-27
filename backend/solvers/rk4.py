"""
4th-Order Runge-Kutta Method (RK4)
k1 = h·f(x_n, y_n)
k2 = h·f(x_n + h/2, y_n + k1/2)
k3 = h·f(x_n + h/2, y_n + k2/2)
k4 = h·f(x_n + h,   y_n + k3)
y_{n+1} = y_n + (k1 + 2k2 + 2k3 + k4) / 6
"""
import sympy as sp


def rk4(
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
        raise ValueError("Step size h is too large.")

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
            k1 = h * f(x_cur, y_cur)
            k2 = h * f(x_cur + h / 2, y_cur + k1 / 2)
            k3 = h * f(x_cur + h / 2, y_cur + k2 / 2)
            k4 = h * f(x_cur + h, y_cur + k3)
        except Exception as e:
            raise ValueError(f"Error computing RK4 at step {step}: {e}")

        y_next = y_cur + (k1 + 2 * k2 + 2 * k3 + k4) / 6

        iterations.append({
            "n": step,
            "x_n": round(x_cur, 8),
            "y_n": round(y_cur, 8),
            "k1": round(k1, 8),
            "k2": round(k2, 8),
            "k3": round(k3, 8),
            "k4": round(k4, 8),
            "weighted_avg": round((k1 + 2 * k2 + 2 * k3 + k4) / 6, 8),
            "y_next": round(y_next, 8)
        })

        x_cur = round(x_cur + h, 10)
        y_cur = y_next

    # Final point
    iterations.append({
        "n": n_steps,
        "x_n": round(x_cur, 8),
        "y_n": round(y_cur, 8),
        "k1": None, "k2": None, "k3": None, "k4": None,
        "weighted_avg": None,
        "y_next": None
    })

    curve = [{"x": it["x_n"], "y": it["y_n"]} for it in iterations]

    return {
        "method": "4th-Order Runge-Kutta (RK4)",
        "function": func_str,
        "x0": x0,
        "y0": y0,
        "h": h,
        "x_end": x_end,
        "n_steps": n_steps,
        "iterations": iterations,
        "final_x": round(x_cur, 8),
        "final_y": round(y_cur, 8),
        "curve": curve
    }
