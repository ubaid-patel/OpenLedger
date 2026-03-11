from backend.database import collections_collection as expenses_collection

fixed = 0

docs = expenses_collection.find({"reciepts": {"$exists": True}})

for doc in docs:

    receipt_url = doc.get("reciepts")

    expenses_collection.update_one(
        {"_id": doc["_id"]},
        {
            "$set": {"receipts": receipt_url},
            "$unset": {"reciepts": ""}
        }
    )

    fixed += 1

print("Documents fixed:", fixed)