import sys
from getpass import getpass
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    db: Session = SessionLocal()

    name = input("Name: ").strip()
    email = input("Email: ").strip()

    password = getpass("Password: ").strip()

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print("✖ Email already registered.")
        sys.exit(1)
    
    hashed_pw = pwd_context.hash(password)

    admin_user = User(
        name=name,
        email=email,
        hashed_password=hashed_pw,
        role="admin"
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    print(f"✅ Admin user created successfully: {admin_user.name} ({admin_user.email})")

if __name__ == "__main__":
    create_admin_user()