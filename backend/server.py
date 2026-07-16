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
from routes.cms import public_router as cms_public_router, admin_router as cms_admin_router  # noqa: E402

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
api_router.include_router(cms_public_router)
api_router.include_router(cms_admin_router)

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
        packs = [
            {'name': '1 Aylık Koçluk', 'duration_days': 30, 'price': 2999,
             'description': 'Aylık bire bir koçluk desteği',
             'features': ['Haftada 2 canlı görüşme', 'Kişisel program', 'Sınırsız mesajlaşma'],
             'sort_order': 10, 'badge': None, 'accent': False},
            {'name': '3 Aylık Koçluk', 'duration_days': 90, 'price': 7999,
             'description': '3 ay boyunca yoğun mentor desteği',
             'features': ['Haftada 2 canlı görüşme', 'Deneme analizi', 'Veli görüşmesi'],
             'sort_order': 20, 'badge': 'Popüler', 'accent': True},
            {'name': '6 Aylık VIP', 'duration_days': 180, 'price': 14999,
             'description': 'YKS/LGS için tam paket',
             'features': ['Derece koçu', 'Deneme kulübü', 'Uzman PDR', 'Öncelikli destek'],
             'sort_order': 30, 'badge': 'Avantaj', 'accent': False},
            {'name': '12 Aylık Premium', 'duration_days': 365, 'price': 27999,
             'description': 'Yıllık kapsamlı program',
             'features': ['Tüm VIP özellikleri', '12 ay boyunca destek', 'Yıllık plan'],
             'sort_order': 40, 'badge': None, 'accent': False},
        ]
        for p in packs:
            await db.packages.insert_one({
                'id': str(uuid.uuid4()),
                **p,
                'is_active': True,
                'is_landing': True,
                'created_at': now,
            })
        logger.info('Seeded default packages')

    # Landing mentors
    if await db.landing_mentors.count_documents({}) == 0:
        landing_mentors = [
            ('Elif Aydın', 'YKS Derece Koçu • Tıp', 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Mehmet Kaya', 'AYT Uzmanı • Boğaziçi Ünv.', 'https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Zeynep Demir', 'Uzman PDR Danışmanı', 'https://images.unsplash.com/photo-1613299469603-6e629423af83?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Ahmet Yılmaz', 'TYT Koçu • ODTÜ', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Selin Öz', 'LGS Koçu • Yıldız Teknik', 'https://images.unsplash.com/photo-1526342189144-aa78e49e68b4?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Kaan Doğan', 'SAY Derece Koçu • Hacettepe Tıp', 'https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Rabia Şahin', 'EA Koçu • İstanbul Hukuk', 'https://images.unsplash.com/photo-1612203304476-2ed23c55b5b9?w=600&h=800&fit=crop&crop=faces&q=80'),
            ('Emre Polat', 'YKS Matematik Koçu', 'https://images.unsplash.com/photo-1611695434398-4f4b330623e6?w=600&h=800&fit=crop&crop=faces&q=80'),
        ]
        for i, (n, r, img) in enumerate(landing_mentors):
            await db.landing_mentors.insert_one({
                'id': str(uuid.uuid4()), 'name': n, 'role': r, 'img': img,
                'sort_order': (i + 1) * 10, 'is_active': True, 'created_at': now,
            })
        logger.info('Seeded landing mentors')

    # Landing testimonials
    if await db.landing_testimonials.count_documents({}) == 0:
        testis = [
            ('Zeynep Kaya', 'Öğrenci • YKS 2024',
             'Koçum Sınav\'a başlamadan önce masaya oturup ne çalışacağımı düşünmekten 1 saatim gidiyordu. Şimdi her şey programlı, tıkır tıkır işliyor.', 5),
            ('Sevgi Yılmaz', 'Veli',
             'Çalışan bir anne olarak oğlumun durumunu takip etmekte çok zorlanıyordum. Koçum Sınav sayesinde telefondan haftalık raporları görebiliyor, içim rahat ediyor.', 5),
            ('Emirhan Demir', 'Mezun • YKS 1119.',
             'Mezun senesi çok yıpratıcı bir süreç. Tek başıma yapamam diyip Koçum Sınav ile tanıştım. Sadece ders değil psikolojik olarak da inanılmaz destek sağladılar.', 5),
            ('Büşra Şahin', 'Öğrenci',
             'Deneme netlerim aylardır yerinde sayıyordu, 2 ayda uçtu. Programlama ve analiz taktikleri cidden işe yarıyor.', 5),
            ('Ceren Arslan', 'Öğrenci',
             'Benim için sadece bir rehberlik kurumu değil, gerçek bir destek oldular. Uyku düzenimi, sınav stresimi bile beraber yönetiyoruz.', 5),
            ('Murat Aydın', 'Veli',
             'Kızımın motivasyonu çok düşmüştü, Koçum Sınav ekibi sayesinde toparladı. Koçu o kadar ilgili ki sanki kendi kardeşi sınava hazırlanıyor gibi.', 5),
        ]
        for i, (n, r, t, rating) in enumerate(testis):
            await db.landing_testimonials.insert_one({
                'id': str(uuid.uuid4()), 'name': n, 'role': r, 'text': t, 'rating': rating,
                'sort_order': (i + 1) * 10, 'is_active': True, 'created_at': now,
            })
        logger.info('Seeded landing testimonials')

    # Landing FAQs
    if await db.landing_faqs.count_documents({}) == 0:
        faqs = [
            ('Koçluk Sistemi', [
                {'q': 'Koçumu ben mi seçiyorum, sistem mi atıyor?',
                 'a': 'Rastgele atama yoktur. Sana ve koçlarımıza uyguladığımız detaylı kişilik analizi sonucunda hedeflerine ve öğrenme stiline en uygun koçları karşına çıkarıyoruz.'},
                {'q': 'Koçumla sadece haftada bir mi iletişim kurabilirim?',
                 'a': 'Hayır. Haftalık planlı görüntülü görüşmelerimizin yanı sıra, uygulama üzerinden koçunla kesintisiz iletişimde kalabilirsin.'},
                {'q': 'Programlarda sadece çözülecek testler mi yer alıyor?',
                 'a': 'Hayır. Bir gün içinde yapman gereken bütün çalışmalar en küçük ayrıntısına kadar koçun tarafından planlanıyor.'},
                {'q': 'Koçumu değiştirebilir miyim?',
                 'a': 'Kesinlikle. Uyum yakalayamadığını hissedersen sistem üzerinden koç değişikliği talep edebilirsin.'},
            ]),
            ('Veli & Takip', [
                {'q': 'Bir veli olarak gelişimi nasıl takip ederim?',
                 'a': 'Destekleyici Veli modelini kurguluyoruz. Düzenli SMS bilgilendirmeleriyle deneme analizlerini paylaşıyoruz.'},
                {'q': 'Sadece ders çalışıp çalışmadığını mı takip ediyorsunuz?',
                 'a': 'Hayır. Eksik konuları tespit eder, ekran süresi ve okuma alışkanlığı üzerine de takip yaparız.'},
            ]),
            ('Genel', [
                {'q': 'Paketimi yükseltebilir miyim?',
                 'a': 'Tabii. İstediğin zaman farkı ödeyerek üst pakete geçebilirsin.'},
            ]),
        ]
        for i, (title, items) in enumerate(faqs):
            await db.landing_faqs.insert_one({
                'id': str(uuid.uuid4()), 'title': title, 'items': items,
                'sort_order': (i + 1) * 10, 'is_active': True, 'created_at': now,
            })
        logger.info('Seeded landing FAQs')

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
