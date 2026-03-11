from fastapi import APIRouter, UploadFile, File
from database import expenses_collection
from models import Expense
from bson import ObjectId
from r2 import upload_file
import uuid

router = APIRouter()


@router.get("/")
def get_expenses():

    data = []

    for item in expenses_collection.find():
        item["_id"] = str(item["_id"])
        data.append(item)

    return data


@router.post("/")
def create_expense(expense: Expense):

    result = expenses_collection.insert_one(expense.dict())

    return {"id": str(result.inserted_id)}


@router.put("/{id}")
def update_expense(id: str, expense: Expense):

    expenses_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": expense.dict()}
    )

    return {"message": "updated"}


@router.delete("/{id}")
def delete_expense(id: str):

    expenses_collection.delete_one({"_id": ObjectId(id)})

    return {"message": "deleted"}


