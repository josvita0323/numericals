"""
Comprehensive pytest tests for all 15 numerical methods.
Run with: pytest tests/ -v
"""
import sys
import os
import pytest
import math

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from solvers.gauss_jordan import gauss_jordan
from solvers.gauss_jacobi import gauss_jacobi
from solvers.gauss_seidel import gauss_seidel
from solvers.lagrange import lagrange_interpolation
from solvers.cubic_spline import cubic_spline
from solvers.least_squares import least_squares
from solvers.differentiation import numerical_differentiation
from solvers.trapezoidal import trapezoidal
from solvers.simpson import simpsons
from solvers.euler import euler_method
from solvers.modified_euler import modified_euler
from solvers.rk4 import rk4
from solvers.bvp import bvp_finite_difference
from solvers.laplace import laplace_2d
from solvers.heat_equation import heat_equation


EPS = 1e-4  # tolerance for numerical comparisons


# ─── Module I: Gauss-Jordan ──────────────────────────────────────────────────

class TestGaussJordan:
    def test_2x2_known_solution(self):
        # 2x + y = 5, x + 3y = 10 → x=1, y=3
        A = [[2, 1], [1, 3]]
        b = [5, 10]
        result = gauss_jordan(A, b)
        assert result["solution"][0] == pytest.approx(1.0, abs=EPS)
        assert result["solution"][1] == pytest.approx(3.0, abs=EPS)

    def test_3x3_known_solution(self):
        # 2x + y - z = 8, x + 3y + 2z = 13, x - y + 3z = 5
        # Solve manually: actual solution ≈ [3.48, 2.32, 1.28]
        A = [[2, 1, -1], [1, 3, 2], [1, -1, 3]]
        b = [8, 13, 5]
        result = gauss_jordan(A, b)
        sol = result["solution"]
        # Verify Ax = b
        for i in range(3):
            row_sum = sum(A[i][j] * sol[j] for j in range(3))
            assert row_sum == pytest.approx(b[i], abs=EPS)

    def test_steps_returned(self):
        A = [[1, 0], [0, 1]]
        b = [3, 4]
        result = gauss_jordan(A, b)
        assert len(result["steps"]) >= 1
        assert "matrix" in result["steps"][0]

    def test_singular_matrix_raises(self):
        A = [[1, 2], [2, 4]]  # singular
        b = [3, 6]
        with pytest.raises(ValueError, match="singular|inconsistent"):
            gauss_jordan(A, b)

    def test_dimension_mismatch_raises(self):
        A = [[1, 2], [3, 4]]
        b = [1]  # wrong length
        with pytest.raises(ValueError):
            gauss_jordan(A, b)


# ─── Module I: Gauss-Jacobi ──────────────────────────────────────────────────

class TestGaussJacobi:
    def test_convergence(self):
        # Diagonally dominant → should converge
        A = [[5, 1, 1], [1, 4, 1], [1, 1, 3]]
        b = [7, 6, 5]
        result = gauss_jacobi(A, b, tolerance=1e-8, max_iterations=100)
        assert result["converged"] is True
        sol = result["solution"]
        assert sol[0] == pytest.approx(1.0, abs=1e-3)
        assert sol[1] == pytest.approx(1.0, abs=1e-3)
        assert sol[2] == pytest.approx(1.0, abs=1e-3)

    def test_iteration_table_structure(self):
        A = [[4, 1], [1, 3]]
        b = [9, 7]
        result = gauss_jacobi(A, b, max_iterations=5)
        for it in result["iterations"]:
            assert "iteration" in it
            assert "values" in it
            assert "max_error" in it

    def test_max_iterations_respected(self):
        A = [[1, 2], [2, 1]]  # not diagonally dominant
        b = [3, 3]
        result = gauss_jacobi(A, b, max_iterations=5)
        assert result["total_iterations"] <= 5


# ─── Module I: Gauss-Seidel ──────────────────────────────────────────────────

class TestGaussSeidel:
    def test_convergence_faster_than_jacobi(self):
        A = [[5, 1, 1], [1, 4, 1], [1, 1, 3]]
        b = [7, 6, 5]
        res_seidel = gauss_seidel(A, b, tolerance=1e-8, max_iterations=100)
        res_jacobi = gauss_jacobi(A, b, tolerance=1e-8, max_iterations=100)
        assert res_seidel["converged"] is True
        # Gauss-Seidel typically converges in fewer iterations
        assert res_seidel["total_iterations"] <= res_jacobi["total_iterations"]

    def test_solution_correct(self):
        A = [[4, 1, 0], [1, 4, 1], [0, 1, 4]]
        b = [15, 10, 10]
        result = gauss_seidel(A, b, tolerance=1e-8, max_iterations=100)
        assert result["converged"] is True
        # Verify Ax ≈ b
        sol = result["solution"]
        n = len(sol)
        for i in range(n):
            row_sum = sum(A[i][j] * sol[j] for j in range(n))
            assert row_sum == pytest.approx(b[i], abs=1e-3)

    def test_update_details_present(self):
        A = [[4, 1], [1, 3]]
        b = [9, 7]
        result = gauss_seidel(A, b, max_iterations=3)
        for it in result["iterations"][:-1]:
            assert "update_details" in it


# ─── Module II: Lagrange ─────────────────────────────────────────────────────

class TestLagrange:
    def test_linear_data(self):
        # Points on y = 2x → interpolate at x=3 should give 6
        x = [1.0, 4.0]
        y = [2.0, 8.0]
        result = lagrange_interpolation(x, y, 3.0)
        assert result["result"] == pytest.approx(6.0, abs=EPS)

    def test_quadratic_data(self):
        # Points on y = x² at x=1,2,4 → interpolate at x=3 should be ~9
        x = [1.0, 2.0, 4.0]
        y = [1.0, 4.0, 16.0]
        result = lagrange_interpolation(x, y, 3.0)
        assert result["result"] == pytest.approx(9.0, abs=0.01)

    def test_basis_terms_count(self):
        x = [0.0, 1.0, 2.0, 3.0]
        y = [0.0, 1.0, 4.0, 9.0]
        result = lagrange_interpolation(x, y, 1.5)
        assert len(result["basis_terms"]) == 4

    def test_duplicate_x_raises(self):
        with pytest.raises(ValueError):
            lagrange_interpolation([1.0, 1.0], [2.0, 3.0], 1.5)

    def test_curve_generated(self):
        x = [1.0, 2.0, 3.0]
        y = [1.0, 4.0, 9.0]
        result = lagrange_interpolation(x, y, 2.0)
        assert len(result["curve"]) > 0


# ─── Module II: Cubic Spline ─────────────────────────────────────────────────

class TestCubicSpline:
    def test_linear_data(self):
        # Points on y=x → spline should be exact
        x = [0.0, 1.0, 2.0, 3.0]
        y = [0.0, 1.0, 2.0, 3.0]
        result = cubic_spline(x, y, 1.5)
        assert result["result"] == pytest.approx(1.5, abs=EPS)

    def test_quadratic_data(self):
        x = [0.0, 1.0, 2.0, 3.0, 4.0]
        y = [0.0, 1.0, 4.0, 9.0, 16.0]
        result = cubic_spline(x, y, 2.5)
        assert result["result"] == pytest.approx(6.25, abs=0.1)

    def test_coefficients_returned(self):
        x = [0.0, 1.0, 2.0]
        y = [0.0, 1.0, 0.0]
        result = cubic_spline(x, y, 0.5)
        assert len(result["coefficients"]) == 2

    def test_out_of_range_raises(self):
        x = [0.0, 1.0, 2.0]
        y = [0.0, 1.0, 4.0]
        with pytest.raises(ValueError):
            cubic_spline(x, y, 5.0)


# ─── Module II: Least Squares ────────────────────────────────────────────────

class TestLeastSquares:
    def test_linear_fit_exact(self):
        # Points exactly on y = 2x + 1
        x = [1.0, 2.0, 3.0, 4.0, 5.0]
        y = [3.0, 5.0, 7.0, 9.0, 11.0]
        result = least_squares(x, y, degree=1)
        coeffs = result["coefficients"]
        assert coeffs["a"] == pytest.approx(1.0, abs=EPS)
        assert coeffs["b"] == pytest.approx(2.0, abs=EPS)

    def test_quadratic_fit(self):
        # Points on y = x²
        x = [1.0, 2.0, 3.0, 4.0, 5.0]
        y = [1.0, 4.0, 9.0, 16.0, 25.0]
        result = least_squares(x, y, degree=2)
        coeffs = result["coefficients"]
        assert coeffs["c"] == pytest.approx(1.0, abs=0.01)

    def test_r_squared_near_one_for_exact_fit(self):
        x = [1.0, 2.0, 3.0, 4.0, 5.0]
        y = [3.0, 5.0, 7.0, 9.0, 11.0]
        result = least_squares(x, y, degree=1)
        assert result["r_squared"] == pytest.approx(1.0, abs=EPS)

    def test_normal_equations_shown(self):
        x = [1.0, 2.0, 3.0]
        y = [2.0, 4.0, 6.0]
        result = least_squares(x, y, degree=1)
        assert len(result["normal_equations"]) == 2


# ─── Module III: Differentiation ─────────────────────────────────────────────

class TestDifferentiation:
    def test_forward_difference_x_squared(self):
        # f(x) = x², f'(x) = 2x, at x=2 → 4
        result = numerical_differentiation("x**2", 2.0, 0.001, "forward")
        assert result["derivative"] == pytest.approx(4.0, abs=0.01)

    def test_backward_difference(self):
        result = numerical_differentiation("x**2", 2.0, 0.001, "backward")
        assert result["derivative"] == pytest.approx(4.0, abs=0.01)

    def test_central_difference_more_accurate(self):
        # Central difference should have smaller error for x²
        result = numerical_differentiation("x**2", 2.0, 0.1, "central")
        assert result["absolute_error"] == pytest.approx(0.0, abs=1e-10)

    def test_sin_derivative(self):
        # d/dx sin(x) at x=0 → 1
        result = numerical_differentiation("sin(x)", 0.0, 0.001, "central")
        assert result["derivative"] == pytest.approx(1.0, abs=0.001)

    def test_invalid_function_raises(self):
        with pytest.raises(ValueError):
            numerical_differentiation("invalid!!!!", 1.0, 0.1, "forward")

    def test_zero_h_raises(self):
        with pytest.raises(ValueError):
            numerical_differentiation("x**2", 1.0, 0.0, "forward")


# ─── Module III: Trapezoidal ─────────────────────────────────────────────────

class TestTrapezoidal:
    def test_x_squared_0_to_1(self):
        # ∫₀¹ x² dx = 1/3
        result = trapezoidal("x**2", 0, 1, 100)
        assert result["result"] == pytest.approx(1/3, abs=0.001)

    def test_sin_0_to_pi(self):
        # ∫₀^π sin(x) dx = 2
        result = trapezoidal("sin(x)", 0, math.pi, 1000)
        assert result["result"] == pytest.approx(2.0, abs=0.01)

    def test_table_structure(self):
        result = trapezoidal("x", 0, 1, 4)
        assert len(result["table"]) == 5  # n+1 points
        for row in result["table"]:
            assert "x" in row and "fx" in row and "coefficient" in row

    def test_a_equals_b_raises(self):
        with pytest.raises(ValueError):
            trapezoidal("x**2", 1, 1, 10)


# ─── Module III: Simpson's ───────────────────────────────────────────────────

class TestSimpsons:
    def test_x_squared_0_to_1(self):
        # ∫₀¹ x² dx = 1/3 (exact with cubic function degree)
        result = simpsons("x**2", 0, 1, 4)
        assert result["result"] == pytest.approx(1/3, abs=EPS)

    def test_x_cubed_0_to_1(self):
        # ∫₀¹ x³ dx = 1/4
        result = simpsons("x**3", 0, 1, 4)
        assert result["result"] == pytest.approx(0.25, abs=EPS)

    def test_odd_n_raises(self):
        with pytest.raises(ValueError):
            simpsons("x**2", 0, 1, 3)

    def test_coefficients_pattern(self):
        result = simpsons("x", 0, 1, 4)
        coeffs = result["coefficients"]
        assert coeffs[0] == 1
        assert coeffs[-1] == 1
        assert coeffs[1] == 4
        assert coeffs[2] == 2

    def test_more_accurate_than_trapezoidal(self):
        # For smooth functions, Simpson's should be closer to exact
        res_s = simpsons("x**4", 0, 1, 100)
        res_t = trapezoidal("x**4", 0, 1, 100)
        # exact = 1/5 = 0.2
        err_s = abs(res_s["result"] - 0.2)
        err_t = abs(res_t["result"] - 0.2)
        assert err_s <= err_t


# ─── Module IV: Euler ────────────────────────────────────────────────────────

class TestEuler:
    def test_dy_dx_equals_y(self):
        # dy/dx = y, y(0)=1 → exact: y = e^x
        # At x=1: y ≈ e ≈ 2.718
        result = euler_method("y", 0.0, 1.0, 0.01, 1.0)
        assert result["final_y"] == pytest.approx(math.e, abs=0.02)

    def test_iteration_table_structure(self):
        result = euler_method("x + y", 0.0, 1.0, 0.1, 0.5)
        for it in result["iterations"][:-1]:
            assert "x_n" in it and "y_n" in it and "f_xn_yn" in it

    def test_x_end_less_than_x0_raises(self):
        with pytest.raises(ValueError):
            euler_method("y", 1.0, 1.0, 0.1, 0.5)

    def test_curve_points_count(self):
        result = euler_method("y", 0.0, 1.0, 0.1, 1.0)
        assert len(result["curve"]) == result["n_steps"] + 1


# ─── Module IV: Modified Euler ───────────────────────────────────────────────

class TestModifiedEuler:
    def test_dy_dx_equals_y(self):
        # More accurate than plain Euler
        result = modified_euler("y", 0.0, 1.0, 0.1, 1.0)
        assert result["final_y"] == pytest.approx(math.e, abs=0.005)

    def test_more_accurate_than_euler(self):
        res_euler = euler_method("y", 0.0, 1.0, 0.1, 1.0)
        res_mod = modified_euler("y", 0.0, 1.0, 0.1, 1.0)
        err_euler = abs(res_euler["final_y"] - math.e)
        err_mod = abs(res_mod["final_y"] - math.e)
        assert err_mod < err_euler

    def test_predictor_corrector_in_output(self):
        result = modified_euler("x + y", 0.0, 1.0, 0.1, 0.3)
        for it in result["iterations"][:-1]:
            assert "y_predictor" in it
            assert "y_corrected" in it


# ─── Module IV: RK4 ──────────────────────────────────────────────────────────

class TestRK4:
    def test_dy_dx_equals_y(self):
        # RK4 should be very accurate for dy/dx = y
        result = rk4("y", 0.0, 1.0, 0.1, 1.0)
        assert result["final_y"] == pytest.approx(math.e, abs=1e-5)

    def test_k_values_present(self):
        result = rk4("x + y", 0.0, 1.0, 0.1, 0.3)
        for it in result["iterations"][:-1]:
            assert "k1" in it
            assert "k2" in it
            assert "k3" in it
            assert "k4" in it

    def test_more_accurate_than_euler(self):
        res_rk4 = rk4("y", 0.0, 1.0, 0.1, 1.0)
        res_euler = euler_method("y", 0.0, 1.0, 0.1, 1.0)
        err_rk4 = abs(res_rk4["final_y"] - math.e)
        err_euler = abs(res_euler["final_y"] - math.e)
        assert err_rk4 < err_euler

    def test_known_solution_oscillator(self):
        # dy/dx = -y, y(0)=1 → y = e^(-x), at x=1: 1/e ≈ 0.3679
        result = rk4("-y", 0.0, 1.0, 0.01, 1.0)
        assert result["final_y"] == pytest.approx(1/math.e, abs=1e-6)


# ─── Module V: BVP ───────────────────────────────────────────────────────────

class TestBVP:
    def test_simple_bvp(self):
        # y'' = 0 with y(0)=0, y(1)=1 → linear y=x
        result = bvp_finite_difference("0", "0", "0", 0.0, 1.0, 0.0, 1.0, 10)
        sol = result["solution"]
        for pt in sol:
            assert pt["y"] == pytest.approx(pt["x"], abs=0.01)

    def test_solution_count(self):
        result = bvp_finite_difference("0", "0", "0", 0.0, 1.0, 0.0, 1.0, 5)
        assert len(result["solution"]) == 6  # n+1 points

    def test_boundary_conditions_satisfied(self):
        result = bvp_finite_difference("0", "0", "0", 0.0, 1.0, 2.0, 5.0, 8)
        sol = result["solution"]
        assert sol[0]["y"] == pytest.approx(2.0, abs=EPS)
        assert sol[-1]["y"] == pytest.approx(5.0, abs=EPS)


# ─── Module V: Laplace ───────────────────────────────────────────────────────

class TestLaplace:
    def test_uniform_boundary(self):
        # All boundaries equal → interior should equal that value
        result = laplace_2d(5, 5, 10.0, 10.0, 10.0, 10.0, tolerance=1e-6)
        grid = result["grid"]
        for row in grid:
            for val in row:
                assert val == pytest.approx(10.0, abs=0.1)

    def test_grid_shape(self):
        result = laplace_2d(6, 8, 100.0, 0.0, 0.0, 0.0)
        assert len(result["grid"]) == 8  # ny rows
        assert len(result["grid"][0]) == 6  # nx cols

    def test_convergence_flag(self):
        result = laplace_2d(5, 5, 100.0, 0.0, 0.0, 0.0, tolerance=1e-4, max_iterations=5000)
        assert result["converged"] is True

    def test_invalid_grid_size_raises(self):
        with pytest.raises(ValueError):
            laplace_2d(2, 2, 100.0, 0.0, 0.0, 0.0)


# ─── Module V: Heat Equation ─────────────────────────────────────────────────

class TestHeatEquation:
    def test_stability_satisfied(self):
        # r = 0.01 * 0.4 / 0.1² = 0.4 ≤ 0.5 → stable
        result = heat_equation(1.0, 0.01, 0.1, 0.4, 1.0, 100.0, 0.0, 0.0)
        assert result["stability_satisfied"] is True
        assert result["stability_warning"] is None

    def test_stability_violated_warning(self):
        # r = 0.01 * 1.0 / 0.1² = 1.0 > 0.5 → unstable
        result = heat_equation(1.0, 0.01, 0.1, 1.0, 1.0, 100.0, 0.0, 0.0)
        assert result["stability_satisfied"] is False
        assert result["stability_warning"] is not None

    def test_boundary_conditions_preserved(self):
        result = heat_equation(1.0, 0.01, 0.1, 0.4, 1.0, 100.0, 25.0, 75.0)
        final = result["final_temperature"]
        assert final[0] == pytest.approx(25.0, abs=EPS)
        assert final[-1] == pytest.approx(75.0, abs=EPS)

    def test_snapshots_returned(self):
        result = heat_equation(1.0, 0.01, 0.1, 0.4, 2.0, 100.0, 0.0, 0.0)
        assert len(result["snapshots"]) >= 2
        for snap in result["snapshots"]:
            assert "time" in snap
            assert "temperatures" in snap
