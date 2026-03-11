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

    test_client.post("/api/forms", json={
        "title": "Test Form for List",
        "purpose": "hadiya"
    })

    response = test_client.get("/api/forms")
    assert response.status_code == 200
    data = response.json()

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

    create_payload = {"title": "Old Title", "purpose": "hadiya"}
    create = test_client.post("/api/forms", json=create_payload)
    form_id = create.json()["id"]

    update_payload = {"title": "New Title"}

    response = test_client.put(f"/api/forms/{form_id}", json=update_payload)

    assert response.status_code == 200
    assert response.json()["message"] == "Form updated successfully"

    verify = test_client.get(f"/api/forms/{form_id}")
    assert verify.json()["title"] == "New Title"


def test_update_invalid_form(test_client):

    response = test_client.put(
        "/api/forms/000000000000000000000000",
        json={"title": "Doesn't matter"}
    )

    assert response.status_code == 200
    assert response.json()["error"] == "Form not found"


def test_delete_form(test_client):

    create = test_client.post(
        "/api/forms",
        json={"title": "To be deleted", "purpose": "hadiya"}
    )

    form_id = create.json()["id"]

    response = test_client.delete(f"/api/forms/{form_id}")

    assert response.status_code == 200
    assert response.json()["message"] == "Form deleted successfully"

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

    response = test_client.post(
        f"/api/forms/{form_id}/submit",
        json=submission
    )

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

    assert response.status_code == 200
    assert response.json()["error"] == "Form not found"


# ==========================================================
# NEW TESTS
# ==========================================================


def test_submit_old_form_backward_compatibility(test_client):

    create = test_client.post("/api/forms", json={
        "title": "Old Style Form",
        "purpose": "hadiya"
    })

    form_id = create.json()["id"]

    submission = {
        "name": "Ahmed",
        "amount": 300,
        "notes": "Old form donation"
    }

    response = test_client.post(
        f"/api/forms/{form_id}/submit",
        json=submission
    )

    assert response.status_code == 200
    assert response.json()["message"] == "submitted"


def test_submit_form_with_label_fields(test_client):

    payload = {
        "title": "Label Test Form",
        "purpose": "hadiya",
        "fields": [
            {"type": "label", "text": "Donation Form"},
            {"name": "name", "type": "text", "label": "Name"},
            {"name": "amount", "type": "number", "label": "Amount"}
        ]
    }

    create = test_client.post("/api/forms", json=payload)
    form_id = create.json()["id"]

    submission = {
        "name": "Bilal",
        "amount": 200
    }

    response = test_client.post(
        f"/api/forms/{form_id}/submit",
        json=submission
    )

    assert response.status_code == 200
    assert response.json()["message"] == "submitted"


def test_required_field_validation(test_client):

    payload = {
        "title": "Required Test",
        "purpose": "hadiya",
        "fields": [
            {"name": "name", "type": "text", "required": True},
            {"name": "amount", "type": "number", "required": True}
        ]
    }

    create = test_client.post("/api/forms", json=payload)
    form_id = create.json()["id"]

    submission = {
        "name": "Missing Amount"
    }

    response = test_client.post(
        f"/api/forms/{form_id}/submit",
        json=submission
    )

    assert response.status_code == 200
    assert "error" in response.json()


def test_dynamic_field_submission(test_client):

    payload = {
        "title": "Dynamic Fields",
        "purpose": "hadiya",
        "fields": [
            {"name": "name", "type": "text"},
            {"name": "amount", "type": "number"},
            {"name": "phone", "type": "text"}
        ]
    }

    create = test_client.post("/api/forms", json=payload)
    form_id = create.json()["id"]

    submission = {
        "name": "Zaid",
        "amount": 700,
        "phone": "9999999999"
    }

    response = test_client.post(
        f"/api/forms/{form_id}/submit",
        json=submission
    )

    assert response.status_code == 200
    assert response.json()["message"] == "submitted"


def test_hardcoded_fields_continuity(test_client):

    payload = {
        "title": "Continuity Test",
        "purpose": "hadiya",
        "fields": [
            {"name": "name", "type": "text"},
            {"name": "amount", "type": "number"},
            {"name": "notes", "type": "text"}
        ]
    }

    create = test_client.post("/api/forms", json=payload)
    form_id = create.json()["id"]

    submission = {
        "name": "Usman",
        "amount": 450,
        "notes": "Testing continuity"
    }

    response = test_client.post(
        f"/api/forms/{form_id}/submit",
        json=submission
    )

    assert response.status_code == 200
    assert response.json()["message"] == "submitted"