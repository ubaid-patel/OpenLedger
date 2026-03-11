import sys
import os

# allow importing backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture(scope="function")
def test_client():
    with TestClient(app) as client:
        yield client