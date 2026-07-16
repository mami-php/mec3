"""Static reference data (subjects, exam types, etc)."""
from fastapi import APIRouter

router = APIRouter(prefix='/ref', tags=['ref'])

SUBJECTS = [
    'Matematik', 'Geometri', 'Türkçe', 'Edebiyat', 'Tarih', 'Coğrafya',
    'Felsefe', 'Din Kültürü', 'Fizik', 'Kimya', 'Biyoloji', 'İngilizce',
    'Anayasa', 'Vatandaşlık', 'Genel Kültür', 'Genel Yetenek',
]

EXAM_TYPES = ['YKS', 'LGS', 'KPSS', 'ALES', 'YDS', 'DGS']
GRADES = ['5.Sınıf', '6.Sınıf', '7.Sınıf', '8.Sınıf', '9.Sınıf', '10.Sınıf', '11.Sınıf', '12.Sınıf', 'Mezun', 'Üniversite']
TASK_TYPES = ['test', 'konu', 'tekrar', 'okuma', 'ödev', 'deneme']


@router.get('/subjects')
async def subjects():
    return SUBJECTS


@router.get('/exam-types')
async def exam_types():
    return EXAM_TYPES


@router.get('/grades')
async def grades():
    return GRADES


@router.get('/task-types')
async def task_types():
    return TASK_TYPES
