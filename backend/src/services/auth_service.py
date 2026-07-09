import os
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

# CryptContext es el "motor" de passlib para hashear y verificar contraseñas.
# bcrypt es el algoritmo: lento a propósito, para que probar contraseñas
# por fuerza bruta sea costoso.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))


def get_password_hash(plain_password: str) -> str:
    """Convierte una contraseña en texto plano en un hash bcrypt.
    Se usa una sola vez, al crear el admin (seed_admin.py)."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara una contraseña en texto plano contra el hash guardado en la DB.
    Nunca se descifra el hash; bcrypt vuelve a hashear el intento y compara."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(email: str) -> str:
    """Crea un JWT firmado. El payload lleva 'sub' (el email del admin) y
    'exp' (cuándo deja de ser válido). La firma usa JWT_SECRET_KEY, así que
    solo este backend puede generar tokens válidos o detectar manipulación."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> str:
    """Decodifica y valida un JWT. Si la firma no coincide, o si 'exp' ya
    pasó, python-jose lanza JWTError. Devuelve el email (sub) si es válido."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise JWTError("Token sin 'sub'")
        return email
    except JWTError as exc:
        raise ValueError("Token invalido o expirado") from exc
