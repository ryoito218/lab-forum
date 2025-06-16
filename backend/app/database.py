from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

user = os.getenv("POSTGRES_USER")
pw = os.getenv("POSTGRES_PASSWORD")
db = os.getenv("POSTGRES_DB")
port = os.getenv("DB_PORT")
host = os.getenv("DB_HOST")

DATABASE_URL = f"postgresql://{user}:{pw}@{host}:{port}/{db}"


engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()