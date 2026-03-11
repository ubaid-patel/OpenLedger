import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# We add the tlsCAFile parameter right here
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

db = client["FinanceDB"]

forms_collection = db["forms"]
expenses_collection = db["expenses"]
collections_collection = db["collections"]