from sqlalchemy import Boolean, Column, Integer, String, JSON

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    # primaries
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    first_name = Column(String)
    last_name = Column(String)

    # account checks
    is_admin = Column(Boolean(), default=False)
    is_disabled = Column(Boolean(), default=False)
