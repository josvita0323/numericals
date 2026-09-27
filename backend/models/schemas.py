"""
Pydantic request/response models for all numerical methods.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


# ─── Module I: Linear Systems ─────────────────────────────────────────────────

class GaussJordanRequest(BaseModel):
    matrix_a: List[List[float]] = Field(..., examples=[[[2, 1, -1], [1, 3, 2], [1, -1, 3]]])
    vector_b: List[float] = Field(..., examples=[[8, 13, 5]])


class GaussJacobiRequest(BaseModel):
    matrix_a: List[List[float]] = Field(..., examples=[[[5, 1, 1], [1, 4, 1], [1, 1, 3]]])
    vector_b: List[float] = Field(..., examples=[[7, 6, 5]])
    initial_guess: Optional[List[float]] = None
    tolerance: float = Field(default=1e-6, gt=0)
    max_iterations: int = Field(default=50, ge=1, le=500)


class GaussSeidelRequest(BaseModel):
    matrix_a: List[List[float]] = Field(..., examples=[[[5, 1, 1], [1, 4, 1], [1, 1, 3]]])
    vector_b: List[float] = Field(..., examples=[[7, 6, 5]])
    initial_guess: Optional[List[float]] = None
    tolerance: float = Field(default=1e-6, gt=0)
    max_iterations: int = Field(default=50, ge=1, le=500)


# ─── Module II: Interpolation ─────────────────────────────────────────────────

class LagrangeRequest(BaseModel):
    x_data: List[float] = Field(..., examples=[[1, 2, 4, 5]])
    y_data: List[float] = Field(..., examples=[[1, 4, 16, 25]])
    x_target: float = Field(..., examples=[3.0])


class CubicSplineRequest(BaseModel):
    x_data: List[float] = Field(..., examples=[[0, 1, 2, 3, 4]])
    y_data: List[float] = Field(..., examples=[[0, 1, 4, 9, 16]])
    x_target: float = Field(..., examples=[1.5])


class LeastSquaresRequest(BaseModel):
    x_data: List[float] = Field(..., examples=[[1, 2, 3, 4, 5]])
    y_data: List[float] = Field(..., examples=[[2.1, 3.9, 6.2, 7.8, 10.1]])
    degree: int = Field(default=1, ge=1, le=2)


# ─── Module III: Differentiation & Integration ───────────────────────────────

class DifferentiationRequest(BaseModel):
    func_str: str = Field(..., examples=["x**2 + sin(x)"])
    x_val: float = Field(..., examples=[1.0])
    h: float = Field(..., examples=[0.1])
    method: str = Field(default="central", pattern="^(forward|backward|central)$")


class TrapezoidalRequest(BaseModel):
    func_str: str = Field(..., examples=["x**2"])
    a: float = Field(..., examples=[0.0])
    b: float = Field(..., examples=[1.0])
    n: int = Field(..., ge=1, le=1000)


class SimpsonsRequest(BaseModel):
    func_str: str = Field(..., examples=["x**2"])
    a: float = Field(..., examples=[0.0])
    b: float = Field(..., examples=[1.0])
    n: int = Field(..., ge=2, le=1000)


# ─── Module IV: ODE ───────────────────────────────────────────────────────────

class EulerRequest(BaseModel):
    func_str: str = Field(..., examples=["x + y"])
    x0: float = Field(..., examples=[0.0])
    y0: float = Field(..., examples=[1.0])
    h: float = Field(..., examples=[0.1])
    x_end: float = Field(..., examples=[1.0])


class ModifiedEulerRequest(BaseModel):
    func_str: str = Field(..., examples=["x + y"])
    x0: float = Field(..., examples=[0.0])
    y0: float = Field(..., examples=[1.0])
    h: float = Field(..., examples=[0.1])
    x_end: float = Field(..., examples=[1.0])
    max_corrector_iterations: int = Field(default=3, ge=1, le=10)
    corrector_tolerance: float = Field(default=1e-6, gt=0)


class RK4Request(BaseModel):
    func_str: str = Field(..., examples=["x + y"])
    x0: float = Field(..., examples=[0.0])
    y0: float = Field(..., examples=[1.0])
    h: float = Field(..., examples=[0.1])
    x_end: float = Field(..., examples=[1.0])


# ─── Module V: BVP & PDE ──────────────────────────────────────────────────────

class BVPRequest(BaseModel):
    p_str: str = Field(..., examples=["0"])
    q_str: str = Field(..., examples=["-1"])
    r_str: str = Field(..., examples=["0"])
    a: float = Field(..., examples=[0.0])
    b: float = Field(..., examples=[1.0])
    alpha: float = Field(..., examples=[0.0])
    beta: float = Field(..., examples=[1.0])
    n: int = Field(..., ge=2, le=100)


class LaplaceRequest(BaseModel):
    nx: int = Field(default=10, ge=3, le=30)
    ny: int = Field(default=10, ge=3, le=30)
    top: float = Field(default=100.0)
    bottom: float = Field(default=0.0)
    left: float = Field(default=0.0)
    right: float = Field(default=0.0)
    tolerance: float = Field(default=1e-4, gt=0)
    max_iterations: int = Field(default=1000, ge=1, le=5000)


class HeatEquationRequest(BaseModel):
    length: float = Field(..., examples=[1.0])
    alpha: float = Field(..., examples=[0.01])
    dx: float = Field(..., examples=[0.1])
    dt: float = Field(..., examples=[0.4])
    t_end: float = Field(..., examples=[2.0])
    initial_temp: float = Field(..., examples=[100.0])
    left_temp: float = Field(..., examples=[0.0])
    right_temp: float = Field(..., examples=[0.0])
