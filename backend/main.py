from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from routes import expenses, collections, upload, forms

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(forms.router)
app.include_router(expenses.router, prefix="/api/expenses")
app.include_router(collections.router, prefix="/api/collections")
app.include_router(upload.router, prefix="/api/upload")


# React build directory
BASE_DIR = Path(__file__).resolve().parent
BUILD_DIR = BASE_DIR / "public"

assets_dir = BUILD_DIR / "assets"

# Serve static assets
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


# Root route
@app.get("/")
def serve_root():
    index_file = BUILD_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"status": "API running"}


# React router fallback
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):

    # Paths that should NOT be handled by React
    excluded_prefixes = (
        "api",
        "docs",
        "redoc",
        "openapi.json",
        "assets",
        "favicon.ico",
    )

    if full_path.startswith(excluded_prefixes):
        return {"detail": "Not Found"}

    index_file = BUILD_DIR / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {"error": "React build not found"}