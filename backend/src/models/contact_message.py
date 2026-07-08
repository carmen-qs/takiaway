from sqlalchemy import Column, String, Text, UUID, DateTime
from sqlalchemy.ext.declarative import declarative_base
import uuid
from datetime import datetime
from .artist import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False)
    mensaje = Column(Text, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
