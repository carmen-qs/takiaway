import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession
from main import app
from src.database import engine, get_db
from src.models import AdminUser
from src.services.auth_service import get_password_hash


@pytest_asyncio.fixture
async def db_session():
    """Sesión de DB envuelta en una transacción que SIEMPRE se revierte al final,
    sin importar cuántos commit() haga el código bajo prueba."""
    connection = await engine.connect()
    outer_trans = await connection.begin()
    session = AsyncSession(bind=connection, expire_on_commit=False)
    nested = await connection.begin_nested()

    @event.listens_for(session.sync_session, "after_transaction_end")
    def restart_savepoint(sync_session, transaction):
        nonlocal nested
        if not nested.is_active:
            nested = connection.sync_connection.begin_nested()

    try:
        yield session
    finally:
        await session.close()
        await outer_trans.rollback()
        await connection.close()


@pytest_asyncio.fixture
async def client(db_session):
    """Cliente HTTP que usa la MISMA sesión aislada de arriba,
    así los tests que llaman a la API tampoco dejan datos reales."""

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.pop(get_db, None)


@pytest_asyncio.fixture
async def test_admin(db_session):
    """Crea un admin de prueba dentro de la transaccion aislada del test.
    Se revierte automaticamente al terminar."""
    admin = AdminUser(
        email="test-admin@example.com",
        hashed_password=get_password_hash("SuperSecreta123"),
    )
    db_session.add(admin)
    await db_session.commit()
    return admin
