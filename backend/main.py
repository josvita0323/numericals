"""
Numerical Methods Learning Lab — FastAPI Backend
Main application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.module1 import router as module1_router
from routers.module2 import router as module2_router
from routers.module3 import router as module3_router
from routers.module4 import router as module4_router
from routers.module5 import router as module5_router

app = FastAPI(
    title="Numerical Methods Learning Lab",
    description=(
        "A college-level educational API implementing 15 numerical methods "
        "across 5 modules: Linear Systems, Interpolation, "
        "Differentiation/Integration, ODEs, and BVP/PDEs."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Allow React dev server to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",
                   "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all module routers
app.include_router(module1_router)
app.include_router(module2_router)
app.include_router(module3_router)
app.include_router(module4_router)
app.include_router(module5_router)


@app.get("/")
def root():
    return {
        "project": "Numerical Methods Learning Lab",
        "version": "1.0.0",
        "modules": 5,
        "methods": 15,
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok"}
