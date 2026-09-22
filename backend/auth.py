"""
Authentication and User Management Service for CrimeWatch
Provides secure user registration, salted PBKDF2-SHA256 password hashing,
session token generation, and SQLite database persistence.
"""

import hashlib
import hmac
import os
import re
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from backend.database import get_db_connection

# Session duration in days
SESSION_DURATION_DAYS = 30
PASSWORD_MIN_LENGTH = 6
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def hash_password(password: str) -> str:
    """
    Hashes a password using PBKDF2-HMAC-SHA256 with a unique cryptographic salt.
    Returns: 'pbkdf2_sha256$100000$<salt_hex>$<hash_hex>'
    """
    salt = secrets.token_bytes(16)
    iterations = 100_000
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return f"pbkdf2_sha256${iterations}${salt.hex()}${derived.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """
    Verifies a plain password against the stored PBKDF2 salt and hash
    using constant-time comparison to prevent timing attacks.
    """
    if not stored_hash or not stored_hash.startswith("pbkdf2_sha256$"):
        return False
    try:
        parts = stored_hash.split("$")
        if len(parts) != 4:
            return False
        _, iterations_str, salt_hex, expected_hex = parts
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(expected_hex)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(candidate, expected)
    except Exception:
        return False


def sanitize_user_dict(row: Any) -> Dict[str, Any]:
    """Removes sensitive password hash and returns clean user profile dictionary."""
    if not row:
        return {}
    d = dict(row)
    d.pop("password_hash", None)
    return d


def create_user(
    name: str,
    email: str,
    password: str,
    role: str = "analyst",
    organization: Optional[str] = None,
    badge_number: Optional[str] = None
) -> Tuple[Optional[Dict[str, Any]], Optional[str], Optional[str]]:
    """
    Registers a new user and creates an initial authenticated session.
    Returns: (user_profile, session_token, error_message)
    """
    name = (name or "").strip()
    email = (email or "").strip().lower()
    password = password or ""
    role = (role or "analyst").strip().lower()

    if len(name) < 2:
        return None, None, "Full name must be at least 2 characters long."
    if not EMAIL_REGEX.match(email):
        return None, None, "Please provide a valid email address."
    if len(password) < PASSWORD_MIN_LENGTH:
        return None, None, f"Password must be at least {PASSWORD_MIN_LENGTH} characters long."

    valid_roles = {"analyst", "officer", "researcher", "citizen", "admin"}
    if role not in valid_roles:
        role = "analyst"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if email is already registered
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return None, None, "An account with this email address already exists. Please sign in."

        user_id = f"usr_{secrets.token_hex(8)}"
        hashed_pwd = hash_password(password)
        now_iso = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute("""
            INSERT INTO users (id, name, email, password_hash, role, badge_number, organization, created_at, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, email, hashed_pwd, role, badge_number, organization, now_iso, now_iso))

        # Generate initial session token
        session_token = secrets.token_urlsafe(32)
        expires_at = (datetime.utcnow() + timedelta(days=SESSION_DURATION_DAYS)).strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute("""
            INSERT INTO user_sessions (token, user_id, created_at, expires_at)
            VALUES (?, ?, ?, ?)
        """, (session_token, user_id, now_iso, expires_at))

        conn.commit()

        user_profile = {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
            "badge_number": badge_number,
            "organization": organization,
            "created_at": now_iso,
            "last_login": now_iso
        }
        return user_profile, session_token, None
    except Exception as e:
        conn.rollback()
        return None, None, f"Registration failed: {str(e)}"
    finally:
        conn.close()


def authenticate_user(
    email: str,
    password: str
) -> Tuple[Optional[Dict[str, Any]], Optional[str], Optional[str]]:
    """
    Authenticates user credentials and generates a new session token.
    Returns: (user_profile, session_token, error_message)
    """
    email = (email or "").strip().lower()
    password = password or ""

    if not email or not password:
        return None, None, "Please enter both email and password."

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id, name, email, password_hash, role, badge_number, organization, created_at, last_login
            FROM users WHERE email = ?
        """, (email,))
        user_row = cursor.fetchone()

        if not user_row:
            return None, None, "Invalid email or password."

        stored_hash = user_row["password_hash"]
        if not verify_password(password, stored_hash):
            return None, None, "Invalid email or password."

        user_id = user_row["id"]
        now_iso = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        expires_at = (datetime.utcnow() + timedelta(days=SESSION_DURATION_DAYS)).strftime("%Y-%m-%d %H:%M:%S")

        # Update last_login
        cursor.execute("UPDATE users SET last_login = ? WHERE id = ?", (now_iso, user_id))

        # Generate fresh session token
        session_token = secrets.token_urlsafe(32)
        cursor.execute("""
            INSERT INTO user_sessions (token, user_id, created_at, expires_at)
            VALUES (?, ?, ?, ?)
        """, (session_token, user_id, now_iso, expires_at))

        conn.commit()

        user_profile = sanitize_user_dict(user_row)
        user_profile["last_login"] = now_iso
        return user_profile, session_token, None
    except Exception as e:
        conn.rollback()
        return None, None, f"Authentication failed: {str(e)}"
    finally:
        conn.close()


def get_user_by_session(session_token: str) -> Optional[Dict[str, Any]]:
    """
    Resolves an active session token to the authenticated user profile.
    Checks expiration date and removes stale tokens if encountered.
    """
    if not session_token:
        return None

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        now_iso = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            SELECT s.expires_at, u.id, u.name, u.email, u.role, u.badge_number, u.organization, u.created_at, u.last_login
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ?
        """, (session_token,))
        row = cursor.fetchone()

        if not row:
            return None

        if row["expires_at"] < now_iso:
            # Token expired
            cursor.execute("DELETE FROM user_sessions WHERE token = ?", (session_token,))
            conn.commit()
            return None

        return {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "role": row["role"],
            "badge_number": row["badge_number"],
            "organization": row["organization"],
            "created_at": row["created_at"],
            "last_login": row["last_login"]
        }
    except Exception:
        return None
    finally:
        conn.close()


def logout_session(session_token: str) -> bool:
    """Invalidates and removes an active session token."""
    if not session_token:
        return False
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM user_sessions WHERE token = ?", (session_token,))
        conn.commit()
        return cursor.rowcount > 0
    except Exception:
        return False
    finally:
        conn.close()


def get_all_users_count() -> int:
    """Returns total number of registered users."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        row = cursor.fetchone()
        return row[0] if row else 0
    except Exception:
        return 0
    finally:
        conn.close()
