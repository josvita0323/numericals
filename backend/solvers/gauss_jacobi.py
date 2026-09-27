"""
Gauss-Jacobi (Jacobi Iteration) Method
Solves Ax = B iteratively. Each iteration uses only OLD values.
"""
import numpy as np
from typing import List, Optional


def gauss_jacobi(
    matrix_a: List[List[float]],
    vector_b: List[float],
    initial_guess: Optional[List[float]] = None,
    tolerance: float = 1e-6,
    max_iterations: int = 50
) -> dict:
    n = len(matrix_a)
    A = np.array(matrix_a, dtype=float)
    b = np.array(vector_b, dtype=float)

    if initial_guess is None:
        x = np.zeros(n)
    else:
        x = np.array(initial_guess, dtype=float)

    # Check diagonal dominance
    dd_warning = _check_diagonal_dominance(A, n)

    iterations = []
    for it in range(1, max_iterations + 1):
        x_new = np.zeros(n)
        for i in range(n):
            if abs(A[i, i]) < 1e-12:
                raise ValueError(f"Zero diagonal element at row {i+1}. Reorder equations.")
            s = sum(A[i, j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - s) / A[i, i]

        # Approximate relative error
        errors = []
        for i in range(n):
            if abs(x_new[i]) > 1e-12:
                errors.append(abs((x_new[i] - x[i]) / x_new[i]) * 100)
            else:
                errors.append(abs(x_new[i] - x[i]) * 100)
        max_error = max(errors)

        iter_record = {
            "iteration": it,
            "values": [round(float(v), 8) for v in x_new],
            "errors": [round(float(e), 6) for e in errors],
            "max_error": round(float(max_error), 6)
        }
        iterations.append(iter_record)
        x = x_new.copy()

        if max_error < tolerance * 100:
            return {
                "converged": True,
                "iterations": iterations,
                "solution": [round(float(v), 8) for v in x],
                "variable_names": [f"x{i+1}" for i in range(n)],
                "total_iterations": it,
                "diagonal_dominance_warning": dd_warning
            }

    return {
        "converged": False,
        "iterations": iterations,
        "solution": [round(float(v), 8) for v in x],
        "variable_names": [f"x{i+1}" for i in range(n)],
        "total_iterations": max_iterations,
        "diagonal_dominance_warning": dd_warning
    }


def _check_diagonal_dominance(A: np.ndarray, n: int) -> Optional[str]:
    for i in range(n):
        diag = abs(A[i, i])
        off_diag_sum = sum(abs(A[i, j]) for j in range(n) if j != i)
        if diag <= off_diag_sum:
            return (
                "Warning: The matrix may not be diagonally dominant. "
                "Convergence is not guaranteed. Consider reordering equations."
            )
    return None
