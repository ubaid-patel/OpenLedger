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
    allow_origins=["*"],  # change to frontend domain in production
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
BUILD_DIR = Path("public")

# Serve static assets
assets_dir = BUILD_DIR / "assets"
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


# Root route
@app.get("/")
def serve_root():
    return FileResponse(BUILD_DIR / "index.html")


# Catch-all route for React Router (must be LAST)
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    index_file = BUILD_DIR / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {"error": "React build not found"}