from fastapi import APIRouter, UploadFile, File
from database import expenses_collection
from models import Expense
from bson import ObjectId
from r2 import upload_file
import uuid

router = APIRouter()



@router.post("")
async def upload_receipt(file: UploadFile = File(...)):

    filename = f"expenses_{uuid.uuid4()}_{file.filename}"

    url = upload_file(file.file, filename)

    return {"url": url}