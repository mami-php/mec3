"""
Comprehensive backend API test for NEW CMS endpoints and UPDATED Student endpoints.
Tests: Public CMS, Admin CMS CRUD, Student plan updates with date validation.
"""
import httpx
import time
from datetime import datetime, timedelta

# Base URL from frontend/.env
BASE_URL = "https://mentor-hub-226.preview.emergentagent.com/api"

# Seeded accounts
ADMIN_EMAIL = "admin@kocumsinav.com"
ADMIN_PASSWORD = "admin123"
STUDENT_EMAIL = "student@kocumsinav.com"
STUDENT_PASSWORD = "student123"
MENTOR_EMAIL = "mentor@kocumsinav.com"
MENTOR_PASSWORD = "mentor123"

# Global tokens
admin_token = None
student_token = None
mentor_token = None
seeded_student_id = None

# Test data storage
created_mentor_id = None
created_testimonial_id = None
created_faq_id = None
created_personal_task_id = None
created_mentor_task_id = None

def log(msg):
    print(f"[TEST] {msg}")

def fail(msg, response=None):
    print(f"❌ FAIL: {msg}")
    if response:
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:500]}")
    return False

def success(msg):
    print(f"✅ PASS: {msg}")
    return True

# ============ SETUP: LOGIN ============
def setup_auth():
    global admin_token, student_token, mentor_token, seeded_student_id
    
    log("Setting up authentication...")
    
    # Login as admin
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    if resp.status_code != 200:
        return fail("Admin login failed", resp)
    admin_token = resp.json()["access_token"]
    success("Admin login successful")
    
    # Login as student
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD}, timeout=30)
    if resp.status_code != 200:
        return fail("Student login failed", resp)
    data = resp.json()
    student_token = data["access_token"]
    seeded_student_id = data["user"]["id"]
    success("Student login successful")
    
    # Login as mentor
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": MENTOR_EMAIL, "password": MENTOR_PASSWORD}, timeout=30)
    if resp.status_code != 200:
        return fail("Mentor login failed", resp)
    mentor_token = resp.json()["access_token"]
    success("Mentor login successful")
    
    return True

# ============ PUBLIC CMS TESTS (no auth required) ============
def test_public_cms():
    log("Testing PUBLIC CMS endpoints (no auth)...")
    
    # 1. GET /api/site/content
    resp = httpx.get(f"{BASE_URL}/site/content", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/content failed", resp)
    content = resp.json()
    required_keys = ["general", "header", "hero", "footer"]
    for key in required_keys:
        if key not in content:
            return fail(f"GET /api/site/content missing key: {key}", resp)
    success("GET /api/site/content returns object with general, header, hero, footer")
    
    # 2. GET /api/site/mentors
    resp = httpx.get(f"{BASE_URL}/site/mentors", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/mentors failed", resp)
    mentors = resp.json()
    if not isinstance(mentors, list):
        return fail("GET /api/site/mentors should return array", resp)
    if len(mentors) < 8:
        return fail(f"GET /api/site/mentors should return 8 seeded mentors, got {len(mentors)}", resp)
    success(f"GET /api/site/mentors returns list of {len(mentors)} landing mentors (seeded 8)")
    
    # 3. GET /api/site/testimonials
    resp = httpx.get(f"{BASE_URL}/site/testimonials", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/testimonials failed", resp)
    testimonials = resp.json()
    if not isinstance(testimonials, list):
        return fail("GET /api/site/testimonials should return array", resp)
    if len(testimonials) < 6:
        return fail(f"GET /api/site/testimonials should return 6 seeded testimonials, got {len(testimonials)}", resp)
    success(f"GET /api/site/testimonials returns list of {len(testimonials)} testimonials (seeded 6)")
    
    # 4. GET /api/site/faqs
    resp = httpx.get(f"{BASE_URL}/site/faqs", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/faqs failed", resp)
    faqs = resp.json()
    if not isinstance(faqs, list):
        return fail("GET /api/site/faqs should return array", resp)
    if len(faqs) < 3:
        return fail(f"GET /api/site/faqs should return 3 seeded groups, got {len(faqs)}", resp)
    success(f"GET /api/site/faqs returns list of {len(faqs)} FAQ groups (seeded 3)")
    
    # 5. GET /api/site/packages
    resp = httpx.get(f"{BASE_URL}/site/packages", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/packages failed", resp)
    packages = resp.json()
    if not isinstance(packages, list):
        return fail("GET /api/site/packages should return array", resp)
    if len(packages) < 4:
        return fail(f"GET /api/site/packages should return 4 seeded packages, got {len(packages)}", resp)
    success(f"GET /api/site/packages returns {len(packages)} landing packages (seeded 4)")
    
    return True

# ============ ADMIN CMS CONTENT SECTIONS ============
def test_admin_cms_content():
    log("Testing ADMIN CMS content sections...")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    student_headers = {"Authorization": f"Bearer {student_token}"}
    
    # 1. GET /api/admin/cms/content (admin token)
    resp = httpx.get(f"{BASE_URL}/admin/cms/content", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/admin/cms/content with admin token failed", resp)
    content = resp.json()
    required_keys = ["general", "header", "hero", "footer"]
    for key in required_keys:
        if key not in content:
            return fail(f"GET /api/admin/cms/content missing key: {key}", resp)
    success("GET /api/admin/cms/content (admin token) returns full content")
    
    # 2. Non-admin (student) trying GET /api/admin/cms/content → 403
    resp = httpx.get(f"{BASE_URL}/admin/cms/content", headers=student_headers, timeout=30)
    if resp.status_code != 403:
        return fail(f"Non-admin access to /api/admin/cms/content should return 403, got {resp.status_code}", resp)
    success("Non-admin (student) trying GET /api/admin/cms/content returns 403")
    
    # 3. PUT /api/admin/cms/content/general
    general_update = {
        "site_name": "TEST SITE",
        "phone": "0212 000 00 00",
        "brand_prefix": "Koçum",
        "brand_suffix": "Sınav",
        "brand_tagline": "TEST",
        "email": "test@test.com",
        "address": "Test",
        "social": {
            "instagram": "https://ig.com/test"
        }
    }
    resp = httpx.put(f"{BASE_URL}/admin/cms/content/general", json=general_update, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("PUT /api/admin/cms/content/general failed", resp)
    success("PUT /api/admin/cms/content/general updated successfully")
    
    # 4. GET /api/site/content → verify site_name is 'TEST SITE'
    resp = httpx.get(f"{BASE_URL}/site/content", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/content after update failed", resp)
    content = resp.json()
    if content.get("general", {}).get("site_name") != "TEST SITE":
        return fail(f"site_name should be 'TEST SITE', got {content.get('general', {}).get('site_name')}", resp)
    success("GET /api/site/content verifies site_name is 'TEST SITE'")
    
    # 5. PUT /api/admin/cms/content/hero
    hero_update = {
        "eyebrow": "TEST EYEBROW",
        "title_gold": "Test Title",
        "title_white": "Beyaz",
        "subtitle": "abc",
        "primary_cta": "A",
        "secondary_cta": "B",
        "stats": [{"value": "100+", "label": "X"}]
    }
    resp = httpx.put(f"{BASE_URL}/admin/cms/content/hero", json=hero_update, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("PUT /api/admin/cms/content/hero failed", resp)
    success("PUT /api/admin/cms/content/hero updated successfully")
    
    # 6. Verify via public GET
    resp = httpx.get(f"{BASE_URL}/site/content", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/content after hero update failed", resp)
    content = resp.json()
    if content.get("hero", {}).get("eyebrow") != "TEST EYEBROW":
        return fail(f"hero.eyebrow should be 'TEST EYEBROW', got {content.get('hero', {}).get('eyebrow')}", resp)
    success("GET /api/site/content verifies hero.eyebrow is 'TEST EYEBROW'")
    
    # 7. PUT /api/admin/cms/content/invalid_section → 400 error
    resp = httpx.put(f"{BASE_URL}/admin/cms/content/invalid_section", json={"test": "data"}, headers=admin_headers, timeout=30)
    if resp.status_code != 400:
        return fail(f"PUT invalid section should return 400, got {resp.status_code}", resp)
    success("PUT /api/admin/cms/content/invalid_section returns 400 error")
    
    # 8. Revert site_name to 'Koçum Sınav'
    general_revert = {
        "site_name": "Koçum Sınav",
        "phone": "0 850 000 00 00",
        "brand_prefix": "Koçum",
        "brand_suffix": "Sınav",
        "brand_tagline": "MENTORLUK & REHBERLİK",
        "email": "destek@kocumsinav.com",
        "address": "İstanbul, Türkiye",
        "social": {
            "instagram": "https://instagram.com/kocumsinav",
            "youtube": "https://youtube.com/kocumsinav",
            "facebook": "",
            "twitter": ""
        }
    }
    resp = httpx.put(f"{BASE_URL}/admin/cms/content/general", json=general_revert, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("Reverting site_name failed", resp)
    success("Reverted site_name to 'Koçum Sınav'")
    
    return True

# ============ ADMIN CMS MENTORS CRUD ============
def test_admin_cms_mentors():
    global created_mentor_id
    log("Testing ADMIN CMS mentors CRUD...")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. GET /api/admin/cms/mentors
    resp = httpx.get(f"{BASE_URL}/admin/cms/mentors", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/admin/cms/mentors failed", resp)
    mentors = resp.json()
    if not isinstance(mentors, list):
        return fail("GET /api/admin/cms/mentors should return array", resp)
    success(f"GET /api/admin/cms/mentors returns list of {len(mentors)} mentors")
    
    # 2. POST /api/admin/cms/mentors
    new_mentor = {
        "name": "Test Mentor",
        "role": "YKS Test",
        "img": "https://a.com/x.jpg",
        "sort_order": 999,
        "is_active": True
    }
    resp = httpx.post(f"{BASE_URL}/admin/cms/mentors", json=new_mentor, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /api/admin/cms/mentors failed", resp)
    mentor = resp.json()
    if "id" not in mentor:
        return fail("Created mentor missing id", resp)
    created_mentor_id = mentor["id"]
    success(f"POST /api/admin/cms/mentors created mentor with id={created_mentor_id}")
    
    # 3. PATCH /api/admin/cms/mentors/{id}
    resp = httpx.patch(f"{BASE_URL}/admin/cms/mentors/{created_mentor_id}", json={"name": "Updated Mentor"}, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("PATCH /api/admin/cms/mentors/{id} failed", resp)
    success("PATCH /api/admin/cms/mentors/{id} updated name to 'Updated Mentor'")
    
    # 4. GET /api/site/mentors → verify the new one appears (sorted by sort_order)
    resp = httpx.get(f"{BASE_URL}/site/mentors", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/mentors after creation failed", resp)
    mentors = resp.json()
    found = [m for m in mentors if m.get("id") == created_mentor_id]
    if not found:
        return fail("Created mentor not found in public mentors list", resp)
    if found[0].get("name") != "Updated Mentor":
        return fail(f"Mentor name should be 'Updated Mentor', got {found[0].get('name')}", resp)
    success("GET /api/site/mentors verifies new mentor appears with updated name")
    
    # 5. PATCH set is_active=false
    resp = httpx.patch(f"{BASE_URL}/admin/cms/mentors/{created_mentor_id}", json={"is_active": False}, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("PATCH set is_active=false failed", resp)
    success("PATCH set is_active=false successful")
    
    # 6. Verify public GET /api/site/mentors no longer includes it
    resp = httpx.get(f"{BASE_URL}/site/mentors", timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/site/mentors after is_active=false failed", resp)
    mentors = resp.json()
    found = [m for m in mentors if m.get("id") == created_mentor_id]
    if found:
        return fail("Inactive mentor should not appear in public mentors list", resp)
    success("GET /api/site/mentors verifies inactive mentor is not included")
    
    # 7. DELETE /api/admin/cms/mentors/{id}
    resp = httpx.delete(f"{BASE_URL}/admin/cms/mentors/{created_mentor_id}", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /api/admin/cms/mentors/{id} failed", resp)
    success("DELETE /api/admin/cms/mentors/{id} deleted mentor")
    
    return True

# ============ ADMIN CMS TESTIMONIALS CRUD ============
def test_admin_cms_testimonials():
    global created_testimonial_id
    log("Testing ADMIN CMS testimonials CRUD...")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. POST create
    new_testimonial = {
        "name": "Test",
        "role": "Öğrenci",
        "text": "harika",
        "rating": 5
    }
    resp = httpx.post(f"{BASE_URL}/admin/cms/testimonials", json=new_testimonial, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /api/admin/cms/testimonials failed", resp)
    testimonial = resp.json()
    if "id" not in testimonial:
        return fail("Created testimonial missing id", resp)
    created_testimonial_id = testimonial["id"]
    success(f"POST /api/admin/cms/testimonials created testimonial with id={created_testimonial_id}")
    
    # 2. PATCH update text
    resp = httpx.patch(f"{BASE_URL}/admin/cms/testimonials/{created_testimonial_id}", json={"text": "çok harika"}, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("PATCH /api/admin/cms/testimonials/{id} failed", resp)
    success("PATCH /api/admin/cms/testimonials/{id} updated text")
    
    # 3. DELETE
    resp = httpx.delete(f"{BASE_URL}/admin/cms/testimonials/{created_testimonial_id}", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /api/admin/cms/testimonials/{id} failed", resp)
    success("DELETE /api/admin/cms/testimonials/{id} deleted testimonial")
    
    return True

# ============ ADMIN CMS FAQs CRUD ============
def test_admin_cms_faqs():
    global created_faq_id
    log("Testing ADMIN CMS FAQs CRUD...")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. POST create
    new_faq = {
        "title": "Test Grup",
        "items": [{"q": "soru?", "a": "cevap"}]
    }
    resp = httpx.post(f"{BASE_URL}/admin/cms/faqs", json=new_faq, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /api/admin/cms/faqs failed", resp)
    faq = resp.json()
    if "id" not in faq:
        return fail("Created FAQ missing id", resp)
    created_faq_id = faq["id"]
    success(f"POST /api/admin/cms/faqs created FAQ with id={created_faq_id}")
    
    # 2. PATCH update title
    resp = httpx.patch(f"{BASE_URL}/admin/cms/faqs/{created_faq_id}", json={"title": "Updated Test Grup"}, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("PATCH /api/admin/cms/faqs/{id} failed", resp)
    success("PATCH /api/admin/cms/faqs/{id} updated title")
    
    # 3. DELETE
    resp = httpx.delete(f"{BASE_URL}/admin/cms/faqs/{created_faq_id}", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /api/admin/cms/faqs/{id} failed", resp)
    success("DELETE /api/admin/cms/faqs/{id} deleted FAQ")
    
    return True

# ============ STUDENT PLAN UPDATES ============
def test_student_plan_updates():
    global created_personal_task_id, created_mentor_task_id, seeded_student_id
    log("Testing STUDENT plan updates (this-week-only + personal task)...")
    student_headers = {"Authorization": f"Bearer {student_token}"}
    mentor_headers = {"Authorization": f"Bearer {mentor_token}"}
    
    # 1. GET /api/student/plan → should have no `week` query param support anymore
    resp = httpx.get(f"{BASE_URL}/student/plan", headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/student/plan failed", resp)
    plan = resp.json()
    
    # Verify returns week_start=Monday of current week
    if "week_start" not in plan:
        return fail("GET /api/student/plan missing week_start", resp)
    week_start = datetime.strptime(plan["week_start"], "%Y-%m-%d")
    if week_start.weekday() != 0:
        return fail(f"week_start should be Monday (weekday=0), got weekday={week_start.weekday()}", resp)
    
    # Verify days array of 7
    if "days" not in plan or len(plan["days"]) != 7:
        return fail(f"GET /api/student/plan should have 7 days, got {len(plan.get('days', []))}", resp)
    
    # Verify `today` key with today's date YYYY-MM-DD
    if "today" not in plan:
        return fail("GET /api/student/plan missing 'today' key", resp)
    today_str = plan["today"]
    try:
        today_date = datetime.strptime(today_str, "%Y-%m-%d")
    except ValueError:
        return fail(f"'today' should be YYYY-MM-DD format, got {today_str}", resp)
    
    success("GET /api/student/plan returns week_start=Monday, days array of 7, and today key")
    
    # 2. POST /api/student/tasks with a date INSIDE current week (today)
    today_iso = datetime.utcnow().strftime("%Y-%m-%d")
    personal_task = {
        "day_date": today_iso,
        "subject": "Matematik",
        "topic": "Türev",
        "task_type": "ödev",
        "target_qcount": 20
    }
    resp = httpx.post(f"{BASE_URL}/student/tasks", json=personal_task, headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /api/student/tasks with today's date failed", resp)
    task = resp.json()
    if "id" not in task or task.get("created_by") != "student":
        return fail("Created task missing id or created_by != 'student'", resp)
    created_personal_task_id = task["id"]
    success(f"POST /api/student/tasks with today's date created task with id={created_personal_task_id}, created_by='student'")
    
    # 3. POST /api/student/tasks with a date FROM PAST WEEK (7 days ago) → should return 400
    past_date = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")
    past_task = {
        "day_date": past_date,
        "subject": "Fizik",
        "topic": "Hareket",
        "task_type": "test",
        "target_qcount": 30
    }
    resp = httpx.post(f"{BASE_URL}/student/tasks", json=past_task, headers=student_headers, timeout=30)
    if resp.status_code != 400:
        return fail(f"POST /api/student/tasks with past week date should return 400, got {resp.status_code}", resp)
    if "Sadece bu hafta içine görev ekleyebilirsin" not in resp.text:
        return fail("Error message should contain 'Sadece bu hafta içine görev ekleyebilirsin'", resp)
    success("POST /api/student/tasks with past week date returns 400 'Sadece bu hafta içine görev ekleyebilirsin'")
    
    # 4. POST /api/student/tasks with a date NEXT WEEK (8 days ahead) → should also return 400
    future_date = (datetime.utcnow() + timedelta(days=8)).strftime("%Y-%m-%d")
    future_task = {
        "day_date": future_date,
        "subject": "Kimya",
        "topic": "Asitler",
        "task_type": "konu",
        "target_duration_min": 45
    }
    resp = httpx.post(f"{BASE_URL}/student/tasks", json=future_task, headers=student_headers, timeout=30)
    if resp.status_code != 400:
        return fail(f"POST /api/student/tasks with next week date should return 400, got {resp.status_code}", resp)
    if "Sadece bu hafta içine görev ekleyebilirsin" not in resp.text:
        return fail("Error message should contain 'Sadece bu hafta içine görev ekleyebilirsin'", resp)
    success("POST /api/student/tasks with next week date returns 400 'Sadece bu hafta içine görev ekleyebilirsin'")
    
    # 5. GET /api/student/plan → the personal task appears with created_by='student'
    resp = httpx.get(f"{BASE_URL}/student/plan", headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/student/plan after personal task creation failed", resp)
    plan = resp.json()
    # Find today's tasks
    today_tasks = []
    for day in plan["days"]:
        if day["date"] == today_iso:
            today_tasks = day["tasks"]
            break
    found = [t for t in today_tasks if t.get("id") == created_personal_task_id]
    if not found:
        return fail("Personal task not found in student plan", resp)
    if found[0].get("created_by") != "student":
        return fail(f"Personal task created_by should be 'student', got {found[0].get('created_by')}", resp)
    success("GET /api/student/plan shows personal task with created_by='student'")
    
    # 6. Create task via mentor for same student for today
    mentor_task = {
        "student_id": seeded_student_id,
        "day_date": today_iso,
        "subject": "Biyoloji",
        "topic": "Hücre",
        "task_type": "test",
        "target_qcount": 25
    }
    resp = httpx.post(f"{BASE_URL}/mentor/tasks", json=mentor_task, headers=mentor_headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /api/mentor/tasks for student failed", resp)
    task = resp.json()
    if "id" not in task:
        return fail("Mentor task missing id", resp)
    created_mentor_task_id = task["id"]
    # Verify created_by='mentor' (should be set by backend)
    success(f"POST /api/mentor/tasks created task with id={created_mentor_task_id}")
    
    # 7. Login back as student, GET /api/student/plan → both tasks appear
    resp = httpx.get(f"{BASE_URL}/student/plan", headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /api/student/plan after mentor task creation failed", resp)
    plan = resp.json()
    # Find today's tasks
    today_tasks = []
    for day in plan["days"]:
        if day["date"] == today_iso:
            today_tasks = day["tasks"]
            break
    
    # Check both tasks appear
    personal_found = [t for t in today_tasks if t.get("id") == created_personal_task_id]
    mentor_found = [t for t in today_tasks if t.get("id") == created_mentor_task_id]
    
    if not personal_found:
        return fail("Personal task not found in student plan after mentor task creation", resp)
    if not mentor_found:
        return fail("Mentor task not found in student plan", resp)
    
    # Verify created_by fields
    if personal_found[0].get("created_by") != "student":
        return fail(f"Personal task created_by should be 'student', got {personal_found[0].get('created_by')}", resp)
    if mentor_found[0].get("created_by") != "mentor":
        return fail(f"Mentor task created_by should be 'mentor', got {mentor_found[0].get('created_by')}", resp)
    
    success("GET /api/student/plan shows both tasks: one with created_by='student', one with created_by='mentor'")
    
    # 8. DELETE /api/student/tasks/{personal_task_id} → ok
    resp = httpx.delete(f"{BASE_URL}/student/tasks/{created_personal_task_id}", headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /api/student/tasks/{personal_task_id} failed", resp)
    success("DELETE /api/student/tasks/{personal_task_id} deleted personal task")
    
    # 9. Try DELETE /api/student/tasks/{mentor_task_id} → 403
    resp = httpx.delete(f"{BASE_URL}/student/tasks/{created_mentor_task_id}", headers=student_headers, timeout=30)
    if resp.status_code != 403:
        return fail(f"DELETE mentor task should return 403, got {resp.status_code}", resp)
    if "Mentor tarafından atanan görevleri silemezsin" not in resp.text:
        return fail("Error message should contain 'Mentor tarafından atanan görevleri silemezsin'", resp)
    success("DELETE /api/student/tasks/{mentor_task_id} returns 403 'Mentor tarafından atanan görevleri silemezsin'")
    
    return True

# ============ MAIN ============
def main():
    print("\n" + "="*60)
    print("KOÇUM SINAV CMS & STUDENT PLAN BACKEND API TEST")
    print("="*60 + "\n")
    
    # Setup auth
    if not setup_auth():
        print("\n❌ Authentication setup failed. Aborting tests.\n")
        return False
    
    results = []
    
    # Run tests
    results.append(("PUBLIC_CMS", test_public_cms()))
    results.append(("ADMIN_CMS_CONTENT", test_admin_cms_content()))
    results.append(("ADMIN_CMS_MENTORS", test_admin_cms_mentors()))
    results.append(("ADMIN_CMS_TESTIMONIALS", test_admin_cms_testimonials()))
    results.append(("ADMIN_CMS_FAQS", test_admin_cms_faqs()))
    results.append(("STUDENT_PLAN_UPDATES", test_student_plan_updates()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\nTotal: {passed}/{total} test groups passed")
    print("="*60 + "\n")
    
    return all(p for _, p in results)

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
