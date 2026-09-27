"""
Router for Module II — Interpolation and Approximation
Endpoints: Lagrange, Cubic Spline, Least Squares
"""
from fastapi import APIRouter, HTTPException
from models.schemas import LagrangeRequest, CubicSplineRequest, LeastSquaresRequest
from solvers.lagrange import lagrange_interpolation
from solvers.cubic_spline import cubic_spline
from solvers.least_squares import least_squares

router = APIRouter(prefix="/module2", tags=["Module II — Interpolation"])


@router.post("/lagrange")
def solve_lagrange(req: LagrangeRequest):
    try:
        result = lagrange_interpolation(req.x_data, req.y_data, req.x_target)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/cubic-spline")
def solve_cubic_spline(req: CubicSplineRequest):
    try:
        result = cubic_spline(req.x_data, req.y_data, req.x_target)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/least-squares")
def solve_least_squares(req: LeastSquaresRequest):
    try:
        result = least_squares(req.x_data, req.y_data, req.degree)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
