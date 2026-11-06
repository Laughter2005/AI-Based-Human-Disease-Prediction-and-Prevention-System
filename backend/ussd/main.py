"""USSD handler — FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

try:
    from fastapi.middleware.cors import CORSMiddleware
except ImportError:  # pragma: no cover
    from starlette.middleware.cors import CORSMiddleware

from config import get_settings
from handlers import handle_input
from schemas import SessionState
from session import cleanup_expired, delete_session, get_session, init_db, save_session


settings = get_settings() 


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("USSD handler starting...")
    init_db()
    print("  Session table ready.")
    yield
    print("USSD handler shutting down.")


app = FastAPI(
    title=settings.app_name,
    description="USSD interface for Malawi Health AI",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {"service": settings.app_name, "status": "ok"}


@app.get("/health")
def health() -> dict:
    deleted = cleanup_expired()
    return {"status": "ok", "expired_sessions_cleaned": deleted}


@app.post("/ussd", response_class=PlainTextResponse)
async def ussd_callback(
    sessionId: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(""),
    serviceCode: str = Form(""),
) -> str:
    parts = text.split("*") if text else []
    last_input = parts[-1] if parts else ""

    state = get_session(phoneNumber)

    if state is None:
        state = SessionState(phone=phoneNumber)
        save_session(state)
        from menus import MENUS
        return f"CON {MENUS['language']['en']}"   # <-- Must start with CON

    new_state, menu_text, is_end = await handle_input(state, last_input)

    if is_end:
        delete_session(phoneNumber)
        return f"END {menu_text}"                 # <-- Must start with END
    else:
        save_session(new_state)
        return f"CON {menu_text}"  

def format_response(state: SessionState, step: str, last_input: str = "") -> str:
    """Return the initial language selection text for a new session."""
    from menus import MENUS
    return MENUS["language"]["en"]