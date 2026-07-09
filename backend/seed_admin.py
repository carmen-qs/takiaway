"""Script de seed para crear el usuario admin.
Es idempotente: si el admin ya existe (por email), no hace nada.
Se corre manualmente: docker compose exec backend python seed_admin.py
"""
import asyncio
import os
import sys

from sqlalchemy import select

from src.database import AsyncSessionLocal
from src.models import AdminUser
from src.services.auth_service import get_password_hash


async def seed_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("ERROR: ADMIN_EMAIL y ADMIN_PASSWORD deben estar configurados.")
        sys.exit(1)

    if len(admin_password) < 8:
        print("ERROR: ADMIN_PASSWORD debe tener al menos 8 caracteres.")
        sys.exit(1)

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(AdminUser).where(AdminUser.email == admin_email)
        )
        existing = result.scalar_one_or_none()

        if existing is not None:
            print(f"El admin '{admin_email}' ya existe. No se creo nada nuevo.")
            return

        new_admin = AdminUser(
            email=admin_email,
            hashed_password=get_password_hash(admin_password),
        )
        session.add(new_admin)
        await session.commit()
        print(f"Admin '{admin_email}' creado exitosamente.")


if __name__ == "__main__":
    asyncio.run(seed_admin())
