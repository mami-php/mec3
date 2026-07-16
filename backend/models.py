"""Pydantic models for the mentorship platform."""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
import uuid


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.utcnow()


# ---------- Auth ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: dict


# ---------- User ----------
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    role: str  # 'admin' | 'mentor' | 'student'
    status: str = 'active'  # active | inactive | blocked | deleted


class UserCreate(UserBase):
    password: str
    # student-specific
    birth_date: Optional[str] = None
    city: Optional[str] = None
    grade: Optional[str] = None  # e.g. '12.Sınıf', 'Mezun'
    exam_type: Optional[str] = None  # YKS, LGS, KPSS, ALES, YDS, DGS
    target_school: Optional[str] = None
    target_dept: Optional[str] = None
    target_score: Optional[str] = None
    mentor_id: Optional[str] = None
    package_id: Optional[str] = None
    package_days: Optional[int] = None
    # mentor-specific
    specialty: Optional[str] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[str] = None
    birth_date: Optional[str] = None
    city: Optional[str] = None
    grade: Optional[str] = None
    exam_type: Optional[str] = None
    target_school: Optional[str] = None
    target_dept: Optional[str] = None
    target_score: Optional[str] = None
    mentor_id: Optional[str] = None
    specialty: Optional[str] = None


class PasswordChange(BaseModel):
    new_password: str


# ---------- Package ----------
class PackageBase(BaseModel):
    name: str
    duration_days: int
    price: float = 0
    description: Optional[str] = None
    features: List[str] = []
    is_active: bool = True
    is_landing: bool = True  # show on public landing page
    sort_order: int = 100
    badge: Optional[str] = None  # e.g. 'Popüler', 'Avantaj Paketi'
    accent: bool = False


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    duration_days: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_landing: Optional[bool] = None
    sort_order: Optional[int] = None
    badge: Optional[str] = None
    accent: Optional[bool] = None


# ---------- Assign Package ----------
class AssignPackage(BaseModel):
    package_id: str
    days: Optional[int] = None  # override


class ExtendPackage(BaseModel):
    days: int


class AssignMentor(BaseModel):
    mentor_id: Optional[str]


# ---------- Task / Plan ----------
class TaskCreate(BaseModel):
    student_id: str
    day_date: str  # YYYY-MM-DD
    subject: str
    topic: Optional[str] = None
    description: Optional[str] = None
    task_type: str = 'test'  # test | konu | tekrar | okuma | ödev
    target_qcount: Optional[int] = None
    target_duration_min: Optional[int] = None


class StudentTaskCreate(BaseModel):
    day_date: str
    subject: str
    topic: Optional[str] = None
    description: Optional[str] = None
    task_type: str = 'test'
    target_qcount: Optional[int] = None
    target_duration_min: Optional[int] = None


class TaskUpdate(BaseModel):
    subject: Optional[str] = None
    topic: Optional[str] = None
    description: Optional[str] = None
    task_type: Optional[str] = None
    target_qcount: Optional[int] = None
    target_duration_min: Optional[int] = None
    completed: Optional[bool] = None


# ---------- Study session (Kronometre) ----------
class StudySessionStart(BaseModel):
    subject: str
    topic: Optional[str] = None


class StudySessionStop(BaseModel):
    session_id: str
    note: Optional[str] = None
