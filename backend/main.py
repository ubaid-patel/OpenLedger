from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

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
BUILD_DIR = "./build"

# Serve static assets
app.mount("/assets", StaticFiles(directory=f"{BUILD_DIR}/assets"), name="assets")


# Root route
@app.get("/")
def serve_root():
    return FileResponse(f"{BUILD_DIR}/index.html")


# Catch-all route for React Router
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse(f"{BUILD_DIR}/index.html")