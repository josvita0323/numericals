"""
Gauss-Jordan Elimination Method
Solves Ax = B by augmenting [A|B] and row-reducing to RREF.
"""
import numpy as np
from typing import List, Tuple


def gauss_jordan(matrix_a: List[List[float]], vector_b: List[float]) -> dict:
    """
    Perform Gauss-Jordan elimination on the system Ax = B.
    Returns step-by-step operations, intermediate matrices, and the solution.
    """
    n = len(matrix_a)
    if len(vector_b) != n:
        raise ValueError("Matrix A and vector B dimensions mismatch.")
    for row in matrix_a:
        if len(row) != n:
            raise ValueError("Matrix A must be square.")

    # Build augmented matrix [A | B]
    aug = np.array([[float(matrix_a[i][j]) for j in range(n)] + [float(vector_b[i])]
                    for i in range(n)], dtype=float)

    steps = []
    steps.append({
        "description": "Initial augmented matrix [A | B]",
        "matrix": _matrix_to_list(aug),
        "operation": None
    })

    for col in range(n):
        # Find pivot (partial pivoting)
        max_row = col
        for r in range(col + 1, n):
            if abs(aug[r, col]) > abs(aug[max_row, col]):
                max_row = r

        if max_row != col:
            aug[[col, max_row]] = aug[[max_row, col]]
            steps.append({
                "description": f"Swap R{col+1} ↔ R{max_row+1}",
                "matrix": _matrix_to_list(aug),
                "operation": f"R{col+1} ↔ R{max_row+1}"
            })

        pivot = aug[col, col]
        if abs(pivot) < 1e-12:
            raise ValueError(
                f"Matrix is singular or system is inconsistent. "
                f"Zero pivot encountered at column {col+1}."
            )

        # Normalize pivot row
        aug[col] = aug[col] / pivot
        steps.append({
            "description": f"Normalize R{col+1}: R{col+1} ÷ {_fmt(pivot)}",
            "matrix": _matrix_to_list(aug),
            "operation": f"R{col+1} → R{col+1} ÷ {_fmt(pivot)}"
        })

        # Eliminate column in ALL other rows (Jordan step)
        for row in range(n):
            if row == col:
                continue
            factor = aug[row, col]
            if abs(factor) < 1e-15:
                continue
            aug[row] = aug[row] - factor * aug[col]
            steps.append({
                "description": f"Eliminate column {col+1} from R{row+1}",
                "matrix": _matrix_to_list(aug),
                "operation": f"R{row+1} → R{row+1} - ({_fmt(factor)}) × R{col+1}"
            })

    # Extract solution
    solution = [_round(aug[i, n]) for i in range(n)]

    return {
        "steps": steps,
        "solution": solution,
        "variable_names": [f"x{i+1}" for i in range(n)],
        "n": n
    }


def _matrix_to_list(m: np.ndarray) -> List[List[float]]:
    return [[_round(v) for v in row] for row in m]


def _round(v: float) -> float:
    return round(float(v), 8)


def _fmt(v: float) -> str:
    v = float(v)
    if v == int(v):
        return str(int(v))
    return f"{v:.4f}"
