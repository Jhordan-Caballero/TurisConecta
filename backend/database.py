from pymongo import MongoClient
import os

# Usará la variable de entorno de Docker, o localhost si lo corres por fuera
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)

# Base de datos y colección
db = client["turisconecta"]
servicios_collection = db["servicios"] #[cite: 4]