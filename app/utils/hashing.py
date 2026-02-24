from passlib.context import CryptContext

# Argon2 is the recommended hashing algorithm for security and handles long passwords without truncation (no 72-byte limit).
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain text password against its Argon2 hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generates an Argon2 hash of the provided password.
    """
    return pwd_context.hash(password)
