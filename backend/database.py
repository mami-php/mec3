"""MongoDB connection helpers."""
import os
from motor.motor_asyncio import AsyncIOMotorClient

_mongo_url = os.environ['MONGO_URL']
_db_name = os.environ.get('DB_NAME', 'kocum_sinav')

client = AsyncIOMotorClient(_mongo_url)
db = client[_db_name]


def get_db():
    return db
