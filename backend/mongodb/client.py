from pymongo import MongoClient

import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(f"mongodb://{os.getenv('MONGO_DB_HOST')}:{os.getenv('MONGO_DB_PORT')}/")
db = client[os.getenv('MONGO_DB_NAME')]
