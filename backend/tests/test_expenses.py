from datetime import datetime


def test_create_expense(test_client):

    payload = {
        "date": datetime.utcnow().isoformat(),
        "paidBy": "Shoail",
        "mode": "Cash",
        "purpose": "Iftaar",
        "amount": 549,
        "notes": "test"
    }

    response = test_client.post("/api/expenses/", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert isinstance(data["id"], str)


def test_get_expenses(test_client):

    response = test_client.get("/api/expenses/")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_update_expense(test_client):

    payload = {
        "date": datetime.utcnow().isoformat(),
        "paidBy": "Shoail",
        "mode": "Cash",
        "purpose": "Dinner",
        "amount": 200
    }

    create = test_client.post("/api/expenses/", json=payload)

    assert create.status_code == 200

    expense_id = create.json()["id"]

    payload["amount"] = 300

    response = test_client.put(f"/api/expenses/{expense_id}", json=payload)

    assert response.status_code == 200
    assert response.json()["message"] == "updated"


def test_delete_expense(test_client):

    payload = {
        "date": datetime.utcnow().isoformat(),
        "paidBy": "Shoail",
        "mode": "Cash",
        "purpose": "Food",
        "amount": 100
    }

    create = test_client.post("/api/expenses/", json=payload)

    expense_id = create.json()["id"]

    response = test_client.delete(f"/api/expenses/{expense_id}")

    assert response.status_code == 200
    assert response.json()["message"] == "deleted"