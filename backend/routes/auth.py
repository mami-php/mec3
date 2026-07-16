"""Auth routes."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status

from database import db
from models import LoginRequest, TokenResponse
from security import verify_password, create_access_token, get_current_user

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/login', response_model=TokenResponse)
async def login(payload: LoginRequest):
    user = await db.users.find_one({'email': payload.email.lower()})
    if not user or not verify_password(payload.password, user.get('password_hash', '')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='E-posta veya şifre hatalı')
    if user.get('status') in ('blocked', 'deleted'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Hesabınız erişime kapalı')

    await db.users.update_one({'id': user['id']}, {'$set': {'last_login': datetime.utcnow()}})
    token = create_access_token(user['id'], user['role'])
    user.pop('_id', None)
    user.pop('password_hash', None)
    return TokenResponse(access_token=token, user=user)


@router.get('/me')
async def me(current=Depends(get_current_user)):
    # attach current package info for students
    if current.get('role') == 'student':
        pkg_info = await _resolve_student_package(current['id'])
        current['package_info'] = pkg_info
    return current


async def _resolve_student_package(student_id: str):
    user = await db.users.find_one({'id': student_id}, {'_id': 0})
    if not user:
        return None
    pkg_id = user.get('package_id')
    if not pkg_id:
        return {'status': 'no_package'}
    pkg = await db.packages.find_one({'id': pkg_id}, {'_id': 0})
    end = user.get('package_end')
    now = datetime.utcnow()
    active = bool(end and end > now)
    return {
        'status': 'active' if active else 'expired',
        'package': pkg,
        'start': user.get('package_start'),
        'end': end,
    }
