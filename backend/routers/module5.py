"""
Router for Module V — Boundary Value Problems and PDEs
Endpoints: Two-Point BVP, Laplace Equation, Heat Equation
"""
from fastapi import APIRouter, HTTPException
from models.schemas import BVPRequest, LaplaceRequest, HeatEquationRequest
from solvers.bvp import bvp_finite_difference
from solvers.laplace import laplace_2d
from solvers.heat_equation import heat_equation

router = APIRouter(prefix="/module5", tags=["Module V — BVP & PDE"])


@router.post("/bvp")
def solve_bvp(req: BVPRequest):
    try:
        result = bvp_finite_difference(
            req.p_str, req.q_str, req.r_str,
            req.a, req.b, req.alpha, req.beta, req.n
        )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/laplace")
def solve_laplace(req: LaplaceRequest):
    try:
        result = laplace_2d(
            req.nx, req.ny,
            req.top, req.bottom, req.left, req.right,
            req.tolerance, req.max_iterations
        )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/heat-equation")
def solve_heat_equation(req: HeatEquationRequest):
    try:
        result = heat_equation(
            req.length, req.alpha, req.dx, req.dt, req.t_end,
            req.initial_temp, req.left_temp, req.right_temp
        )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
