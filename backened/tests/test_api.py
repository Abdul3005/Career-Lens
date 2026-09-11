import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client: TestClient):
    """Verify root endpoint responds with status 200 and welcoming message."""
    response = client.get("/")
    assert response.status_code == 200
    assert "CareerLens" in response.json().get("message", "")

def test_health_endpoint(client: TestClient):
    """Verify health endpoint reports healthy status and model availability."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["models"]["salary_pipeline_loaded"] is True
    assert data["models"]["jobtype_pipeline_loaded"] is True
    assert data["models"]["salary_model_type"] == "GradientBoostingRegressor"
    assert data["models"]["jobtype_model_type"] == "LogisticRegression"

def test_predict_endpoint_valid_payload(client: TestClient, valid_predict_payload: dict):
    """Verify /api/predict returns full expected schema for valid input."""
    response = client.post("/api/predict", json=valid_predict_payload)
    assert response.status_code == 200
    data = response.json()

    # Salary assertions
    assert "salary" in data
    salary = data["salary"]
    assert "predicted" in salary
    assert "min" in salary
    assert "max" in salary
    assert salary["currency"] == "PKR"
    assert salary["period"] == "monthly"
    assert salary["min"] <= salary["predicted"] <= salary["max"]
    assert salary["predicted"] > 0

    # Job type assertions
    assert "job_type" in data
    jt = data["job_type"]
    assert jt["predicted"] in ["Onsite", "Remote"]
    assert 0 <= jt["confidence"] <= 100
    assert 0 <= jt["onsite_prob"] <= 100
    assert 0 <= jt["remote_prob"] <= 100

    # Skill gap assertions
    assert "skill_gap" in data
    assert isinstance(data["skill_gap"], list)

    # Input summary assertions
    assert "input_summary" in data
    summary = data["input_summary"]
    assert summary["role"] == valid_predict_payload["role"]
    assert summary["city"] == valid_predict_payload["city"]
    assert summary["skills_count"] == len(valid_predict_payload["skills"])

def test_predict_endpoint_unseen_category(client: TestClient):
    """Verify /api/predict handles unseen/out-of-domain categories gracefully without 500 errors."""
    unseen_payload = {
        "role": "RoboticsSpecialist",  # unseen role
        "city": "Quetta",              # unseen city
        "experience": "Fresh",
        "company_size": "Small",
        "job_type": "Remote",
        "skills": ["Python"]
    }
    response = client.post("/api/predict", json=unseen_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["salary"]["predicted"] > 0
    assert data["job_type"]["predicted"] in ["Onsite", "Remote"]

def test_predict_endpoint_missing_required_fields(client: TestClient):
    """Verify FastAPI Pydantic validation rejects incomplete payloads with 422."""
    incomplete_payload = {
        "role": "FullStack",
        # missing city, experience, company_size, job_type
        "skills": ["ReactJS"]
    }
    response = client.post("/api/predict", json=incomplete_payload)
    assert response.status_code == 422

def test_chart_endpoint_salary_by_role(client: TestClient):
    """Verify existing chart endpoint continues to generate PNG responses."""
    response = client.get("/api/charts/salary-by-role")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 1000  # valid image binary bytes
