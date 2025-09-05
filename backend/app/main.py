from fastapi import FastAPI
from fastapi.responses import JSONResponse, Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

from app.api.routes import router as api_router
from app.models.db_models import Base
from app.core.db import engine

app = FastAPI(title="Jua Pesa Backend", version="0.1.0")


@app.on_event("startup")
async def on_startup() -> None:
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)


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


app.include_router(api_router, prefix="/api")
