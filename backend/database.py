import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "FinanceDB")  # fallback if not provided

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

db = client[DB_NAME]

forms_collection = db["forms"]
expenses_collection = db["expenses"]
collections_collection = db["collections"]