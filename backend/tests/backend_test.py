"""Backend tests for Nova Sugiantara portfolio.

Covers:
- Health endpoint (owned by FastAPI)
- Contact endpoint (validation, honeypot, persistence, rate limiting)
- Reverse-proxied Nuxt data endpoints (profile, projects, blog, skills, experiences)
- CV PDF generation
"""

import os
import uuid
import pytest
import requests

BASE_URL = "https://1039f4be-7ec3-44ee-b022-d8b4e7026963.preview.emergentagent.com"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ---
def test_health(client):
    r = client.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# --- Nuxt-proxied data endpoints ---
@pytest.mark.parametrize("endpoint", ["/api/profile", "/api/projects", "/api/blog", "/api/skills", "/api/experiences"])
def test_data_endpoints_return_json(client, endpoint):
    r = client.get(f"{BASE_URL}{endpoint}")
    assert r.status_code == 200, f"{endpoint} -> {r.status_code}"
    data = r.json()
    assert data is not None
    # Should be non-empty list or dict
    if isinstance(data, list):
        assert len(data) > 0, f"{endpoint} returned empty list"
    else:
        assert isinstance(data, dict) and len(data) > 0


def test_projects_shape(client):
    r = client.get(f"{BASE_URL}/api/projects")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 1
    p = items[0]
    # Common fields expected
    for key in ("slug", "title"):
        assert key in p, f"missing {key} in project"


def test_blog_list_and_detail(client):
    r = client.get(f"{BASE_URL}/api/blog")
    assert r.status_code == 200
    posts = r.json()
    assert isinstance(posts, list) and len(posts) >= 1
    slug = posts[0].get("slug")
    assert slug
    r2 = client.get(f"{BASE_URL}/api/blog/{slug}")
    assert r2.status_code == 200
    detail = r2.json()
    assert detail.get("slug") == slug
    # Body should be present (rendered HTML or markdown)
    assert any(k in detail for k in ("body", "html", "content", "content_html"))


# --- CV PDF ---
def test_cv_pdf(client):
    r = client.get(f"{BASE_URL}/api/cv/generate", params={"variant": "default"})
    assert r.status_code == 200
    ct = r.headers.get("content-type", "")
    assert "application/pdf" in ct, f"content-type={ct}"
    assert r.content[:4] == b"%PDF", "PDF magic bytes missing"


# --- Contact endpoint ---
def test_contact_valid_submission(client):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "name": f"TEST_User_{unique}",
        "email": f"test_{unique}@example.com",
        "message": f"TEST message {unique}",
    }
    r = client.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200, r.text
    assert r.json().get("success") is True

    # Verify persistence
    r2 = client.get(f"{BASE_URL}/api/contact-messages")
    assert r2.status_code == 200
    docs = r2.json()
    assert any(d.get("email") == payload["email"] for d in docs), "message not persisted"


def test_contact_invalid_email(client):
    payload = {"name": "x", "email": "not-an-email", "message": "hi"}
    r = requests.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 422


def test_contact_missing_fields(client):
    r = requests.post(f"{BASE_URL}/api/contact", json={"name": "", "email": "a@b.com", "message": ""})
    assert r.status_code == 422


def test_contact_honeypot_accepted_silently(client):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "name": f"TEST_Bot_{unique}",
        "email": f"bot_{unique}@example.com",
        "message": "spam",
        "hp": "i-am-a-bot",
    }
    r = requests.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200
    assert r.json().get("success") is True
    # Should NOT be persisted
    r2 = requests.get(f"{BASE_URL}/api/contact-messages")
    assert r2.status_code == 200
    docs = r2.json()
    assert not any(d.get("email") == payload["email"] for d in docs), "honeypot payload was stored"


def test_contact_messages_no_mongo_id_leak(client):
    r = requests.get(f"{BASE_URL}/api/contact-messages")
    assert r.status_code == 200
    for d in r.json():
        assert "_id" not in d
        assert "id" in d
