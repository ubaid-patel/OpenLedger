from fastapi import APIRouter
from database import collections_collection
from models import Collection
from bson import ObjectId

router = APIRouter()


@router.get("/")
def get_collections():

    data = []

    for item in collections_collection.find():
        item["_id"] = str(item["_id"])
        data.append(item)

    return data


@router.post("/")
def create_collection(collection: Collection):

    result = collections_collection.insert_one(collection.dict())

    return {"id": str(result.inserted_id)}


@router.put("/{id}")
def update_collection(id: str, collection: Collection):

    collections_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": collection.dict()}
    )

    return {"message": "updated"}


@router.delete("/{id}")
def delete_collection(id: str):

    collections_collection.delete_one({"_id": ObjectId(id)})

    return {"message": "deleted"}