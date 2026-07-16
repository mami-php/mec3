"""
Comprehensive backend API test for Koçum Sınav mentorship platform.
Tests all endpoints: auth, admin, mentor, student flows.
"""
import httpx
import time
from datetime import datetime, timedelta

# Base URL from frontend/.env
BASE_URL = "https://mentor-hub-226.preview.emergentagent.com/api"

# Seeded accounts
ADMIN_EMAIL = "admin@kocumsinav.com"
ADMIN_PASSWORD = "admin123"
MENTOR_EMAIL = "mentor@kocumsinav.com"
MENTOR_PASSWORD = "mentor123"
STUDENT_EMAIL = "student@kocumsinav.com"
STUDENT_PASSWORD = "student123"

# Global tokens
admin_token = None
mentor_token = None
student_token = None

# Test data storage
seeded_student_id = None
seeded_mentor_id = None
created_package_id = None
created_student_id = None
created_task_id = None
created_session_id = None

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

# ============ AUTH TESTS ============
def test_auth():
    global admin_token, mentor_token, student_token, seeded_student_id, seeded_mentor_id
    
    log("Testing AUTH endpoints...")
    
    # 1. Login as admin
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    if resp.status_code != 200:
        return fail("Admin login failed", resp)
    data = resp.json()
    if "access_token" not in data or data.get("user", {}).get("role") != "admin":
        return fail("Admin login response missing token or role", resp)
    admin_token = data["access_token"]
    success("Admin login successful")
    
    # 2. Login as mentor
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": MENTOR_EMAIL, "password": MENTOR_PASSWORD}, timeout=30)
    if resp.status_code != 200:
        return fail("Mentor login failed", resp)
    data = resp.json()
    if "access_token" not in data or data.get("user", {}).get("role") != "mentor":
        return fail("Mentor login response missing token or role", resp)
    mentor_token = data["access_token"]
    seeded_mentor_id = data["user"]["id"]
    success("Mentor login successful")
    
    # 3. Login as student
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD}, timeout=30)
    if resp.status_code != 200:
        return fail("Student login failed", resp)
    data = resp.json()
    if "access_token" not in data or data.get("user", {}).get("role") != "student":
        return fail("Student login response missing token or role", resp)
    student_token = data["access_token"]
    seeded_student_id = data["user"]["id"]
    success("Student login successful")
    
    # 4. Login with wrong password
    resp = httpx.post(f"{BASE_URL}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"}, timeout=30)
    if resp.status_code != 401:
        return fail(f"Wrong password should return 401, got {resp.status_code}", resp)
    success("Wrong password returns 401")
    
    # 5. GET /auth/me with admin token
    resp = httpx.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
    if resp.status_code != 200:
        return fail("GET /auth/me with admin token failed", resp)
    data = resp.json()
    if data.get("role") != "admin":
        return fail("GET /auth/me admin role mismatch", resp)
    success("GET /auth/me with admin token works")
    
    # 6. GET /auth/me with student token (should include package_info)
    resp = httpx.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {student_token}"}, timeout=30)
    if resp.status_code != 200:
        return fail("GET /auth/me with student token failed", resp)
    data = resp.json()
    if data.get("role") != "student":
        return fail("GET /auth/me student role mismatch", resp)
    if "package_info" not in data:
        return fail("GET /auth/me student missing package_info", resp)
    pkg_info = data["package_info"]
    if pkg_info.get("status") != "active":
        return fail(f"Student package_info status should be 'active', got {pkg_info.get('status')}", resp)
    if "package" not in pkg_info:
        return fail("Student package_info missing package details", resp)
    success("GET /auth/me with student token includes package_info with status='active'")
    
    # 7. GET /auth/me without token
    resp = httpx.get(f"{BASE_URL}/auth/me", timeout=30)
    if resp.status_code != 401:
        return fail(f"GET /auth/me without token should return 401, got {resp.status_code}", resp)
    success("GET /auth/me without token returns 401")
    
    return True

# ============ ADMIN TESTS ============
def test_admin():
    global created_package_id, created_student_id, seeded_student_id, seeded_mentor_id
    
    log("Testing ADMIN endpoints...")
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. GET /admin/dashboard/stats
    resp = httpx.get(f"{BASE_URL}/admin/dashboard/stats", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /admin/dashboard/stats failed", resp)
    data = resp.json()
    required = ["total_students", "total_mentors", "active_packages", "series_7d", "recent_sessions"]
    for key in required:
        if key not in data:
            return fail(f"Dashboard stats missing key: {key}", resp)
    if not isinstance(data["series_7d"], list) or len(data["series_7d"]) != 7:
        return fail("Dashboard series_7d should be array of 7 items", resp)
    success("GET /admin/dashboard/stats returns correct structure")
    
    # 2. GET /admin/users?role=student
    resp = httpx.get(f"{BASE_URL}/admin/users?role=student", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /admin/users?role=student failed", resp)
    students = resp.json()
    if not isinstance(students, list):
        return fail("GET /admin/users should return array", resp)
    # Find seeded student
    seeded = [s for s in students if s.get("email") == STUDENT_EMAIL]
    if not seeded:
        return fail("Seeded student not found in users list", resp)
    seeded_student = seeded[0]
    if "mentor_name" not in seeded_student:
        return fail("Student missing mentor_name field", resp)
    if "package_name" not in seeded_student:
        return fail("Student missing package_name field", resp)
    success("GET /admin/users?role=student returns students with mentor_name, package_name")
    
    # 3. GET /admin/users?role=mentor
    resp = httpx.get(f"{BASE_URL}/admin/users?role=mentor", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /admin/users?role=mentor failed", resp)
    mentors = resp.json()
    if not isinstance(mentors, list):
        return fail("GET /admin/users?role=mentor should return array", resp)
    seeded_mentor = [m for m in mentors if m.get("email") == MENTOR_EMAIL]
    if not seeded_mentor:
        return fail("Seeded mentor not found in users list", resp)
    success("GET /admin/users?role=mentor returns mentors")
    
    # 4. GET /admin/packages
    resp = httpx.get(f"{BASE_URL}/admin/packages", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /admin/packages failed", resp)
    packages = resp.json()
    if not isinstance(packages, list) or len(packages) < 4:
        return fail("GET /admin/packages should return at least 4 seeded packages", resp)
    success("GET /admin/packages returns 4+ packages")
    
    # 5. POST /admin/packages - create new package
    new_pkg = {
        "name": "Test Paket",
        "duration_days": 15,
        "price": 999,
        "features": ["a", "b"],
        "is_active": True
    }
    resp = httpx.post(f"{BASE_URL}/admin/packages", json=new_pkg, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /admin/packages failed", resp)
    pkg = resp.json()
    if "id" not in pkg or pkg.get("name") != "Test Paket":
        return fail("Created package missing id or name mismatch", resp)
    created_package_id = pkg["id"]
    success(f"POST /admin/packages created package with id={created_package_id}")
    
    # 6. PATCH /admin/packages/{id} - update price
    resp = httpx.patch(f"{BASE_URL}/admin/packages/{created_package_id}", json={"price": 1500}, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("PATCH /admin/packages failed", resp)
    success("PATCH /admin/packages updated price")
    
    # 7. DELETE /admin/packages/{id}
    resp = httpx.delete(f"{BASE_URL}/admin/packages/{created_package_id}", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /admin/packages failed", resp)
    success("DELETE /admin/packages deleted package")
    
    # 8. POST /admin/users - create new student
    # Get a package id for assignment
    resp = httpx.get(f"{BASE_URL}/admin/packages", headers=headers, timeout=30)
    packages = resp.json()
    pkg_id = packages[0]["id"] if packages else None
    
    new_student = {
        "email": f"teststudent{int(time.time())}@test.com",
        "password": "test123",
        "full_name": "Test Student",
        "phone": "+90 555 000 00 00",
        "role": "student",
        "mentor_id": seeded_mentor_id,
        "package_id": pkg_id,
        "package_days": 7
    }
    resp = httpx.post(f"{BASE_URL}/admin/users", json=new_student, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /admin/users create student failed", resp)
    student = resp.json()
    if "id" not in student:
        return fail("Created student missing id", resp)
    created_student_id = student["id"]
    success(f"POST /admin/users created student with id={created_student_id}")
    
    # 9. GET /admin/users/{new_student_id}
    resp = httpx.get(f"{BASE_URL}/admin/users/{created_student_id}", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /admin/users/{id} failed", resp)
    student = resp.json()
    if "mentor_name" not in student:
        return fail("Student detail missing mentor_name", resp)
    if "package" not in student:
        return fail("Student detail missing package", resp)
    if "total_study_seconds" not in student:
        return fail("Student detail missing total_study_seconds", resp)
    if student["total_study_seconds"] != 0:
        return fail(f"New student should have total_study_seconds=0, got {student['total_study_seconds']}", resp)
    success("GET /admin/users/{id} returns student with mentor_name, package, total_study_seconds=0")
    
    # 10. POST /admin/users/{id}/package/extend
    resp = httpx.post(f"{BASE_URL}/admin/users/{created_student_id}/package/extend", json={"days": 30}, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /admin/users/{id}/package/extend failed", resp)
    success("POST /admin/users/{id}/package/extend extended package")
    
    # 11. POST /admin/users/{id}/package/cancel
    resp = httpx.post(f"{BASE_URL}/admin/users/{created_student_id}/package/cancel", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /admin/users/{id}/package/cancel failed", resp)
    success("POST /admin/users/{id}/package/cancel cancelled package")
    
    # 12. POST /admin/users/{id}/mentor - remove mentor
    resp = httpx.post(f"{BASE_URL}/admin/users/{created_student_id}/mentor", json={"mentor_id": None}, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /admin/users/{id}/mentor remove mentor failed", resp)
    success("POST /admin/users/{id}/mentor removed mentor")
    
    # 13. POST /admin/users/{id}/status/blocked
    resp = httpx.post(f"{BASE_URL}/admin/users/{created_student_id}/status/blocked", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /admin/users/{id}/status/blocked failed", resp)
    success("POST /admin/users/{id}/status/blocked set status to blocked")
    
    # 14. DELETE /admin/users/{id} - soft delete
    resp = httpx.delete(f"{BASE_URL}/admin/users/{created_student_id}", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /admin/users/{id} failed", resp)
    success("DELETE /admin/users/{id} soft deleted user")
    
    # 15. Non-admin access - student tries to access admin endpoint
    student_headers = {"Authorization": f"Bearer {student_token}"}
    resp = httpx.get(f"{BASE_URL}/admin/users", headers=student_headers, timeout=30)
    if resp.status_code != 403:
        return fail(f"Non-admin access should return 403, got {resp.status_code}", resp)
    success("Non-admin access to /admin/users returns 403")
    
    return True

# ============ MENTOR TESTS ============
def test_mentor():
    global created_task_id, seeded_student_id
    
    log("Testing MENTOR endpoints...")
    headers = {"Authorization": f"Bearer {mentor_token}"}
    
    # 1. GET /mentor/dashboard/stats
    resp = httpx.get(f"{BASE_URL}/mentor/dashboard/stats", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /mentor/dashboard/stats failed", resp)
    data = resp.json()
    if "total_students" not in data or data["total_students"] < 1:
        return fail("Mentor dashboard should show total_students >= 1", resp)
    success("GET /mentor/dashboard/stats returns total_students >= 1")
    
    # 2. GET /mentor/students
    resp = httpx.get(f"{BASE_URL}/mentor/students", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /mentor/students failed", resp)
    students = resp.json()
    if not isinstance(students, list):
        return fail("GET /mentor/students should return array", resp)
    # Should include seeded student
    seeded = [s for s in students if s.get("id") == seeded_student_id]
    if not seeded:
        return fail("Seeded student not in mentor's students list", resp)
    success("GET /mentor/students returns list including seeded student")
    
    # 3. GET /mentor/students/{sid}
    resp = httpx.get(f"{BASE_URL}/mentor/students/{seeded_student_id}", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /mentor/students/{sid} failed", resp)
    student = resp.json()
    if "series_14d" not in student or len(student["series_14d"]) != 14:
        return fail("Student detail should have series_14d with 14 items", resp)
    if "subject_breakdown" not in student:
        return fail("Student detail missing subject_breakdown", resp)
    success("GET /mentor/students/{sid} returns detail with series_14d, subject_breakdown")
    
    # 4. POST /mentor/tasks - create task for today
    today = datetime.utcnow().strftime("%Y-%m-%d")
    task_data = {
        "student_id": seeded_student_id,
        "day_date": today,
        "subject": "Matematik",
        "topic": "Türev",
        "task_type": "test",
        "target_qcount": 40
    }
    resp = httpx.post(f"{BASE_URL}/mentor/tasks", json=task_data, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /mentor/tasks failed", resp)
    task = resp.json()
    if "id" not in task:
        return fail("Created task missing id", resp)
    created_task_id = task["id"]
    success(f"POST /mentor/tasks created task with id={created_task_id}")
    
    # 5. GET /mentor/students/{sid}/tasks?week_start=this_monday
    # Calculate this Monday
    now = datetime.utcnow()
    monday = now - timedelta(days=now.weekday())
    week_start = monday.strftime("%Y-%m-%d")
    resp = httpx.get(f"{BASE_URL}/mentor/students/{seeded_student_id}/tasks?week_start={week_start}", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /mentor/students/{sid}/tasks failed", resp)
    tasks = resp.json()
    if not isinstance(tasks, list):
        return fail("GET /mentor/students/{sid}/tasks should return array", resp)
    # Should contain the created task
    found = [t for t in tasks if t.get("id") == created_task_id]
    if not found:
        return fail("Created task not found in student's tasks", resp)
    success("GET /mentor/students/{sid}/tasks returns created task")
    
    # 6. PATCH /mentor/tasks/{tid} - mark completed
    resp = httpx.patch(f"{BASE_URL}/mentor/tasks/{created_task_id}", json={"completed": True}, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("PATCH /mentor/tasks/{tid} failed", resp)
    success("PATCH /mentor/tasks/{tid} marked task as completed")
    
    # 7. Try creating task for student not owned by mentor (should return 403)
    fake_student_id = "00000000-0000-0000-0000-000000000000"
    task_data["student_id"] = fake_student_id
    resp = httpx.post(f"{BASE_URL}/mentor/tasks", json=task_data, headers=headers, timeout=30)
    if resp.status_code != 403:
        return fail(f"Creating task for non-owned student should return 403, got {resp.status_code}", resp)
    success("Creating task for non-owned student returns 403")
    
    # 8. DELETE /mentor/tasks/{tid}
    resp = httpx.delete(f"{BASE_URL}/mentor/tasks/{created_task_id}", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("DELETE /mentor/tasks/{tid} failed", resp)
    success("DELETE /mentor/tasks/{tid} deleted task")
    
    return True

# ============ STUDENT TESTS ============
def test_student():
    global created_task_id, created_session_id, seeded_student_id
    
    log("Testing STUDENT endpoints...")
    headers = {"Authorization": f"Bearer {student_token}"}
    
    # 1. GET /student/plan
    resp = httpx.get(f"{BASE_URL}/student/plan", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /student/plan failed", resp)
    plan = resp.json()
    if "week_start" not in plan or "days" not in plan:
        return fail("Student plan missing week_start or days", resp)
    if not isinstance(plan["days"], list) or len(plan["days"]) != 7:
        return fail("Student plan should have 7 days", resp)
    # Check week_start is Monday
    week_start = datetime.strptime(plan["week_start"], "%Y-%m-%d")
    if week_start.weekday() != 0:
        return fail("Student plan week_start should be Monday", resp)
    success("GET /student/plan returns week_start (Monday) and 7 days")
    
    # 2. Create a task via mentor for today, then check plan
    mentor_headers = {"Authorization": f"Bearer {mentor_token}"}
    today = datetime.utcnow().strftime("%Y-%m-%d")
    task_data = {
        "student_id": seeded_student_id,
        "day_date": today,
        "subject": "Fizik",
        "topic": "Hareket",
        "task_type": "konu",
        "target_duration_min": 60
    }
    resp = httpx.post(f"{BASE_URL}/mentor/tasks", json=task_data, headers=mentor_headers, timeout=30)
    if resp.status_code != 200:
        return fail("Mentor creating task for student failed", resp)
    task = resp.json()
    created_task_id = task["id"]
    
    # Now check student plan
    resp = httpx.get(f"{BASE_URL}/student/plan", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /student/plan after task creation failed", resp)
    plan = resp.json()
    # Find today's tasks
    today_tasks = []
    for day in plan["days"]:
        if day["date"] == today:
            today_tasks = day["tasks"]
            break
    found = [t for t in today_tasks if t.get("id") == created_task_id]
    if not found:
        return fail("Created task not found in student plan", resp)
    success("Task created by mentor appears in student plan")
    
    # 3. POST /student/tasks/{tid}/toggle
    resp = httpx.post(f"{BASE_URL}/student/tasks/{created_task_id}/toggle", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /student/tasks/{tid}/toggle failed", resp)
    data = resp.json()
    if "completed" not in data:
        return fail("Toggle response missing completed field", resp)
    success("POST /student/tasks/{tid}/toggle toggles completed")
    
    # 4. POST /student/sessions/start
    session_data = {
        "subject": "Matematik",
        "topic": "Limit"
    }
    resp = httpx.post(f"{BASE_URL}/student/sessions/start", json=session_data, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /student/sessions/start failed", resp)
    session = resp.json()
    if "id" not in session or session.get("ended_at") is not None:
        return fail("Started session should have id and ended_at=null", resp)
    created_session_id = session["id"]
    success(f"POST /student/sessions/start created session with id={created_session_id}")
    
    # 5. GET /student/sessions/active
    resp = httpx.get(f"{BASE_URL}/student/sessions/active", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /student/sessions/active failed", resp)
    active = resp.json()
    if active is None or active.get("id") != created_session_id:
        return fail("Active session should match created session", resp)
    success("GET /student/sessions/active returns the active session")
    
    # 6. Wait 2 seconds
    log("Waiting 2 seconds for session duration...")
    time.sleep(2)
    
    # 7. POST /student/sessions/stop
    stop_data = {"session_id": created_session_id}
    resp = httpx.post(f"{BASE_URL}/student/sessions/stop", json=stop_data, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("POST /student/sessions/stop failed", resp)
    session = resp.json()
    if session.get("duration_sec", 0) < 1:
        return fail(f"Stopped session should have duration_sec >= 1, got {session.get('duration_sec')}", resp)
    success(f"POST /student/sessions/stop stopped session with duration_sec={session['duration_sec']}")
    
    # 8. Start another session immediately (should work)
    session_data2 = {
        "subject": "Kimya",
        "topic": "Asitler"
    }
    resp = httpx.post(f"{BASE_URL}/student/sessions/start", json=session_data2, headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("Starting another session immediately after stopping failed", resp)
    session2 = resp.json()
    created_session_id2 = session2["id"]
    # Stop it immediately
    resp = httpx.post(f"{BASE_URL}/student/sessions/stop", json={"session_id": created_session_id2}, headers=headers, timeout=30)
    success("Starting another session immediately after stopping works")
    
    # 9. GET /student/sessions
    resp = httpx.get(f"{BASE_URL}/student/sessions", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /student/sessions failed", resp)
    sessions = resp.json()
    if not isinstance(sessions, list):
        return fail("GET /student/sessions should return array", resp)
    # Should contain recent sessions
    found = [s for s in sessions if s.get("id") == created_session_id]
    if not found:
        return fail("Recent session not found in sessions list", resp)
    success("GET /student/sessions returns list containing recent sessions")
    
    # 10. GET /student/stats
    resp = httpx.get(f"{BASE_URL}/student/stats", headers=headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /student/stats failed", resp)
    stats = resp.json()
    required = ["today_seconds", "series_14d", "subject_breakdown", "streak_days"]
    for key in required:
        if key not in stats:
            return fail(f"Student stats missing key: {key}", resp)
    if stats["today_seconds"] <= 0:
        return fail(f"Student stats today_seconds should be > 0, got {stats['today_seconds']}", resp)
    if not isinstance(stats["series_14d"], list) or len(stats["series_14d"]) != 14:
        return fail("Student stats series_14d should be array of 14 items", resp)
    success("GET /student/stats returns today_seconds > 0, series_14d (14 items), subject_breakdown, streak_days")
    
    # 11. Admin should see the sessions: GET /admin/sessions
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    resp = httpx.get(f"{BASE_URL}/admin/sessions", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /admin/sessions failed", resp)
    sessions = resp.json()
    if not isinstance(sessions, list):
        return fail("GET /admin/sessions should return array", resp)
    # Should include student's session with student_name
    found = [s for s in sessions if s.get("id") == created_session_id]
    if not found:
        return fail("Student's session not found in admin sessions", resp)
    if "student_name" not in found[0]:
        return fail("Admin session missing student_name", resp)
    success("GET /admin/sessions includes student's session with student_name")
    
    return True

# ============ PACKAGE EXPIRATION BLOCKING ============
def test_package_expiration():
    global seeded_student_id
    
    log("Testing PACKAGE EXPIRATION BLOCKING...")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    student_headers = {"Authorization": f"Bearer {student_token}"}
    
    # 1. Admin cancels student's package
    resp = httpx.post(f"{BASE_URL}/admin/users/{seeded_student_id}/package/cancel", headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("Admin cancel package failed", resp)
    success("Admin cancelled student's package")
    
    # 2. Student login should still work, but /auth/me returns package_info.status='expired'
    resp = httpx.get(f"{BASE_URL}/auth/me", headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("GET /auth/me after package cancel failed", resp)
    data = resp.json()
    if "package_info" not in data:
        return fail("Student /auth/me missing package_info after cancel", resp)
    if data["package_info"].get("status") != "expired":
        return fail(f"Student package_info.status should be 'expired', got {data['package_info'].get('status')}", resp)
    success("Student /auth/me returns package_info.status='expired' after cancel")
    
    # 3. POST /student/sessions/start should return 403 with "Paket süreniz sona ermiş"
    session_data = {
        "subject": "Test",
        "topic": "Test"
    }
    resp = httpx.post(f"{BASE_URL}/student/sessions/start", json=session_data, headers=student_headers, timeout=30)
    if resp.status_code != 403:
        return fail(f"Starting session with expired package should return 403, got {resp.status_code}", resp)
    if "Paket süreniz sona ermiş" not in resp.text:
        return fail("Error message should contain 'Paket süreniz sona ermiş'", resp)
    success("POST /student/sessions/start returns 403 with 'Paket süreniz sona ermiş'")
    
    # 4. Admin extends by 30 days
    resp = httpx.post(f"{BASE_URL}/admin/users/{seeded_student_id}/package/extend", json={"days": 30}, headers=admin_headers, timeout=30)
    if resp.status_code != 200:
        return fail("Admin extend package failed", resp)
    success("Admin extended student's package by 30 days")
    
    # 5. Now student can start a session again
    resp = httpx.post(f"{BASE_URL}/student/sessions/start", json=session_data, headers=student_headers, timeout=30)
    if resp.status_code != 200:
        return fail("Starting session after package extend failed", resp)
    session = resp.json()
    # Stop it
    resp = httpx.post(f"{BASE_URL}/student/sessions/stop", json={"session_id": session["id"]}, headers=student_headers, timeout=30)
    success("Student can start session again after package extend")
    
    return True

# ============ MAIN ============
def main():
    print("\n" + "="*60)
    print("KOÇUM SINAV BACKEND API TEST")
    print("="*60 + "\n")
    
    results = []
    
    # Run tests
    results.append(("AUTH", test_auth()))
    results.append(("ADMIN", test_admin()))
    results.append(("MENTOR", test_mentor()))
    results.append(("STUDENT", test_student()))
    results.append(("PACKAGE_EXPIRATION", test_package_expiration()))
    
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
