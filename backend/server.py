"""
Backend service (port 8001) for the Nova Sugiantara portfolio.

Responsibilities:
- Own POST /api/contact (validate + persist to MongoDB) and expose stored messages.
- Reverse-proxy every other /api/* request to the Nuxt server running on :3000,
  so the Nuxt Nitro server routes (projects, blog, cv, etc.) stay reachable through
  the Kubernetes ingress that routes /api -> 8001.
"""

import os
import time
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, ValidationError
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
NUXT_ORIGIN = os.environ.get("NUXT_ORIGIN", "http://localhost:3000")

mongo_client = MongoClient(MONGO_URL)
db = mongo_client[DB_NAME]
messages = db["contact_messages"]

app = FastAPI(title="Portfolio Backend")

# Simple in-memory rate limiter for the contact endpoint.
_rate_bucket: dict[str, list[float]] = {}


def _rate_limited(key: str, limit: int = 10, window: float = 60.0) -> bool:
    now = time.time()
    hits = [t for t in _rate_bucket.get(key, []) if now - t < window]
    if len(hits) >= limit:
        _rate_bucket[key] = hits
        return True
    hits.append(now)
    _rate_bucket[key] = hits
    return False


class ContactPayload(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)
    hp: str | None = Field(default=None)


HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "content-length",
    "content-encoding",
    "host",
}

_client: httpx.AsyncClient | None = None


@app.on_event("startup")
async def _startup() -> None:
    global _client
    _client = httpx.AsyncClient(base_url=NUXT_ORIGIN, timeout=60.0)


@app.on_event("shutdown")
async def _shutdown() -> None:
    if _client is not None:
        await _client.aclose()


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/api/contact")
async def contact(request: Request) -> JSONResponse:
    ip = (request.headers.get("x-forwarded-for") or request.client.host or "unknown").split(",")[0].strip()

    try:
        raw = await request.json()
    except Exception:
        return JSONResponse({"error": "Invalid request"}, status_code=400)

    # Honeypot: silently accept spam bots without storing anything.
    if isinstance(raw, dict) and isinstance(raw.get("hp"), str) and raw["hp"].strip():
        return JSONResponse({"success": True})

    if _rate_limited(f"contact:{ip}"):
        return JSONResponse({"error": "Too many requests"}, status_code=429)

    try:
        payload = ContactPayload.model_validate(raw)
    except ValidationError:
        return JSONResponse({"error": "Validation failed"}, status_code=422)

    messages.insert_one(
        {
            "name": payload.name.strip(),
            "email": str(payload.email).strip(),
            "message": payload.message.strip(),
            "ip": ip,
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return JSONResponse({"success": True})


@app.get("/api/contact-messages")
async def list_messages() -> JSONResponse:
    docs = list(messages.find().sort("created_at", -1).limit(200))
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return JSONResponse(docs)


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def proxy(path: str, request: Request) -> Response:
    """Forward everything else to the Nuxt server."""
    assert _client is not None
    url = "/api/" + path
    body = await request.body()
    fwd_headers = {k: v for k, v in request.headers.items() if k.lower() not in HOP_BY_HOP}

    upstream = await _client.request(
        request.method,
        url,
        params=request.query_params,
        headers=fwd_headers,
        content=body,
    )

    resp_headers = {k: v for k, v in upstream.headers.items() if k.lower() not in HOP_BY_HOP}
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=resp_headers,
        media_type=upstream.headers.get("content-type"),
    )
