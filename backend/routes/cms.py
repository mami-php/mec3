"""CMS routes: public site content + admin CRUD.

Content is stored as key/value in the `site_content` collection.
Collections used:
- site_content (single doc id='main' + others as needed)
- landing_mentors
- landing_testimonials
- landing_faqs
"""
from datetime import datetime
import uuid
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import db
from security import require_role


DEFAULT_CONTENT = {
    'general': {
        'site_name': 'Koçum Sınav',
        'brand_prefix': 'Koçum',
        'brand_suffix': 'Sınav',
        'brand_tagline': 'MENTORLUK & REHBERLİK',
        'favicon_url': None,
        'phone': '0 850 000 00 00',
        'email': 'destek@kocumsinav.com',
        'address': 'İstanbul, Türkiye',
        'social': {
            'instagram': 'https://instagram.com/kocumsinav',
            'youtube': 'https://youtube.com/kocumsinav',
            'facebook': '',
            'twitter': '',
        },
    },
    'header': {
        'menu': [
            {'label': 'Ana Sayfa', 'href': '#home'},
            {'label': 'Koçluk', 'href': '#kocluk'},
            {'label': 'Deneme Kulübü', 'href': '#deneme'},
            {'label': 'Mentorlar', 'href': '#mentorlar'},
            {'label': 'Başarılarımız', 'href': '#basari'},
            {'label': 'S.S.S', 'href': '#sss'},
            {'label': 'İletişim', 'href': '#iletisim'},
        ],
        'login_label': 'Giriş Yap',
        'register_label': 'Ücretsiz Görüşme',
        'phone_visible': True,
    },
    'hero': {
        'eyebrow': 'YKS • LGS • KPSS',
        'title_gold': 'Koçum Sınav',
        'title_white': 'İçerikleri!',
        'subtitle': 'Derece yapmış koçlar, uzman PDR danışmanları ve kişiye özel çalışma planlarıyla hedef sıralamana ulaş.',
        'primary_cta': 'Ücretsiz Görüşme Planla',
        'secondary_cta': 'Paketleri İncele',
        'stats': [
            {'value': '1.500+', 'label': 'Başarı Hikayesi'},
            {'value': '40+', 'label': 'Uzman Koç'},
            {'value': '%98', 'label': 'Memnuniyet'},
        ],
    },
    'footer': {
        'tagline': 'Koçum Sınav\'la hazır ol, fark yarat. Derece yapmış koçlar, uzman PDR danışmanları ve teknolojiyle desteklenmiş bir sistem.',
        'columns': [
            {'title': 'Ürünler', 'links': ['YKS Koçluk', 'LGS Koçluk', 'Deneme Kulübü', 'KPSS Programı', 'Full Tekrar']},
            {'title': 'Kurumsal', 'links': ['Hakkımızda', 'Mentorlar', 'Başarılarımız', 'Blog', 'Kariyer']},
            {'title': 'Destek', 'links': ['Aboneliğimi Yönet', 'KVKK', 'Mesafeli Satış', 'Bize Ulaşın']},
        ],
        'copyright': None,  # auto-generated
    },
}


async def get_content_doc() -> dict:
    doc = await db.site_content.find_one({'id': 'main'}, {'_id': 0})
    if not doc:
        doc = {'id': 'main', **DEFAULT_CONTENT, 'updated_at': datetime.utcnow()}
        await db.site_content.insert_one(doc)
        doc.pop('_id', None)
    return doc


# ==================== PUBLIC ====================
public_router = APIRouter(prefix='/site', tags=['site-public'])


@public_router.get('/content')
async def public_content():
    doc = await get_content_doc()
    doc.pop('_id', None)
    return doc


@public_router.get('/mentors')
async def public_mentors():
    items = await db.landing_mentors.find({'is_active': {'$ne': False}}, {'_id': 0}).sort('sort_order', 1).to_list(200)
    return items


@public_router.get('/testimonials')
async def public_testimonials():
    items = await db.landing_testimonials.find({'is_active': {'$ne': False}}, {'_id': 0}).sort('sort_order', 1).to_list(200)
    return items


@public_router.get('/faqs')
async def public_faqs():
    items = await db.landing_faqs.find({'is_active': {'$ne': False}}, {'_id': 0}).sort('sort_order', 1).to_list(200)
    return items


@public_router.get('/packages')
async def public_packages():
    items = await db.packages.find({'is_active': True, 'is_landing': {'$ne': False}}, {'_id': 0}).sort('sort_order', 1).to_list(200)
    return items


# ==================== ADMIN ====================
admin_router = APIRouter(prefix='/admin/cms', tags=['cms-admin'], dependencies=[Depends(require_role('admin'))])


class ContentSection(BaseModel):
    section: str  # general | header | hero | footer
    data: dict


@admin_router.get('/content')
async def admin_get_content():
    return await get_content_doc()


@admin_router.put('/content/{section}')
async def admin_update_section(section: str, payload: dict):
    if section not in ('general', 'header', 'hero', 'footer'):
        raise HTTPException(400, 'Geçersiz bölüm')
    await get_content_doc()  # ensure exists
    await db.site_content.update_one({'id': 'main'}, {'$set': {section: payload, 'updated_at': datetime.utcnow()}})
    return {'ok': True}


# ------- Mentors -------
@admin_router.get('/mentors')
async def admin_mentors_list():
    return await db.landing_mentors.find({}, {'_id': 0}).sort('sort_order', 1).to_list(500)


@admin_router.post('/mentors')
async def admin_mentors_create(payload: dict):
    doc = {
        'id': str(uuid.uuid4()),
        'name': payload.get('name', ''),
        'role': payload.get('role', ''),
        'img': payload.get('img', ''),
        'sort_order': payload.get('sort_order', 100),
        'is_active': payload.get('is_active', True),
        'created_at': datetime.utcnow(),
    }
    await db.landing_mentors.insert_one(doc)
    doc.pop('_id', None)
    return doc


@admin_router.patch('/mentors/{mid}')
async def admin_mentors_update(mid: str, payload: dict):
    payload.pop('id', None); payload.pop('_id', None); payload.pop('created_at', None)
    await db.landing_mentors.update_one({'id': mid}, {'$set': payload})
    return {'ok': True}


@admin_router.delete('/mentors/{mid}')
async def admin_mentors_delete(mid: str):
    await db.landing_mentors.delete_one({'id': mid})
    return {'ok': True}


# ------- Testimonials -------
@admin_router.get('/testimonials')
async def admin_test_list():
    return await db.landing_testimonials.find({}, {'_id': 0}).sort('sort_order', 1).to_list(500)


@admin_router.post('/testimonials')
async def admin_test_create(payload: dict):
    doc = {
        'id': str(uuid.uuid4()),
        'name': payload.get('name', ''),
        'role': payload.get('role', ''),
        'text': payload.get('text', ''),
        'rating': int(payload.get('rating', 5)),
        'sort_order': payload.get('sort_order', 100),
        'is_active': payload.get('is_active', True),
        'created_at': datetime.utcnow(),
    }
    await db.landing_testimonials.insert_one(doc)
    doc.pop('_id', None)
    return doc


@admin_router.patch('/testimonials/{tid}')
async def admin_test_update(tid: str, payload: dict):
    payload.pop('id', None); payload.pop('_id', None); payload.pop('created_at', None)
    await db.landing_testimonials.update_one({'id': tid}, {'$set': payload})
    return {'ok': True}


@admin_router.delete('/testimonials/{tid}')
async def admin_test_delete(tid: str):
    await db.landing_testimonials.delete_one({'id': tid})
    return {'ok': True}


# ------- FAQs -------
@admin_router.get('/faqs')
async def admin_faqs_list():
    return await db.landing_faqs.find({}, {'_id': 0}).sort('sort_order', 1).to_list(500)


@admin_router.post('/faqs')
async def admin_faqs_create(payload: dict):
    doc = {
        'id': str(uuid.uuid4()),
        'title': payload.get('title', ''),
        'items': payload.get('items', []),  # [{q, a}]
        'sort_order': payload.get('sort_order', 100),
        'is_active': payload.get('is_active', True),
        'created_at': datetime.utcnow(),
    }
    await db.landing_faqs.insert_one(doc)
    doc.pop('_id', None)
    return doc


@admin_router.patch('/faqs/{fid}')
async def admin_faqs_update(fid: str, payload: dict):
    payload.pop('id', None); payload.pop('_id', None); payload.pop('created_at', None)
    await db.landing_faqs.update_one({'id': fid}, {'$set': payload})
    return {'ok': True}


@admin_router.delete('/faqs/{fid}')
async def admin_faqs_delete(fid: str):
    await db.landing_faqs.delete_one({'id': fid})
    return {'ok': True}
