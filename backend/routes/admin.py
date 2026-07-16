"""Admin routes. Full access to users, packages, mentor assignment."""
from datetime import datetime, timedelta
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query

from database import db
from models import (
    UserCreate, UserUpdate, PasswordChange, PackageCreate, PackageUpdate,
    AssignPackage, ExtendPackage, AssignMentor,
)
from security import require_role, hash_password

router = APIRouter(prefix='/admin', tags=['admin'], dependencies=[Depends(require_role('admin'))])

# ---------- Dashboard ----------
@router.get('/dashboard/stats')
async def dashboard_stats():
    now = datetime.utcnow()
    today = datetime(now.year, now.month, now.day)
    tomorrow = today + timedelta(days=1)
    week_ago = now - timedelta(days=7)

    total_students = await db.users.count_documents({'role': 'student', 'status': {'$ne': 'deleted'}})
    total_mentors = await db.users.count_documents({'role': 'mentor', 'status': {'$ne': 'deleted'}})
    active_packages = await db.packages.count_documents({'is_active': True})
    today_signups = await db.users.count_documents({'created_at': {'$gte': today, '$lt': tomorrow}})

    # today's total study seconds
    today_seconds_pipeline = [
        {'$match': {'started_at': {'$gte': today, '$lt': tomorrow}, 'duration_sec': {'$gt': 0}}},
        {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
    ]
    tsec = 0
    async for row in db.study_sessions.aggregate(today_seconds_pipeline):
        tsec = row['total']

    all_time_pipeline = [
        {'$match': {'duration_sec': {'$gt': 0}}},
        {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
    ]
    tsec_all = 0
    async for row in db.study_sessions.aggregate(all_time_pipeline):
        tsec_all = row['total']

    # upcoming package expirations (within 7 days)
    upcoming = await db.users.count_documents({
        'role': 'student',
        'package_end': {'$gte': now, '$lte': now + timedelta(days=7)},
    })

    # active users last 7 days (had a session or logged in)
    active_users = await db.users.count_documents({'last_login': {'$gte': week_ago}})

    # last 7 days daily study series
    series = []
    for i in range(6, -1, -1):
        d0 = today - timedelta(days=i)
        d1 = d0 + timedelta(days=1)
        acc = 0
        async for row in db.study_sessions.aggregate([
            {'$match': {'started_at': {'$gte': d0, '$lt': d1}, 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            acc = row['total']
        series.append({'date': d0.strftime('%Y-%m-%d'), 'seconds': acc})

    # recent activities (last 10 sessions & users)
    recent_sessions = await db.study_sessions.find({}, {'_id': 0}).sort('started_at', -1).limit(10).to_list(10)
    for s in recent_sessions:
        u = await db.users.find_one({'id': s['student_id']}, {'_id': 0, 'full_name': 1})
        s['student_name'] = u['full_name'] if u else '—'

    return {
        'total_students': total_students,
        'total_mentors': total_mentors,
        'active_packages': active_packages,
        'today_signups': today_signups,
        'today_study_seconds': tsec,
        'total_study_seconds': tsec_all,
        'active_users_7d': active_users,
        'upcoming_expirations_7d': upcoming,
        'series_7d': series,
        'recent_sessions': recent_sessions,
    }


# ---------- Users ----------
@router.get('/users')
async def list_users(role: Optional[str] = Query(None), q: Optional[str] = None):
    query = {'status': {'$ne': 'deleted'}}
    if role:
        query['role'] = role
    if q:
        query['$or'] = [
            {'full_name': {'$regex': q, '$options': 'i'}},
            {'email': {'$regex': q, '$options': 'i'}},
            {'phone': {'$regex': q, '$options': 'i'}},
        ]
    users = await db.users.find(query, {'_id': 0, 'password_hash': 0}).sort('created_at', -1).to_list(1000)
    # attach mentor names & package for students
    for u in users:
        if u.get('role') == 'student':
            if u.get('mentor_id'):
                m = await db.users.find_one({'id': u['mentor_id']}, {'_id': 0, 'full_name': 1})
                u['mentor_name'] = m['full_name'] if m else None
            if u.get('package_id'):
                p = await db.packages.find_one({'id': u['package_id']}, {'_id': 0, 'name': 1})
                u['package_name'] = p['name'] if p else None
    return users


@router.post('/users')
async def create_user(payload: UserCreate):
    email = payload.email.lower()
    existing = await db.users.find_one({'email': email})
    if existing:
        raise HTTPException(status_code=400, detail='Bu e-posta zaten kayıtlı')
    now = datetime.utcnow()
    doc = payload.model_dump()
    doc['email'] = email
    doc['password_hash'] = hash_password(doc.pop('password'))
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = now
    doc['last_login'] = None

    # attach package for student
    if payload.role == 'student' and payload.package_id:
        pkg = await db.packages.find_one({'id': payload.package_id})
        if pkg:
            days = payload.package_days or pkg['duration_days']
            doc['package_start'] = now
            doc['package_end'] = now + timedelta(days=days)
    else:
        doc.pop('package_id', None)
        doc.pop('package_days', None)

    await db.users.insert_one(doc)
    doc.pop('_id', None)
    doc.pop('password_hash', None)
    return doc


@router.get('/users/{uid}')
async def get_user(uid: str):
    u = await db.users.find_one({'id': uid}, {'_id': 0, 'password_hash': 0})
    if not u:
        raise HTTPException(status_code=404, detail='Kullanıcı bulunamadı')
    if u.get('role') == 'student':
        if u.get('mentor_id'):
            m = await db.users.find_one({'id': u['mentor_id']}, {'_id': 0, 'full_name': 1, 'id': 1})
            u['mentor_name'] = m['full_name'] if m else None
        if u.get('package_id'):
            p = await db.packages.find_one({'id': u['package_id']}, {'_id': 0})
            u['package'] = p
        # study stats
        total_sec = 0
        async for row in db.study_sessions.aggregate([
            {'$match': {'student_id': uid, 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            total_sec = row['total']
        u['total_study_seconds'] = total_sec
        u['completed_tasks'] = await db.tasks.count_documents({'student_id': uid, 'completed': True})
        u['pending_tasks'] = await db.tasks.count_documents({'student_id': uid, 'completed': {'$ne': True}})
    return u


@router.patch('/users/{uid}')
async def update_user(uid: str, payload: UserUpdate):
    doc = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not doc:
        return {'ok': True}
    await db.users.update_one({'id': uid}, {'$set': doc})
    return {'ok': True}


@router.post('/users/{uid}/password')
async def change_password(uid: str, payload: PasswordChange):
    await db.users.update_one({'id': uid}, {'$set': {'password_hash': hash_password(payload.new_password)}})
    return {'ok': True}


@router.delete('/users/{uid}')
async def delete_user(uid: str):
    await db.users.update_one({'id': uid}, {'$set': {'status': 'deleted'}})
    return {'ok': True}


@router.post('/users/{uid}/status/{new_status}')
async def set_status(uid: str, new_status: str):
    if new_status not in ('active', 'inactive', 'blocked'):
        raise HTTPException(400, 'geçersiz durum')
    await db.users.update_one({'id': uid}, {'$set': {'status': new_status}})
    return {'ok': True}


# ---------- Assignments ----------
@router.post('/users/{student_id}/mentor')
async def assign_mentor(student_id: str, payload: AssignMentor):
    student = await db.users.find_one({'id': student_id, 'role': 'student'})
    if not student:
        raise HTTPException(404, 'Öğrenci bulunamadı')
    if payload.mentor_id:
        mentor = await db.users.find_one({'id': payload.mentor_id, 'role': 'mentor'})
        if not mentor:
            raise HTTPException(404, 'Mentör bulunamadı')
    await db.users.update_one({'id': student_id}, {'$set': {'mentor_id': payload.mentor_id}})
    return {'ok': True}


@router.post('/users/{student_id}/package')
async def assign_package(student_id: str, payload: AssignPackage):
    student = await db.users.find_one({'id': student_id, 'role': 'student'})
    if not student:
        raise HTTPException(404, 'Öğrenci bulunamadı')
    pkg = await db.packages.find_one({'id': payload.package_id})
    if not pkg:
        raise HTTPException(404, 'Paket bulunamadı')
    days = payload.days or pkg['duration_days']
    now = datetime.utcnow()
    await db.users.update_one({'id': student_id}, {'$set': {
        'package_id': payload.package_id,
        'package_start': now,
        'package_end': now + timedelta(days=days),
    }})
    return {'ok': True}


@router.post('/users/{student_id}/package/extend')
async def extend_package(student_id: str, payload: ExtendPackage):
    student = await db.users.find_one({'id': student_id, 'role': 'student'})
    if not student:
        raise HTTPException(404, 'Öğrenci bulunamadı')
    now = datetime.utcnow()
    current_end = student.get('package_end') or now
    if current_end < now:
        current_end = now
    new_end = current_end + timedelta(days=payload.days)
    await db.users.update_one({'id': student_id}, {'$set': {'package_end': new_end}})
    return {'ok': True, 'package_end': new_end}


@router.post('/users/{student_id}/package/cancel')
async def cancel_package(student_id: str):
    await db.users.update_one({'id': student_id}, {'$set': {'package_end': datetime.utcnow()}})
    return {'ok': True}


# ---------- Packages ----------
@router.get('/packages')
async def list_packages():
    return await db.packages.find({}, {'_id': 0}).sort('duration_days', 1).to_list(1000)


@router.post('/packages')
async def create_package(payload: PackageCreate):
    doc = payload.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.utcnow()
    await db.packages.insert_one(doc)
    doc.pop('_id', None)
    return doc


@router.patch('/packages/{pid}')
async def update_package(pid: str, payload: PackageUpdate):
    data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if data:
        await db.packages.update_one({'id': pid}, {'$set': data})
    return {'ok': True}


@router.delete('/packages/{pid}')
async def delete_package(pid: str):
    await db.packages.delete_one({'id': pid})
    return {'ok': True}


# ---------- Sessions ----------
@router.get('/sessions')
async def all_sessions(limit: int = 200):
    sessions = await db.study_sessions.find({}, {'_id': 0}).sort('started_at', -1).limit(limit).to_list(limit)
    for s in sessions:
        u = await db.users.find_one({'id': s['student_id']}, {'_id': 0, 'full_name': 1})
        s['student_name'] = u['full_name'] if u else '—'
    return sessions
