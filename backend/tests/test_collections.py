from datetime import datetime


def test_create_collection(test_client):

    payload = {
        "name": "Donation",
        "amount": 1000,
        "date": datetime.utcnow().isoformat(),
        "mode": "UPI",
        "notes": "test"
    }

    response = test_client.post("/api/collections/", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert "id" in data
    assert isinstance(data["id"], str)


def test_get_collections(test_client):

    response = test_client.get("/api/collections/")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_update_collection(test_client):

    payload = {
        "name": "Donation",
        "amount": 1000,
        "date": datetime.utcnow().isoformat(),
        "mode": "Cash"
    }

    create = test_client.post("/api/collections/", json=payload)

    assert create.status_code == 200

    collection_id = create.json()["id"]

    payload["amount"] = 1500

    response = test_client.put(f"/api/collections/{collection_id}", json=payload)

    assert response.status_code == 200
    assert response.json()["message"] == "updated"


def test_delete_collection(test_client):

    payload = {
        "name": "Donation",
        "amount": 1000,
        "date": datetime.utcnow().isoformat(),
        "mode": "Cash"
    }

    create = test_client.post("/api/collections/", json=payload)

    collection_id = create.json()["id"]

    response = test_client.delete(f"/api/collections/{collection_id}")

    assert response.status_code == 200
    assert response.json()["message"] == "deleted"