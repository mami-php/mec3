"""Student routes: plan, tasks, kronometre (study sessions), stats."""
from datetime import datetime, timedelta
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException

from database import db
from models import StudySessionStart, StudySessionStop
from security import require_role

router = APIRouter(prefix='/student', tags=['student'], dependencies=[Depends(require_role('student'))])


async def _package_active(user: dict) -> bool:
    end = user.get('package_end')
    return bool(end and end > datetime.utcnow())


def _monday(d: datetime) -> datetime:
    return d - timedelta(days=d.weekday())


@router.get('/plan')
async def weekly_plan(week: Optional[str] = None, user=Depends(require_role('student'))):
    now = datetime.utcnow()
    base = datetime.strptime(week, '%Y-%m-%d') if week else _monday(datetime(now.year, now.month, now.day))
    d0 = _monday(base)
    days = []
    for i in range(7):
        d = d0 + timedelta(days=i)
        ds = d.strftime('%Y-%m-%d')
        tasks = await db.tasks.find({'student_id': user['id'], 'day_date': ds}, {'_id': 0}).sort('created_at', 1).to_list(200)
        # session totals for the day
        d1 = d + timedelta(days=1)
        day_sec = 0
        async for row in db.study_sessions.aggregate([
            {'$match': {'student_id': user['id'], 'started_at': {'$gte': d, '$lt': d1}, 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            day_sec = row['total']
        days.append({'date': ds, 'tasks': tasks, 'study_seconds': day_sec})
    return {'week_start': d0.strftime('%Y-%m-%d'), 'days': days}


@router.post('/tasks/{tid}/toggle')
async def toggle_task(tid: str, user=Depends(require_role('student'))):
    task = await db.tasks.find_one({'id': tid, 'student_id': user['id']})
    if not task:
        raise HTTPException(404, 'Görev bulunamadı')
    new_val = not task.get('completed', False)
    await db.tasks.update_one({'id': tid}, {'$set': {
        'completed': new_val,
        'completed_at': datetime.utcnow() if new_val else None,
    }})
    return {'ok': True, 'completed': new_val}


# ---------- Kronometre ----------
@router.post('/sessions/start')
async def start_session(payload: StudySessionStart, user=Depends(require_role('student'))):
    if not await _package_active(user):
        raise HTTPException(403, 'Paket süreniz sona ermiş')
    # close any open (unfinished) sessions to be safe
    await db.study_sessions.update_many(
        {'student_id': user['id'], 'ended_at': None},
        {'$set': {'ended_at': datetime.utcnow(), 'duration_sec': 0, 'aborted': True}}
    )
    now = datetime.utcnow()
    doc = {
        'id': str(uuid.uuid4()),
        'student_id': user['id'],
        'mentor_id': user.get('mentor_id'),
        'subject': payload.subject,
        'topic': payload.topic,
        'started_at': now,
        'ended_at': None,
        'duration_sec': 0,
    }
    await db.study_sessions.insert_one(doc)
    doc.pop('_id', None)
    return doc


@router.post('/sessions/stop')
async def stop_session(payload: StudySessionStop, user=Depends(require_role('student'))):
    s = await db.study_sessions.find_one({'id': payload.session_id, 'student_id': user['id']})
    if not s:
        raise HTTPException(404, 'Oturum bulunamadı')
    if s.get('ended_at'):
        raise HTTPException(400, 'Oturum zaten sonlanmış')
    end = datetime.utcnow()
    dur = int((end - s['started_at']).total_seconds())
    await db.study_sessions.update_one({'id': s['id']}, {'$set': {
        'ended_at': end,
        'duration_sec': max(dur, 0),
        'note': payload.note,
    }})
    s['ended_at'] = end
    s['duration_sec'] = dur
    s.pop('_id', None)
    return s


@router.get('/sessions/active')
async def get_active(user=Depends(require_role('student'))):
    s = await db.study_sessions.find_one({'student_id': user['id'], 'ended_at': None}, {'_id': 0})
    return s


@router.get('/sessions')
async def list_sessions(limit: int = 50, user=Depends(require_role('student'))):
    return await db.study_sessions.find({'student_id': user['id']}, {'_id': 0}).sort('started_at', -1).limit(limit).to_list(limit)


# ---------- Stats ----------
@router.get('/stats')
async def stats(user=Depends(require_role('student'))):
    now = datetime.utcnow()
    today = datetime(now.year, now.month, now.day)
    tomorrow = today + timedelta(days=1)
    week_start = today - timedelta(days=today.weekday())
    month_start = datetime(today.year, today.month, 1)

    async def _sum(match):
        acc = 0
        async for row in db.study_sessions.aggregate([
            {'$match': {**match, 'student_id': user['id'], 'duration_sec': {'$gt': 0}}},
            {'$group': {'_id': None, 'total': {'$sum': '$duration_sec'}}},
        ]):
            acc = row['total']
        return acc

    today_sec = await _sum({'started_at': {'$gte': today, '$lt': tomorrow}})
    week_sec = await _sum({'started_at': {'$gte': week_start}})
    month_sec = await _sum({'started_at': {'$gte': month_start}})
    total_sec = await _sum({})

    # top subject
    top_subject = None
    async for row in db.study_sessions.aggregate([
        {'$match': {'student_id': user['id'], 'duration_sec': {'$gt': 0}}},
        {'$group': {'_id': '$subject', 'seconds': {'$sum': '$duration_sec'}}},
        {'$sort': {'seconds': -1}},
        {'$limit': 1},
    ]):
        top_subject = row['_id']

    # 14 day series
    series = []
    for i in range(13, -1, -1):
        d0 = today - timedelta(days=i)
        d1 = d0 + timedelta(days=1)
        acc = await _sum({'started_at': {'$gte': d0, '$lt': d1}})
        series.append({'date': d0.strftime('%Y-%m-%d'), 'seconds': acc})

    # subject breakdown
    subj = []
    async for row in db.study_sessions.aggregate([
        {'$match': {'student_id': user['id'], 'duration_sec': {'$gt': 0}}},
        {'$group': {'_id': '$subject', 'seconds': {'$sum': '$duration_sec'}}},
        {'$sort': {'seconds': -1}},
    ]):
        subj.append({'subject': row['_id'], 'seconds': row['seconds']})

    completed_tasks = await db.tasks.count_documents({'student_id': user['id'], 'completed': True})
    pending_tasks = await db.tasks.count_documents({'student_id': user['id'], 'completed': {'$ne': True}})

    # streak: consecutive days with session > 0
    streak = 0
    day = today
    while True:
        d1 = day + timedelta(days=1)
        s = await _sum({'started_at': {'$gte': day, '$lt': d1}})
        if s > 0:
            streak += 1
            day -= timedelta(days=1)
        else:
            # allow today to be 0 but not break streak (started later)
            if day == today and streak == 0:
                day -= timedelta(days=1)
                continue
            break

    return {
        'today_seconds': today_sec,
        'week_seconds': week_sec,
        'month_seconds': month_sec,
        'total_seconds': total_sec,
        'top_subject': top_subject,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
        'streak_days': streak,
        'series_14d': series,
        'subject_breakdown': subj,
    }
