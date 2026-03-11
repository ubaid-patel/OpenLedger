from fastapi import APIRouter
from database import forms_collection, collections_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/forms", tags=["forms"])

# --- CREATE (Create a new form) ---
@router.post("")
def create_form(payload: dict):
    result = forms_collection.insert_one(payload)
    return {"id": str(result.inserted_id)}

# --- READ ALL (Get all forms) ---
@router.get("")
def get_all_forms():
    forms = []
    for form in forms_collection.find():
        form["_id"] = str(form["_id"])
        forms.append(form)
    return forms

# --- READ ONE (Get a specific form by ID) ---
@router.get("/{id}")
def get_form(id: str):
    form = forms_collection.find_one({"_id": ObjectId(id)})
    if not form:
        return {"error": "Form not found"}
    
    form["_id"] = str(form["_id"])
    return form

# --- UPDATE (Update a specific form by ID) ---
@router.put("/{id}")
def update_form(id: str, payload: dict):
    # Using $set updates only the fields provided in the payload
    result = forms_collection.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": payload}
    )
    
    if result.matched_count == 0:
        return {"error": "Form not found"}
        
    return {"message": "Form updated successfully"}

# --- DELETE (Delete a specific form by ID) ---
@router.delete("/{id}")
def delete_form(id: str):
    result = forms_collection.delete_one({"_id": ObjectId(id)})
    
    if result.deleted_count == 0:
        return {"error": "Form not found"}
        
    return {"message": "Form deleted successfully"}

# --- CUSTOM SUBMIT ROUTE ---
@router.post("/{id}/submit")
def submit_form(id: str, payload: dict):
    form = forms_collection.find_one({"_id": ObjectId(id)})

    if not form:
        return {"error": "Form not found"}

    document = {
        "name": payload.get("name"),
        "amount": float(payload.get("amount", 0)),
        "purpose": form.get("purpose"),
        "notes": payload.get("notes"),
        "mode": "UPI",
        "receipts": None,
        "collectedBy": None,
        "date": datetime.utcnow()
    }

    collections_collection.insert_one(document)

    return {"message": "submitted"}