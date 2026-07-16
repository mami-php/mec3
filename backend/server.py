"""Main FastAPI application."""
from datetime import datetime, timedelta
from pathlib import Path
import os
import uuid
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import db, client  # noqa: E402
from security import hash_password  # noqa: E402
from routes.auth import router as auth_router  # noqa: E402
from routes.ref import router as ref_router  # noqa: E402
from routes.admin import router as admin_router  # noqa: E402
from routes.mentor import router as mentor_router  # noqa: E402
from routes.student import router as student_router  # noqa: E402

app = FastAPI(title='Koçum Sınav API')
api_router = APIRouter(prefix='/api')


@api_router.get('/')
async def root():
    return {'message': 'Koçum Sınav API', 'version': '1.0.0'}


@api_router.get('/health')
async def health():
    return {'status': 'ok', 'time': datetime.utcnow().isoformat()}


api_router.include_router(auth_router)
api_router.include_router(ref_router)
api_router.include_router(admin_router)
api_router.include_router(mentor_router)
api_router.include_router(student_router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


async def _seed():
    """Seed initial admin, mentor, student and packages if missing."""
    now = datetime.utcnow()

    # Packages
    if await db.packages.count_documents({}) == 0:
        for p in [
            {'name': '1 Aylık Koçluk', 'duration_days': 30, 'price': 2999,
             'description': 'Aylık bire bir koçluk desteği',
             'features': ['Haftada 2 canlı görüşme', 'Kişisel program', 'Sınırsız mesajlaşma']},
            {'name': '3 Aylık Koçluk', 'duration_days': 90, 'price': 7999,
             'description': '3 ay boyunca yoğun mentor desteği',
             'features': ['Haftada 2 canlı görüşme', 'Deneme analizi', 'Veli görüşmesi']},
            {'name': '6 Aylık VIP', 'duration_days': 180, 'price': 14999,
             'description': 'YKS/LGS için tam paket',
             'features': ['Derece koçu', 'Deneme kulübü', 'Uzman PDR', 'Öncelikli destek']},
            {'name': '12 Aylık Premium', 'duration_days': 365, 'price': 27999,
             'description': 'Yıllık kapsamlı program',
             'features': ['Tüm VIP özellikleri', '12 ay boyunca destek', 'Yıllık plan']},
        ]:
            await db.packages.insert_one({
                'id': str(uuid.uuid4()),
                **p,
                'is_active': True,
                'created_at': now,
            })
        logger.info('Seeded default packages')

    # Admin
    if not await db.users.find_one({'email': 'admin@kocumsinav.com'}):
        await db.users.insert_one({
            'id': str(uuid.uuid4()),
            'email': 'admin@kocumsinav.com',
            'password_hash': hash_password('admin123'),
            'full_name': 'Sistem Yöneticisi',
            'phone': '+90 500 000 00 00',
            'role': 'admin',
            'status': 'active',
            'avatar': None,
            'created_at': now,
            'last_login': None,
        })
        logger.info('Seeded admin: admin@kocumsinav.com / admin123')

    # Mentor
    mentor = await db.users.find_one({'email': 'mentor@kocumsinav.com'})
    if not mentor:
        mentor_id = str(uuid.uuid4())
        await db.users.insert_one({
            'id': mentor_id,
            'email': 'mentor@kocumsinav.com',
            'password_hash': hash_password('mentor123'),
            'full_name': 'Elif Aydın',
            'phone': '+90 501 000 00 00',
            'role': 'mentor',
            'status': 'active',
            'avatar': None,
            'specialty': 'YKS Sayısal',
            'created_at': now,
            'last_login': None,
        })
        logger.info('Seeded mentor: mentor@kocumsinav.com / mentor123')
    else:
        mentor_id = mentor['id']

    # Student
    if not await db.users.find_one({'email': 'student@kocumsinav.com'}):
        # get a package
        pkg = await db.packages.find_one({}, sort=[('duration_days', 1)])
        pkg_id = pkg['id'] if pkg else None
        days = pkg['duration_days'] if pkg else 30
        await db.users.insert_one({
            'id': str(uuid.uuid4()),
            'email': 'student@kocumsinav.com',
            'password_hash': hash_password('student123'),
            'full_name': 'Ahmet Yılmaz',
            'phone': '+90 502 000 00 00',
            'role': 'student',
            'status': 'active',
            'avatar': None,
            'birth_date': '2007-05-14',
            'city': 'İstanbul',
            'grade': '12.Sınıf',
            'exam_type': 'YKS',
            'target_school': 'Boğaziçi Üniversitesi',
            'target_dept': 'Bilgisayar Mühendisliği',
            'target_score': '480+',
            'mentor_id': mentor_id,
            'package_id': pkg_id,
            'package_start': now,
            'package_end': now + timedelta(days=days),
            'created_at': now,
            'last_login': None,
        })
        logger.info('Seeded student: student@kocumsinav.com / student123')


@app.on_event('startup')
async def on_startup():
    try:
        await _seed()
    except Exception as e:  # noqa: BLE001
        logger.exception('Seed failure: %s', e)


@app.on_event('shutdown')
async def on_shutdown():
    client.close()
