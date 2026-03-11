def test_create_form(test_client):
    payload = {
        "title": "Ramadan Iftar Fund",
        "description": "Support Iftar",
        "upi_id": "ubaid@upi",
        "qr_image": "https://example.com/qr.png",
        "purpose": "hadiya",
        "fields": [
            {"name": "name", "label": "Your Name", "type": "text"},
            {"name": "amount", "label": "Amount", "type": "number"},
            {"name": "notes", "label": "Message", "type": "text"}
        ]
    }
    response = test_client.post("/api/forms", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data

def test_get_all_forms(test_client):
    # First, create a form to ensure the database isn't empty
    test_client.post("/api/forms", json={
        "title": "Test Form for List",
        "purpose": "hadiya"
    })
    
    response = test_client.get("/api/forms")
    assert response.status_code == 200
    data = response.json()
    
    # Assert it returns a list and has at least one item
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_form(test_client):
    payload = {
        "title": "Donation",
        "description": "Test Form",
        "upi_id": "ubaid@upi",
        "qr_image": "https://example.com/qr.png",
        "purpose": "hadiya",
        "fields": [
            {"name": "name", "label": "Name", "type": "text"},
            {"name": "amount", "label": "Amount", "type": "number"}
        ]
    }
    create = test_client.post("/api/forms", json=payload)
    assert create.status_code == 200
    form_id = create.json()["id"]

    response = test_client.get(f"/api/forms/{form_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Donation"

def test_update_form(test_client):
    # 1. Create a form
    create_payload = {"title": "Old Title", "purpose": "hadiya"}
    create = test_client.post("/api/forms", json=create_payload)
    form_id = create.json()["id"]

    # 2. Update the form
    update_payload = {"title": "New Title"}
    response = test_client.put(f"/api/forms/{form_id}", json=update_payload)
    assert response.status_code == 200
    assert response.json()["message"] == "Form updated successfully"

    # 3. Verify it was updated
    verify = test_client.get(f"/api/forms/{form_id}")
    assert verify.json()["title"] == "New Title"

def test_update_invalid_form(test_client):
    response = test_client.put("/api/forms/000000000000000000000000", json={"title": "Doesn't matter"})
    assert response.status_code == 200
    assert response.json()["error"] == "Form not found"

def test_delete_form(test_client):
    # 1. Create a form
    create = test_client.post("/api/forms", json={"title": "To be deleted", "purpose": "hadiya"})
    form_id = create.json()["id"]

    # 2. Delete the form
    response = test_client.delete(f"/api/forms/{form_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Form deleted successfully"

    # 3. Verify it's gone
    verify = test_client.get(f"/api/forms/{form_id}")
    assert verify.json()["error"] == "Form not found"

def test_delete_invalid_form(test_client):
    response = test_client.delete("/api/forms/000000000000000000000000")
    assert response.status_code == 200
    assert response.json()["error"] == "Form not found"

def test_submit_form(test_client):
    payload = {
        "title": "Test Collection",
        "description": "Form for testing",
        "upi_id": "ubaid@upi",
        "qr_image": "https://example.com/qr.png",
        "purpose": "hadiya",
        "fields": [
            {"name": "name", "label": "Name", "type": "text"},
            {"name": "amount", "label": "Amount", "type": "number"},
            {"name": "notes", "label": "Notes", "type": "text"}
        ]
    }
    create = test_client.post("/api/forms", json=payload)
    form_id = create.json()["id"]

    submission = {
        "name": "Ali",
        "amount": 500,
        "notes": "Ramadan donation"
    }
    response = test_client.post(f"/api/forms/{form_id}/submit", json=submission)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "submitted"

def test_submit_invalid_form(test_client):
    submission = {
        "name": "Ali",
        "amount": 100
    }
    response = test_client.post(
        "/api/forms/000000000000000000000000/submit",
        json=submission
    )
    # Based on your route, this returns {"error": "form not found"} with a 200 status
    assert response.status_code == 200
    assert response.json()["error"] == "Form not found"