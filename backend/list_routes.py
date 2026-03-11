# list_routes.py
from main import app

for route in app.routes:
    if hasattr(route, "methods"):
        methods = ",".join(route.methods)
        print(f"{methods:10} {route.path}")