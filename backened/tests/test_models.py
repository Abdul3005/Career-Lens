import os
import joblib
import pytest
import numpy as np
import pandas as pd
from models.pipeline import (
    create_input_dataframe,
    create_linear_regression_pipeline,
    create_random_forest_pipeline,
    create_gradient_boosting_pipeline,
    SKILL_FEATURES
)

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))

def test_salary_pipeline_artifact_exists_and_loads():
    """Verify the serialized salary pipeline exists and loads successfully."""
    artifact_path = os.path.join(MODELS_DIR, 'salary_pipeline.joblib')
    assert os.path.exists(artifact_path), f"Artifact missing: {artifact_path}"

    pipeline = joblib.load(artifact_path)
    assert hasattr(pipeline, 'predict')
    assert 'preprocessor' in pipeline.named_steps
    assert 'regressor' in pipeline.named_steps

def test_jobtype_pipeline_artifact_exists_and_loads():
    """Verify the serialized job type pipeline exists and loads successfully."""
    artifact_path = os.path.join(MODELS_DIR, 'jobtype_pipeline.joblib')
    assert os.path.exists(artifact_path), f"Artifact missing: {artifact_path}"

    pipeline = joblib.load(artifact_path)
    assert hasattr(pipeline, 'predict')
    assert hasattr(pipeline, 'predict_proba')
    assert 'preprocessor' in pipeline.named_steps
    assert 'classifier' in pipeline.named_steps

def test_salary_prediction_sanity():
    """Verify salary pipeline produces a reasonable positive prediction."""
    artifact_path = os.path.join(MODELS_DIR, 'salary_pipeline.joblib')
    pipeline = joblib.load(artifact_path)

    input_df = create_input_dataframe(
        role="FullStack",
        city="Lahore",
        experience="Fresh",
        company_size="Small",
        job_type="Onsite",
        skills=["ReactJS", "NodeJS", "Git"]
    )
    prediction = pipeline.predict(input_df)[0]
    assert isinstance(prediction, (int, float, np.floating))
    assert prediction > 30000  # Minimum plausible market salary in PKR
    assert prediction < 1000000

def test_jobtype_prediction_sanity():
    """Verify job type pipeline produces valid classes and normalized probabilities."""
    artifact_path = os.path.join(MODELS_DIR, 'jobtype_pipeline.joblib')
    pipeline = joblib.load(artifact_path)

    input_df = create_input_dataframe(
        role="AIEngineer",
        city="Karachi",
        experience="1Year",
        company_size="Large",
        job_type="Remote",
        skills=["Python", "Pandas", "Scikit_learn", "LLM"]
    )
    pred_label = pipeline.predict(input_df)[0]
    proba = pipeline.predict_proba(input_df)[0]

    assert pred_label in ["Onsite", "Remote"]
    assert len(proba) == 2
    assert pytest.approx(np.sum(proba), abs=1e-4) == 1.0

def test_all_three_salary_pipelines_trainable():
    """Verify Linear Regression, Random Forest, and Gradient Boosting all train and predict."""
    df_mini = pd.DataFrame([
        {
            'Role': 'FullStack',
            'City': 'Lahore',
            'Experience': 'Fresh',
            'Company_Size': 'Small',
            'Job_Type': 'Onsite',
            **{s: 1 if s in ['ReactJS', 'Git'] else 0 for s in SKILL_FEATURES},
            'Salary': 80000
        },
        {
            'Role': 'AIEngineer',
            'City': 'Karachi',
            'Experience': '1Year',
            'Company_Size': 'Large',
            'Job_Type': 'Remote',
            **{s: 1 if s in ['Python', 'SQL'] else 0 for s in SKILL_FEATURES},
            'Salary': 160000
        }
    ])

    features = ['Role', 'City', 'Experience', 'Company_Size', 'Job_Type'] + SKILL_FEATURES
    X = df_mini[features]
    y = df_mini['Salary']

    factories = [
        create_linear_regression_pipeline,
        lambda: create_random_forest_pipeline(n_estimators=5),
        lambda: create_gradient_boosting_pipeline(n_estimators=5)
    ]

    for factory in factories:
        pipe = factory()
        pipe.fit(X, y)
        preds = pipe.predict(X)
        assert len(preds) == 2
        assert all(p > 0 for p in preds)
