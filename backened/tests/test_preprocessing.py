import pytest
import pandas as pd
import numpy as np
from models.pipeline import (
    get_salary_preprocessor,
    get_jobtype_preprocessor,
    create_input_dataframe,
    EXPERIENCE_ORDER,
    COMPANY_SIZE_ORDER,
    SKILL_FEATURES
)

def test_experience_order():
    """Verify that experience levels follow the expected chronological order."""
    expected = ['Fresh', '6Months', '1Year', 'MoreThan1.5Years']
    assert EXPERIENCE_ORDER == expected

def test_company_size_order():
    """Verify company size follows Small < Medium < Large order."""
    expected = ['Small', 'Medium', 'Large']
    assert COMPANY_SIZE_ORDER == expected

def test_create_input_dataframe_structure():
    """Verify create_input_dataframe generates a DataFrame with all required columns."""
    df = create_input_dataframe(
        role="FullStack",
        city="Lahore",
        experience="Fresh",
        company_size="Small",
        job_type="Onsite",
        skills=["ReactJS", "Git"]
    )
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 1
    assert df['Role'].iloc[0] == "FullStack"
    assert df['City'].iloc[0] == "Lahore"
    assert df['Experience'].iloc[0] == "Fresh"
    assert df['Company_Size'].iloc[0] == "Small"
    assert df['Job_Type'].iloc[0] == "Onsite"

    # Verify skill binary flags
    assert df['ReactJS'].iloc[0] == 1
    assert df['Git'].iloc[0] == 1
    assert df['Python'].iloc[0] == 0
    assert df['Figma'].iloc[0] == 0

def test_salary_preprocessor_transformation():
    """Verify salary preprocessor transforms data into numeric feature array."""
    preprocessor = get_salary_preprocessor()
    sample_df = create_input_dataframe(
        role="FullStack",
        city="Lahore",
        experience="1Year",
        company_size="Medium",
        job_type="Remote",
        skills=["ReactJS", "NodeJS"]
    )
    preprocessor.fit(sample_df)
    transformed = preprocessor.transform(sample_df)

    assert isinstance(transformed, np.ndarray)
    assert transformed.shape[0] == 1
    assert transformed.shape[1] > 0
    assert not np.isnan(transformed).any()

def test_unseen_categories_handling():
    """Verify OneHotEncoder gracefully handles unseen categories without raising errors."""
    preprocessor = get_salary_preprocessor()
    train_df = create_input_dataframe(
        role="FullStack",
        city="Lahore",
        experience="Fresh",
        company_size="Small",
        job_type="Onsite",
        skills=["ReactJS"]
    )
    preprocessor.fit(train_df)

    unseen_df = create_input_dataframe(
        role="UnknownRole123",
        city="UnknownCity456",
        experience="Fresh",
        company_size="Small",
        job_type="Hybrid",
        skills=["ReactJS"]
    )
    # Must transform without raising ValueError
    transformed = preprocessor.transform(unseen_df)
    assert isinstance(transformed, np.ndarray)
    assert transformed.shape[0] == 1
    assert not np.isnan(transformed).any()

def test_jobtype_preprocessor_excludes_jobtype():
    """Verify Job Type preprocessor does not include Job_Type in its feature pipeline."""
    preprocessor = get_jobtype_preprocessor()
    cols = [trans[2] for trans in preprocessor.transformers]
    flattened = [item for sublist in cols for item in (sublist if isinstance(sublist, list) else [sublist])]
    assert 'Job_Type' not in flattened
