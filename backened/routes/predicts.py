import os
import sys
import joblib
import numpy as np
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from models.pipeline import create_input_dataframe, SKILL_FEATURES

router = APIRouter()

# ─── LOAD SELF-CONTAINED PIPELINE ARTIFACTS ──────────────
MODELS_DIR = os.path.join(backend_dir, 'models')
salary_artifact_path = os.path.join(MODELS_DIR, 'salary_pipeline.joblib')
jobtype_artifact_path = os.path.join(MODELS_DIR, 'jobtype_pipeline.joblib')

salary_pipeline = None
jobtype_pipeline = None

try:
    if os.path.exists(salary_artifact_path):
        salary_pipeline = joblib.load(salary_artifact_path)
    if os.path.exists(jobtype_artifact_path):
        jobtype_pipeline = joblib.load(jobtype_artifact_path)
except Exception as e:
    print(f"Warning: Failed to load model artifacts: {e}")

# ─── REQUEST SCHEMA ───────────────────────────────────────
class PredictRequest(BaseModel):
    role:         str = Field(...)        # "FullStack", "ITManagement", "UIUXDesign", "AIEngineer"
    city:         str = Field(...)        # "Lahore", "Karachi", etc.
    experience:   str = Field(...)        # "Fresh", "6Months", "1Year", "MoreThan1.5Years"
    company_size: str = Field(...)        # "Small", "Medium", "Large"
    job_type:     str = Field(...)        # "Onsite", "Remote"
    skills:       List[str] = Field(default_factory=list)

# ─── ENDPOINT: PREDICT ───────────────────────────────────
@router.post("/predict")
def predict(data: PredictRequest):
    if salary_pipeline is None or jobtype_pipeline is None:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts are not loaded. Please run the training pipeline first."
        )

    # Convert raw input to DataFrame row matching the pipeline's expected features
    input_df = create_input_dataframe(
        role=data.role,
        city=data.city,
        experience=data.experience,
        company_size=data.company_size,
        job_type=data.job_type,
        skills=data.skills
    )

    try:
        # Salary prediction via self-contained pipeline
        raw_pred = salary_pipeline.predict(input_df)[0]
        predicted_salary = max(0, round(float(raw_pred) / 1000) * 1000)

        # Salary range (±15%)
        salary_min = round((predicted_salary * 0.85) / 1000) * 1000
        salary_max = round((predicted_salary * 1.15) / 1000) * 1000

        # Job type classification via leak-free pipeline
        jobtype_label = str(jobtype_pipeline.predict(input_df)[0])
        jobtype_proba = jobtype_pipeline.predict_proba(input_df)[0]

        # Extract class probabilities dynamically
        classes = list(jobtype_pipeline.classes_)
        onsite_idx = classes.index('Onsite') if 'Onsite' in classes else 0
        remote_idx = classes.index('Remote') if 'Remote' in classes else (1 if len(classes) > 1 else 0)

        onsite_prob = round(float(jobtype_proba[onsite_idx]) * 100, 1)
        remote_prob = round(float(jobtype_proba[remote_idx]) * 100, 1)
        jobtype_confidence = round(float(max(jobtype_proba)) * 100, 1)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction pipeline error: {str(e)}"
        )

    # Skill gap — missing important skills for role
    role_skill_map = {
        "FullStack":     ["ReactJS", "NodeJS", "MongoDB", "Git", "SQL"],
        "ITManagement":  ["Agile", "JIRA", "Project_Mgmt", "BA", "Documentation"],
        "UIUXDesign":    ["Figma", "Wireframing", "Prototyping", "User_Research", "Adobe_XD"],
        "AIEngineer":    ["Python", "Pandas", "Scikit_learn", "TensorFlow", "LLM"],
    }
    important_skills = role_skill_map.get(data.role, [])
    skill_gap = [s for s in important_skills if s not in data.skills]

    # Return response adhering strictly to frontend expected contract
    return {
        "salary": {
            "predicted":  int(predicted_salary),
            "min":        int(salary_min),
            "max":        int(salary_max),
            "currency":   "PKR",
            "period":     "monthly"
        },
        "job_type": {
            "predicted":   jobtype_label,
            "confidence":  jobtype_confidence,
            "onsite_prob": onsite_prob,
            "remote_prob": remote_prob,
        },
        "skill_gap": skill_gap,
        "input_summary": {
            "role":         data.role,
            "city":         data.city,
            "experience":   data.experience,
            "company_size": data.company_size,
            "job_type":     data.job_type,
            "skills_count": len(data.skills)
        }
    }