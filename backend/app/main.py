from fastapi import FastAPI
from fastapi.responses import JSONResponse, Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.models.db_models import Base
from app.core.db import engine
from app.core.config import get_settings, Info

app = FastAPI(title="Jua Pesa Backend", version="0.1.0")


@app.on_event("startup")
async def on_startup() -> None:
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

# Configure CORS
_settings = get_settings()
_info = Info()
if _info.allowed_origins:  # pragma: no cover - import-time branch varies by env
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_info.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/testall")
async def testall():
    # Simple ping endpoint used by api_demo.py
    return {"ok": True, "services": ["api", "models", "utils", "ai", "services"], "version": "0.1.0"}


@app.get("/metrics")
async def metrics() -> Response:
    data = generate_latest()  # default registry
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)


@app.get("/readyz")
async def readyz() -> JSONResponse:
    """Readiness probe that checks DB connectivity."""
    try:
        # simple connection test
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        return JSONResponse({"ready": True})
    except Exception as e:  # pragma: no cover - only hit on infra error
        return JSONResponse({"ready": False, "error": str(e)}, status_code=503)


app.include_router(api_router, prefix="/api")
