from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.services.auth_service import decode_token

# HTTPBearer es un esquema de seguridad de FastAPI que espera un header
# "Authorization: Bearer <token>". Si el header falta o está mal formado,
# FastAPI ya responde 401 automáticamente antes de llegar a nuestro código.
bearer_scheme = HTTPBearer()


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """Dependency de FastAPI: se agrega como parámetro en cualquier endpoint
    que quiera protegerse. Extrae el token del header Authorization, lo
    decodifica, y si es inválido o expiró, corta la petición con 401 antes
    de que el endpoint corra su lógica. Si es válido, devuelve el email del
    admin (por si el endpoint lo necesita)."""
    token = credentials.credentials
    try:
        email = decode_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return email
