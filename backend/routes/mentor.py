"""Mentor routes."""
from datetime import datetime, timedelta
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query

from database import db
from models import TaskCreate, TaskUpdate
from security import require_role

router = APIRouter(prefix='/mentor', tags=['mentor'], dependencies=[Depends(require_role('mentor'))])


async def _ensure_owns(mentor_id: str, student_id: str):
    s = await db.users.find_one({'id': student_id, 'role': 'student', 'mentor_id': mentor_id})
    if not s:
        raise HTTPException(403, 'Bu öğrenciye erişim izniniz yok')
    return s


@router.get('/dashboard/stats')
async def dashboard(user=Depends(require_role('mentor'))):
    mid = user['id']
    now = datetime.utcnow()
    today = datetime(now.year, now.month, now.day)
    tomorrow = today + timedelta(days=1)

    student_ids = [s['id'] async for s in db.users.find({'role': 'student', 'mentor_id': mid}, {'_id': 0, 'id': 1})]
    total_students = len(student_ids)

    # today study seconds by students
    tsec = 0
    if student_ids:
        async for row in db.study_sessions.aggregate([
            {'$match': {'student_id': {'$in': student_ids}, 'started_at': {'$gte': today, '$lt': tomorrow}, 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            tsec = row['total']

    total_sec_all = 0
    if student_ids:
        async for row in db.study_sessions.aggregate([
            {'$match': {'student_id': {'$in': student_ids}, 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            total_sec_all = row['total']

    pending_tasks = await db.tasks.count_documents({'mentor_id': mid, 'completed': {'$ne': True}}) if student_ids else 0
    completed_tasks = await db.tasks.count_documents({'mentor_id': mid, 'completed': True}) if student_ids else 0

    # today active students
    today_active = 0
    if student_ids:
        distinct = await db.study_sessions.distinct('student_id', {'started_at': {'$gte': today, '$lt': tomorrow}})
        today_active = len(set(distinct) & set(student_ids))

    # 7-day series
    series = []
    for i in range(6, -1, -1):
        d0 = today - timedelta(days=i)
        d1 = d0 + timedelta(days=1)
        acc = 0
        if student_ids:
            async for row in db.study_sessions.aggregate([
                {'$match': {'student_id': {'$in': student_ids}, 'started_at': {'$gte': d0, '$lt': d1}, 'duration_sec': {'$gt': 0}}},
                {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
            ]):
                acc = row['total']
        series.append({'date': d0.strftime('%Y-%m-%d'), 'seconds': acc})

    return {
        'total_students': total_students,
        'today_active': today_active,
        'today_study_seconds': tsec,
        'total_study_seconds': total_sec_all,
        'pending_tasks': pending_tasks,
        'completed_tasks': completed_tasks,
        'series_7d': series,
    }


@router.get('/students')
async def my_students(user=Depends(require_role('mentor'))):
    students = await db.users.find(
        {'role': 'student', 'mentor_id': user['id'], 'status': {'$ne': 'deleted'}},
        {'_id': 0, 'password_hash': 0}
    ).sort('full_name', 1).to_list(500)

    for s in students:
        total_sec = 0
        async for row in db.study_sessions.aggregate([
            {'$match': {'student_id': s['id'], 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            total_sec = row['total']
        s['total_study_seconds'] = total_sec
        s['pending_tasks'] = await db.tasks.count_documents({'student_id': s['id'], 'completed': {'$ne': True}})
        s['completed_tasks'] = await db.tasks.count_documents({'student_id': s['id'], 'completed': True})
    return students


@router.get('/students/{sid}')
async def student_detail(sid: str, user=Depends(require_role('mentor'))):
    await _ensure_owns(user['id'], sid)
    s = await db.users.find_one({'id': sid}, {'_id': 0, 'password_hash': 0})

    now = datetime.utcnow()
    today = datetime(now.year, now.month, now.day)

    # 14-day series
    series = []
    for i in range(13, -1, -1):
        d0 = today - timedelta(days=i)
        d1 = d0 + timedelta(days=1)
        acc = 0
        async for row in db.study_sessions.aggregate([
            {'$match': {'student_id': sid, 'started_at': {'$gte': d0, '$lt': d1}, 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            acc = row['total']
        series.append({'date': d0.strftime('%Y-%m-%d'), 'seconds': acc})

    # subject breakdown
    subj_agg = []
    async for row in db.study_sessions.aggregate([
        {'$match': {'student_id': sid, 'duration_sec': {'$gt': 0}}},
        {'$group': {'_id': '$subject', 'seconds': {'$sum': '$duration_sec'}}},
        {'$sort': {'seconds': -1}},
    ]):
        subj_agg.append({'subject': row['_id'], 'seconds': row['seconds']})

    total_sec = sum(x['seconds'] for x in subj_agg)
    s['total_study_seconds'] = total_sec
    s['series_14d'] = series
    s['subject_breakdown'] = subj_agg
    s['pending_tasks'] = await db.tasks.count_documents({'student_id': sid, 'completed': {'$ne': True}})
    s['completed_tasks'] = await db.tasks.count_documents({'student_id': sid, 'completed': True})
    return s


@router.get('/students/{sid}/sessions')
async def student_sessions(sid: str, limit: int = 100, user=Depends(require_role('mentor'))):
    await _ensure_owns(user['id'], sid)
    return await db.study_sessions.find({'student_id': sid}, {'_id': 0}).sort('started_at', -1).limit(limit).to_list(limit)


# ---------- Tasks / Weekly plan ----------
@router.get('/students/{sid}/tasks')
async def student_tasks(sid: str, week_start: Optional[str] = None, user=Depends(require_role('mentor'))):
    await _ensure_owns(user['id'], sid)
    query = {'student_id': sid}
    if week_start:
        d0 = datetime.strptime(week_start, '%Y-%m-%d')
        query['day_date'] = {'$gte': d0.strftime('%Y-%m-%d'), '$lt': (d0 + timedelta(days=7)).strftime('%Y-%m-%d')}
    return await db.tasks.find(query, {'_id': 0}).sort('day_date', 1).to_list(500)


@router.post('/tasks')
async def create_task(payload: TaskCreate, user=Depends(require_role('mentor'))):
    await _ensure_owns(user['id'], payload.student_id)
    doc = payload.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['mentor_id'] = user['id']
    doc['created_at'] = datetime.utcnow()
    doc['completed'] = False
    await db.tasks.insert_one(doc)
    doc.pop('_id', None)
    return doc


@router.patch('/tasks/{tid}')
async def update_task(tid: str, payload: TaskUpdate, user=Depends(require_role('mentor'))):
    task = await db.tasks.find_one({'id': tid, 'mentor_id': user['id']})
    if not task:
        raise HTTPException(404, 'Görev bulunamadı')
    data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if data:
        await db.tasks.update_one({'id': tid}, {'$set': data})
    return {'ok': True}


@router.delete('/tasks/{tid}')
async def delete_task(tid: str, user=Depends(require_role('mentor'))):
    await db.tasks.delete_one({'id': tid, 'mentor_id': user['id']})
    return {'ok': True}
