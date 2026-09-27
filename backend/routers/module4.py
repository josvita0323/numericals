"""
Router for Module IV — Initial Value Problems for ODEs
Endpoints: Euler, Modified Euler, RK4
"""
from fastapi import APIRouter, HTTPException
from models.schemas import EulerRequest, ModifiedEulerRequest, RK4Request
from solvers.euler import euler_method
from solvers.modified_euler import modified_euler
from solvers.rk4 import rk4

router = APIRouter(prefix="/module4", tags=["Module IV — ODE"])


@router.post("/euler")
def solve_euler(req: EulerRequest):
    try:
        result = euler_method(req.func_str, req.x0, req.y0, req.h, req.x_end)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/modified-euler")
def solve_modified_euler(req: ModifiedEulerRequest):
    try:
        result = modified_euler(
            req.func_str, req.x0, req.y0, req.h, req.x_end,
            req.max_corrector_iterations, req.corrector_tolerance
        )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/rk4")
def solve_rk4(req: RK4Request):
    try:
        result = rk4(req.func_str, req.x0, req.y0, req.h, req.x_end)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
