"""
Router for Module III — Numerical Differentiation and Integration
Endpoints: Differentiation, Trapezoidal, Simpson's 1/3
"""
from fastapi import APIRouter, HTTPException
from models.schemas import DifferentiationRequest, TrapezoidalRequest, SimpsonsRequest
from solvers.differentiation import numerical_differentiation
from solvers.trapezoidal import trapezoidal
from solvers.simpson import simpsons

router = APIRouter(prefix="/module3", tags=["Module III — Differentiation & Integration"])


@router.post("/differentiation")
def solve_differentiation(req: DifferentiationRequest):
    try:
        result = numerical_differentiation(req.func_str, req.x_val, req.h, req.method)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/trapezoidal")
def solve_trapezoidal(req: TrapezoidalRequest):
    try:
        result = trapezoidal(req.func_str, req.a, req.b, req.n)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/simpsons")
def solve_simpsons(req: SimpsonsRequest):
    try:
        result = simpsons(req.func_str, req.a, req.b, req.n)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
