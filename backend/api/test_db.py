"""Quick PostgreSQL connection test."""
from sqlalchemy import create_engine, text

# Replace YOUR_PASSWORD with the password you set for disease_app
DB_URL = "postgresql+psycopg://disease_app:Laughter2005@localhost:5432/disease_db"

try:
    engine = create_engine(DB_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        version = result.scalar()
        print("✅ Connected successfully !")
        print(f"   PostgreSQL: {version}")
except Exception as e:
    print("❌ Connection failed!")
    print(f"   Error: {e}")