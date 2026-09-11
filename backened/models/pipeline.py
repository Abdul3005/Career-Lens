import pandas as pd
from typing import List, Dict, Any
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

# ─── 29 SKILL FEATURES ────────────────────────────────────
SKILL_FEATURES: List[str] = [
    'ReactJS', 'NodeJS', 'Python', 'SQL', 'MongoDB', 'Git',
    'PWA', 'Socket_io', 'Scikit_learn', 'TensorFlow', 'LLM',
    'LangChain', 'Pandas', 'Agile', 'JIRA', 'BA', 'Project_Mgmt',
    'IT_Support', 'Documentation', 'Risk_Mgmt', 'Stakeholder_Mgmt',
    'Figma', 'User_Research', 'Wireframing', 'Prototyping',
    'Adobe_XD', 'Design_Systems', 'Usability_Testing', 'Interaction_Design'
]

# Explicit ordinal hierarchies
EXPERIENCE_ORDER: List[str] = ['Fresh', '6Months', '1Year', 'MoreThan1.5Years']
COMPANY_SIZE_ORDER: List[str] = ['Small', 'Medium', 'Large']

# ─── PREPROCESSORS ───────────────────────────────────────

def get_salary_preprocessor() -> ColumnTransformer:
    """
    Constructs a ColumnTransformer for salary prediction features.
    - Role, City, Job_Type: OneHotEncoder (ignores unseen categories)
    - Experience, Company_Size: OrdinalEncoder with true domain hierarchies
    - 29 Skills: passthrough as binary numeric features
    """
    nominal_cols = ['Role', 'City', 'Job_Type']
    ordinal_cols = ['Experience', 'Company_Size']
    ordinal_categories = [EXPERIENCE_ORDER, COMPANY_SIZE_ORDER]

    return ColumnTransformer(
        transformers=[
            (
                'nominal',
                OneHotEncoder(handle_unknown='ignore', sparse_output=False),
                nominal_cols
            ),
            (
                'ordinal',
                OrdinalEncoder(
                    categories=ordinal_categories,
                    handle_unknown='use_encoded_value',
                    unknown_value=-1
                ),
                ordinal_cols
            ),
            (
                'skills',
                'passthrough',
                SKILL_FEATURES
            )
        ],
        remainder='drop'
    )


def get_jobtype_preprocessor() -> ColumnTransformer:
    """
    Constructs a ColumnTransformer for Job Type classification.
    Target leakage fix: strictly EXCLUDES 'Job_Type' from input features.
    """
    nominal_cols = ['Role', 'City']
    ordinal_cols = ['Experience', 'Company_Size']
    ordinal_categories = [EXPERIENCE_ORDER, COMPANY_SIZE_ORDER]

    return ColumnTransformer(
        transformers=[
            (
                'nominal',
                OneHotEncoder(handle_unknown='ignore', sparse_output=False),
                nominal_cols
            ),
            (
                'ordinal',
                OrdinalEncoder(
                    categories=ordinal_categories,
                    handle_unknown='use_encoded_value',
                    unknown_value=-1
                ),
                ordinal_cols
            ),
            (
                'skills',
                'passthrough',
                SKILL_FEATURES
            )
        ],
        remainder='drop'
    )


# ─── MODEL PIPELINE FACTORIES ────────────────────────────

def create_linear_regression_pipeline() -> Pipeline:
    """Salary prediction with Linear Regression and StandardScaler."""
    return Pipeline([
        ('preprocessor', get_salary_preprocessor()),
        ('scaler', StandardScaler()),
        ('regressor', LinearRegression())
    ])


def create_random_forest_pipeline(random_state: int = 42, n_estimators: int = 100) -> Pipeline:
    """Salary prediction with Random Forest Regressor."""
    return Pipeline([
        ('preprocessor', get_salary_preprocessor()),
        ('regressor', RandomForestRegressor(n_estimators=n_estimators, random_state=random_state))
    ])


def create_gradient_boosting_pipeline(random_state: int = 42, n_estimators: int = 100) -> Pipeline:
    """Salary prediction with Gradient Boosting Regressor."""
    return Pipeline([
        ('preprocessor', get_salary_preprocessor()),
        ('regressor', GradientBoostingRegressor(n_estimators=n_estimators, random_state=random_state))
    ])


def create_jobtype_pipeline(random_state: int = 42) -> Pipeline:
    """Job Type (Onsite vs Remote) Logistic Regression pipeline with leakage fix."""
    return Pipeline([
        ('preprocessor', get_jobtype_preprocessor()),
        ('scaler', StandardScaler()),
        ('classifier', LogisticRegression(max_iter=1000, random_state=random_state))
    ])


# ─── HELPER FOR RAW USER INPUT ───────────────────────────

def create_input_dataframe(
    role: str,
    city: str,
    experience: str,
    company_size: str,
    job_type: str,
    skills: List[str]
) -> pd.DataFrame:
    """
    Transforms raw API input fields into a single-row DataFrame
    compatible with the scikit-learn Pipeline.
    """
    skills_set = set(skills or [])
    row_data: Dict[str, Any] = {
        'Role': role,
        'City': city,
        'Experience': experience,
        'Company_Size': company_size,
        'Job_Type': job_type,
    }
    for skill in SKILL_FEATURES:
        row_data[skill] = 1 if skill in skills_set else 0

    return pd.DataFrame([row_data])
