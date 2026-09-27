"""
2D Laplace Equation Solver using Gauss-Seidel iteration
∇²u = ∂²u/∂x² + ∂²u/∂y² = 0

Standard 5-point finite difference stencil:
u[i,j] = (u[i+1,j] + u[i-1,j] + u[i,j+1] + u[i,j-1]) / 4
"""
import numpy as np
from typing import List, Optional


def laplace_2d(
    nx: int,
    ny: int,
    top: float,
    bottom: float,
    left: float,
    right: float,
    tolerance: float = 1e-4,
    max_iterations: int = 1000
) -> dict:
    if nx < 3 or ny < 3:
        raise ValueError("Grid must be at least 3×3.")
    if nx > 30 or ny > 30:
        raise ValueError("Grid size must be ≤ 30×30 for manageable output.")

    # Initialize grid
    u = np.zeros((ny, nx))

    # Apply boundary conditions
    u[0, :] = bottom      # bottom row
    u[-1, :] = top        # top row
    u[:, 0] = left        # left column
    u[:, -1] = right      # right column

    # Initial interior (simple average)
    for i in range(1, ny - 1):
        for j in range(1, nx - 1):
            u[i, j] = (top + bottom + left + right) / 4

    iteration_errors = []
    converged = False

    for it in range(1, max_iterations + 1):
        max_err = 0.0
        for i in range(1, ny - 1):
            for j in range(1, nx - 1):
                u_new = (u[i + 1, j] + u[i - 1, j] + u[i, j + 1] + u[i, j - 1]) / 4
                err = abs(u_new - u[i, j])
                if err > max_err:
                    max_err = err
                u[i, j] = u_new

        iteration_errors.append({"iteration": it, "max_error": round(float(max_err), 8)})

        if max_err < tolerance:
            converged = True
            break

    # Build grid data for heatmap
    grid_data = []
    for i in range(ny):
        row = []
        for j in range(nx):
            row.append(round(float(u[i, j]), 4))
        grid_data.append(row)

    # Build flat list for visualization
    heatmap = []
    for i in range(ny):
        for j in range(nx):
            heatmap.append({
                "x": j,
                "y": i,
                "value": round(float(u[i, j]), 4)
            })

    return {
        "nx": nx,
        "ny": ny,
        "boundary": {"top": top, "bottom": bottom, "left": left, "right": right},
        "converged": converged,
        "iterations_used": len(iteration_errors),
        "final_error": iteration_errors[-1]["max_error"] if iteration_errors else 0,
        "iteration_errors": iteration_errors[-20:],  # last 20 for display
        "grid": grid_data,
        "heatmap": heatmap,
        "u_min": round(float(np.min(u)), 4),
        "u_max": round(float(np.max(u)), 4)
    }
