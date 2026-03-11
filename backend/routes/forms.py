from fastapi import APIRouter
from database import forms_collection, collections_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/forms", tags=["forms"])


# ----------------------------------------------------
# CREATE FORM
# ----------------------------------------------------

@router.post("")
def create_form(payload: dict):

    payload["title"] = payload.get("title", "")
    payload["description"] = payload.get("description", "")
    payload["purpose"] = payload.get("purpose", "")
    payload["fields"] = payload.get("fields", [])

    payload["createdAt"] = datetime.utcnow()

    result = forms_collection.insert_one(payload)

    return {"id": str(result.inserted_id)}


# ----------------------------------------------------
# GET ALL FORMS
# ----------------------------------------------------

@router.get("")
def get_all_forms():

    forms = []

    for form in forms_collection.find():

        form["_id"] = str(form["_id"])
        forms.append(form)

    return forms


# ----------------------------------------------------
# GET SINGLE FORM
# ----------------------------------------------------

@router.get("/{id}")
def get_form(id: str):

    form = forms_collection.find_one({"_id": ObjectId(id)})

    if not form:
        return {"error": "Form not found"}

    form["_id"] = str(form["_id"])

    return form


# ----------------------------------------------------
# UPDATE FORM
# ----------------------------------------------------

@router.put("/{id}")
def update_form(id: str, payload: dict):

    payload["fields"] = payload.get("fields", [])

    result = forms_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": payload}
    )

    if result.matched_count == 0:
        return {"error": "Form not found"}

    return {"message": "Form updated successfully"}


# ----------------------------------------------------
# DELETE FORM
# ----------------------------------------------------

@router.delete("/{id}")
def delete_form(id: str):

    result = forms_collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        return {"error": "Form not found"}

    return {"message": "Form deleted successfully"}


# ----------------------------------------------------
# SUBMIT FORM
# ----------------------------------------------------

@router.post("/{id}/submit")
def submit_form(id: str, payload: dict):

    form = forms_collection.find_one({"_id": ObjectId(id)})

    if not form:
        return {"error": "Form not found"}


    # ====================================================
    # OLD FORM BEHAVIOUR (STRICT BACKWARD COMPATIBILITY)
    # ====================================================

    if not form.get("fields"):

        receipts = payload.get("receipts") or []

        if isinstance(receipts, str):
            receipts = [receipts]

        document = {

            "name": payload.get("name"),
            "amount": float(payload.get("amount", 0)) if payload.get("amount") else 0,
            "purpose": form.get("purpose"),
            "notes": payload.get("notes"),
            "mode": payload.get("mode", "UPI"),

            "receipts": receipts,

            "collectedBy": payload.get("collectedBy"),

            "date": datetime.utcnow()
        }

        collections_collection.insert_one(document)

        return {"message": "submitted"}


    # ====================================================
    # NEW CUSTOM FORM SYSTEM
    # ====================================================

    fields = form.get("fields", [])

    answers = {}

    for field in fields:

        field_name = field.get("name")
        field_type = field.get("type")

        # ignore label display blocks
        if field_type == "label":
            continue

        value = payload.get(field_name)

        # required validation
        if field.get("required") and value is None:
            return {"error": f"{field_name} is required"}

        answers[field_name] = value


    # ----------------------------------------------------
    # RECEIPTS FIX
    # ----------------------------------------------------

    receipts = payload.get("receipts") or []

    if isinstance(receipts, str):
        receipts = [receipts]


    # ----------------------------------------------------
    # COLLECTION DOCUMENT
    # ----------------------------------------------------

    document = {

        # existing system compatibility
        "name": payload.get("name"),
        "amount": float(payload.get("amount", 0)) if payload.get("amount") else 0,
        "purpose": form.get("purpose"),
        "notes": payload.get("notes"),
        "mode": payload.get("mode", "UPI"),

        "receipts": receipts,

        "collectedBy": payload.get("collectedBy"),

        # new dynamic form system
        "formId": str(form["_id"]),
        "answers": answers,

        "date": datetime.utcnow()
    }

    collections_collection.insert_one(document)

    return {"message": "submitted"}