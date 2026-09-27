"""
Modified Euler's Method (Heun's Method / Predictor-Corrector)
Predictor:  y*_{n+1} = y_n + h * f(x_n, y_n)
Corrector:  y_{n+1}  = y_n + (h/2) * [f(x_n, y_n) + f(x_{n+1}, y*_{n+1})]
"""
import sympy as sp


def modified_euler(
    func_str: str,
    x0: float,
    y0: float,
    h: float,
    x_end: float,
    max_corrector_iterations: int = 3,
    corrector_tolerance: float = 1e-6
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
        f0 = f(x_cur, y_cur)
        x_next = round(x_cur + h, 10)

        # Predictor (Euler step)
        y_pred = y_cur + h * f0

        # Corrector iterations
        corrector_steps = []
        y_corr = y_pred
        for ci in range(max_corrector_iterations):
            f1 = f(x_next, y_corr)
            y_corr_new = y_cur + (h / 2) * (f0 + f1)
            corr_error = abs(y_corr_new - y_corr)
            corrector_steps.append({
                "corrector_iter": ci + 1,
                "y_corr": round(y_corr_new, 8),
                "f1": round(f1, 8),
                "error": round(corr_error, 10)
            })
            y_corr = y_corr_new
            if corr_error < corrector_tolerance:
                break

        iterations.append({
            "n": step,
            "x_n": round(x_cur, 8),
            "y_n": round(y_cur, 8),
            "f_xn_yn": round(f0, 8),
            "y_predictor": round(y_pred, 8),
            "corrector_steps": corrector_steps,
            "y_corrected": round(y_corr, 8)
        })

        x_cur = x_next
        y_cur = y_corr

    # Final point
    iterations.append({
        "n": n_steps,
        "x_n": round(x_cur, 8),
        "y_n": round(y_cur, 8),
        "f_xn_yn": None,
        "y_predictor": None,
        "corrector_steps": [],
        "y_corrected": round(y_cur, 8)
    })

    curve = [{"x": it["x_n"], "y": it["y_n"]} for it in iterations]

    return {
        "method": "Modified Euler's Method (Heun's Method)",
        "function": func_str,
        "x0": x0,
        "y0": y0,
        "h": h,
        "x_end": x_end,
        "n_steps": n_steps,
        "max_corrector_iterations": max_corrector_iterations,
        "iterations": iterations,
        "final_x": round(x_cur, 8),
        "final_y": round(y_cur, 8),
        "curve": curve
    }
