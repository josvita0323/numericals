"""
Router for Module I — Solution of Linear Systems
Endpoints: Gauss-Jordan, Gauss-Jacobi, Gauss-Seidel
"""
from fastapi import APIRouter, HTTPException
from models.schemas import GaussJordanRequest, GaussJacobiRequest, GaussSeidelRequest
from solvers.gauss_jordan import gauss_jordan
from solvers.gauss_jacobi import gauss_jacobi
from solvers.gauss_seidel import gauss_seidel

router = APIRouter(prefix="/module1", tags=["Module I — Linear Systems"])


@router.post("/gauss-jordan")
def solve_gauss_jordan(req: GaussJordanRequest):
    try:
        result = gauss_jordan(req.matrix_a, req.vector_b)
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/gauss-jacobi")
def solve_gauss_jacobi(req: GaussJacobiRequest):
    try:
        result = gauss_jacobi(
            req.matrix_a, req.vector_b,
            req.initial_guess, req.tolerance, req.max_iterations
        )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


@router.post("/gauss-seidel")
def solve_gauss_seidel(req: GaussSeidelRequest):
    try:
        result = gauss_seidel(
            req.matrix_a, req.vector_b,
            req.initial_guess, req.tolerance, req.max_iterations
        )
        return {"success": True, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
