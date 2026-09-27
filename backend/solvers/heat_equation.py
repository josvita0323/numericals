"""
1D Heat Equation - Explicit Finite Difference Method
∂u/∂t = α · ∂²u/∂x²

Explicit scheme: u[i,n+1] = u[i,n] + r·(u[i+1,n] - 2u[i,n] + u[i-1,n])
where r = α·Δt/(Δx)²

Stability condition: r ≤ 0.5
"""
import numpy as np
from typing import List, Optional


def heat_equation(
    length: float,
    alpha: float,
    dx: float,
    dt: float,
    t_end: float,
    initial_temp: float,
    left_temp: float,
    right_temp: float
) -> dict:
    if length <= 0:
        raise ValueError("Rod length must be positive.")
    if alpha <= 0:
        raise ValueError("Thermal diffusivity α must be positive.")
    if dx <= 0:
        raise ValueError("Spatial step Δx must be positive.")
    if dt <= 0:
        raise ValueError("Time step Δt must be positive.")
    if t_end <= 0:
        raise ValueError("End time must be positive.")

    r = alpha * dt / dx**2

    stability_warning = None
    if r > 0.5:
        stability_warning = (
            f"⚠️ Stability violated! r = α·Δt/Δx² = {round(r, 4)} > 0.5. "
            f"The solution will be numerically unstable. "
            f"Reduce Δt or increase Δx."
        )

    nx = int(round(length / dx)) + 1
    nt = int(round(t_end / dt)) + 1

    if nx > 200:
        raise ValueError("Too many spatial points (>200). Increase Δx.")
    if nt > 500:
        raise ValueError("Too many time steps (>500). Increase Δt or reduce t_end.")

    # Spatial grid
    x_vals = [round(i * dx, 8) for i in range(nx)]

    # Initialize temperature
    u = np.full(nx, float(initial_temp))
    u[0] = left_temp
    u[-1] = right_temp

    # Store snapshots
    # We store at most 10 time snapshots for display
    n_snapshots = min(10, nt)
    snapshot_interval = max(1, nt // n_snapshots)

    snapshots = []
    time_snapshots = []
    t_cur = 0.0

    snapshots.append({
        "time": round(t_cur, 6),
        "temperatures": [round(float(v), 4) for v in u]
    })
    time_snapshots.append(round(t_cur, 6))

    all_time_levels = [u.copy()]
    all_times = [0.0]

    for step in range(1, nt):
        u_new = u.copy()
        for i in range(1, nx - 1):
            u_new[i] = u[i] + r * (u[i + 1] - 2 * u[i] + u[i - 1])
        # Boundary
        u_new[0] = left_temp
        u_new[-1] = right_temp
        u = u_new
        t_cur = step * dt

        if step % snapshot_interval == 0 or step == nt - 1:
            snapshots.append({
                "time": round(t_cur, 6),
                "temperatures": [round(float(v), 4) for v in u]
            })
            time_snapshots.append(round(t_cur, 6))
            all_time_levels.append(u.copy())
            all_times.append(round(t_cur, 6))

    # Build heatmap data (time vs space)
    heatmap = []
    for ti, temps in enumerate(all_time_levels):
        for xi, xv in enumerate(x_vals):
            heatmap.append({
                "x": xv,
                "t": all_times[ti],
                "value": round(float(temps[xi]), 4)
            })

    return {
        "length": length,
        "alpha": alpha,
        "dx": dx,
        "dt": dt,
        "t_end": t_end,
        "nx": nx,
        "nt": nt,
        "r": round(r, 6),
        "stability_condition": f"r = {round(r,4)} {'≤' if r <= 0.5 else '>'} 0.5",
        "stability_satisfied": r <= 0.5,
        "stability_warning": stability_warning,
        "x_vals": x_vals,
        "snapshots": snapshots,
        "heatmap": heatmap,
        "final_temperature": [round(float(v), 4) for v in u]
    }
