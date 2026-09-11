import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def valid_predict_payload():
    return {
        "role": "FullStack",
        "city": "Lahore",
        "experience": "Fresh",
        "company_size": "Small",
        "job_type": "Onsite",
        "skills": ["ReactJS", "NodeJS", "MongoDB", "Git"]
    }

@pytest.fixture
def ai_engineer_payload():
    return {
        "role": "AIEngineer",
        "city": "Karachi",
        "experience": "1Year",
        "company_size": "Large",
        "job_type": "Remote",
        "skills": ["Python", "Pandas", "Scikit_learn", "TensorFlow", "LLM", "SQL"]
    }
