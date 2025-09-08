from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from prometheus_client import (
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
    Histogram,
    REGISTRY,
)
from fastapi.middleware.cors import CORSMiddleware
import time
import uuid

from app.core.logging import setup_logging, get_logger

from app.api.routes import router as api_router
from app.models.db_models import Base
from app.core.db import engine
from app.core.config import get_settings, Info

app = FastAPI(title="Jua Pesa Backend", version="0.1.0")

# Initialize structured logging
setup_logging()
log = get_logger("app")

def _metric_exists(name: str) -> bool:
    # Best-effort: inspect registry to see if a metric name is already present
    try:
        return name in REGISTRY._names_to_collectors  # type: ignore[attr-defined]
    except Exception:  # pragma: no cover - internal API may change
        return False


# Prometheus metrics (register once even if module is reloaded in tests)
if not _metric_exists("http_requests_total"):
    HTTP_REQUESTS_TOTAL = Counter(
        "http_requests_total",
        "Total HTTP requests",
        ["method", "path", "status"],
    )
else:  # pragma: no cover - only hit in reload scenarios
    # Retrieve existing collector
    HTTP_REQUESTS_TOTAL = REGISTRY._names_to_collectors["http_requests_total"]  # type: ignore[index]

if not _metric_exists("http_request_latency_seconds"):
    HTTP_REQUEST_LATENCY_SECONDS = Histogram(
        "http_request_latency_seconds",
        "Latency of HTTP requests in seconds",
        ["method", "path"],
    )
else:  # pragma: no cover - only hit in reload scenarios
    HTTP_REQUEST_LATENCY_SECONDS = REGISTRY._names_to_collectors["http_request_latency_seconds"]  # type: ignore[index]


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


@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    """Assign request IDs, measure latency, and emit structured logs with metrics."""
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    start = time.perf_counter()
    method = request.method
    # Use route path template if available; fall back to raw path
    path = request.scope.get("route").path if request.scope.get("route") else request.url.path

    # Add req_id to state for handlers and to logs contextually
    request.state.req_id = req_id
    try:
        response = await call_next(request)
        status = response.status_code
    except Exception as e:  # pragma: no cover - exercised in error paths
        status = 500
        elapsed = time.perf_counter() - start
        HTTP_REQUESTS_TOTAL.labels(method=method, path=path, status=str(status)).inc()
        HTTP_REQUEST_LATENCY_SECONDS.labels(method=method, path=path).observe(elapsed)
        log.exception(f"request failed req_id={req_id} method={method} path={path} elapsed={elapsed:.4f}s")
        # Re-raise after recording metrics/logs so default handlers run
        raise

    elapsed = time.perf_counter() - start
    # Metrics
    HTTP_REQUESTS_TOTAL.labels(method=method, path=path, status=str(status)).inc()
    HTTP_REQUEST_LATENCY_SECONDS.labels(method=method, path=path).observe(elapsed)

    # Logging
    log.info(
        f"request req_id={req_id} method={method} path={path} status={status} elapsed={elapsed:.4f}s"
    )

    # Propagate request id
    response.headers["X-Request-ID"] = req_id
    return response


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
