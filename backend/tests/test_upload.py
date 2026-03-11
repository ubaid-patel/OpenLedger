import io


def test_upload_receipt(test_client):

    fake_file = io.BytesIO(b"fake receipt content")

    response = test_client.post(
        "/api/upload",
        files={"file": ("receipt.jpg", fake_file, "image/jpeg")}
    )

    assert response.status_code == 200

    data = response.json()

    assert "url" in data
    assert isinstance(data["url"], str)