# Model Evaluation Report — Career-Lens Salary Intelligence

**Generated on:** 2026-09-09 21:10:15  
**Dataset:** `careerlens_dataset.csv` (1,200 records)

---

## 1. Executive Summary

This report provides the formal evaluation of machine learning models for salary prediction and job type classification for the **Career-Lens Pakistan** platform. All models were evaluated under an identical, leak-free test split to determine the optimal production pipeline.

**Selected Production Model:** **Gradient Boosting**  
- **Test MAE:** PKR 6,923
- **Test RMSE:** PKR 9,158
- **Test R² Score:** 0.9846

---

## 2. Dataset & Features

- **Total Records:** 1,200
- **Target Variable (Salary):**
  - Mean: PKR 146,781
  - Median: PKR 133,000
  - Std Dev: PKR 71,715
  - Range: PKR 32,000 – PKR 430,000
- **Categorical Nominal Features:** `Role` (4 categories), `City` (6 categories), `Job_Type` (2 categories: Onsite/Remote)
- **Ordinal Features:**
  - `Experience`: `Fresh` < `6Months` < `1Year` < `MoreThan1.5Years`
  - `Company_Size`: `Small` < `Medium` < `Large`
- **Technical Skills:** 29 binary indicators (0/1)

---

## 3. Preprocessing Architecture

A modular `scikit-learn` `ColumnTransformer` pipeline was implemented to replace previous fragmented and manual label encoding:
1. **Nominal Features (`Role`, `City`, `Job_Type`):** Processed via `OneHotEncoder(handle_unknown='ignore', sparse_output=False)` to prevent unobserved categories from crashing the inference API.
2. **Ordinal Features (`Experience`, `Company_Size`):** Encoded via `OrdinalEncoder` respecting real domain hierarchies (avoiding arbitrary alphabetical distortion).
3. **Skill Features:** Passed through directly as numeric binary signals.
4. **Feature Scaling:** `StandardScaler` applied where appropriate (e.g., Linear Regression).

---

## 4. Train / Test Split

- **Split Ratio:** 80% Training (960 samples), 20% Testing (240 samples)
- **Random State:** `42` (ensuring deterministic reproducibility across all experiments)

---

## 5. Model Evaluation & Comparison Table

The three candidate regression algorithms were trained and evaluated on both training and held-out test splits:

| Model | Test MAE (PKR) | Test RMSE (PKR) | Test R² Score | Train MAE (PKR) | Train RMSE (PKR) | Train R² Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Linear Regression** | PKR 14,340 | PKR 19,652 | 0.9293 | PKR 13,954 | PKR 19,029 | 0.9284 |
| **Random Forest** | PKR 9,691 | PKR 13,001 | 0.9690 | PKR 4,119 | PKR 5,631 | 0.9937 |
| **Gradient Boosting** | PKR 6,923 | PKR 9,158 | 0.9846 | PKR 5,461 | PKR 7,209 | 0.9897 |

---

## 6. Model Selection & Justification

**Winning Model:** **Gradient Boosting**

### Selection Rationale:
1. **Superior Generalization:** Gradient Boosting achieved the highest R² score (0.9846) and the lowest prediction errors (MAE: PKR 6,923, RMSE: PKR 9,158) on unseen test data.
2. **Balanced Variance vs Bias:** Unlike unregularized complex models that risk severe overfitting, the chosen architecture maintains robust consistency between training and test error.
3. **Artifact Encapsulation:** The winning model has been bundled with the entire `ColumnTransformer` preprocessor into a single serialized `salary_pipeline.joblib` artifact, ensuring reproducible, zero-leakage inference in production.

---

## 7. Job Type Classification (Target Leakage Fix)

In the previous codebase, the `Job_Type` classifier suffered from target leakage because `Job_Type_enc` was passed as an input feature to predict itself.

- **Remediation:** Input features for job type prediction were restricted strictly to `Role`, `City`, `Experience`, `Company_Size`, and the 29 technical skills.
- **Algorithm:** `LogisticRegression(max_iter=1000, random_state=42)` within an isolated `ColumnTransformer` pipeline.
- **Leak-Free Test Accuracy:** **54.17%**
- **Artifact:** Saved as `jobtype_pipeline.joblib`.

---

## 8. Limitations & Production Considerations

1. **Dataset Breadth:** The dataset consists of 1,200 synthetic/curated Pakistani tech market records across 4 specific roles. Broader role coverage (DevOps, Data Engineering, Cyber Security) would improve general market applicability.
2. **Inflation & Currency Dynamics:** Tech salaries in Pakistan experience rapid shifts due to macroeconomic and foreign exchange factors. Dynamic periodic retraining is recommended.
3. **Unseen Categories:** While `OneHotEncoder(handle_unknown='ignore')` gracefully defaults unseen roles or cities to zero coefficients, user warnings should be triggered when inference inputs fall outside the training distribution.
