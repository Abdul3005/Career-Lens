# CareerLens Pakistan 🔍

> **AI-Powered Career & Salary Intelligence Platform for Pakistani Tech Professionals**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)

---

## 📌 About

**CareerLens Pakistan** is a data-driven, AI-powered web application that helps Pakistani tech students and fresh graduates make informed career decisions. Built as a Probability & Statistics project (Spring 2026), it uses real market data and machine learning models to predict salaries and job type fit across 6 major Pakistani tech cities.

---

## 🎯 Problem Statement

Pakistan's tech industry is growing rapidly, yet students face a critical challenge — they have no reliable, data-driven way to know what salary they should expect when entering the job market.

- ❌ Fresh graduates blindly accept underpaid offers
- ❌ No centralized platform for Pakistan-specific salary data
- ❌ Students don't know which skills maximize their earning potential
- ❌ No way to compare salaries across cities and company sizes

**CareerLens Pakistan solves all of this.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 💰 Salary Prediction | Predict expected salary based on role, skills, city & experience |
| 🏢 Job Type Classifier | Predict Onsite vs Remote fit with confidence percentage |
| 🗺️ 6 City Coverage | Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Peshawar |
| 📊 Visual Analytics | 11 interactive charts — salary trends, city comparisons & more |
| ⚡ Skill Gap Analysis | Discover which skills to learn to maximize market value |
| 👔 4 Tech Roles | FullStack, IT Management, UI/UX Design, AI Engineer |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** — styling
- **Recharts** — interactive charts
- **Lucide React** — icons
- **AOS** — scroll animations
- **React Router DOM** — navigation
- **Axios** — API calls

### Backend
- **Python** + **FastAPI** — REST API
- **Scikit-learn** — ML models
- **Pandas + NumPy** — data processing
- **Matplotlib + Seaborn** — chart generation
- **Pickle** — model serialization
- **Uvicorn** — ASGI server

---

## 🤖 ML Models

| Model | Algorithm | Purpose |
|---|---|---|
| Salary Model | Linear Regression | Predict monthly salary (PKR) |
| Job Type Model | Logistic Regression | Predict Onsite vs Remote |

### Dataset
- **1,200 records** covering 4 tech roles
- **6 Pakistani cities** with real market salary ranges
- **29 skill columns** (binary 0/1 encoding)
- Variables: Role, City, Experience, Company Size, Job Type, Skills, Salary

---

## 📁 Project Structure

```
careerlens-pakistan/
│
├── backend/
│   ├── data/
│   │   └── careerlens_dataset.csv     # Training dataset
│   ├── models/
│   │   ├── train.py                   # ML model training script
│   │   ├── salary_model.pkl           # Trained salary model
│   │   ├── jobtype_model.pkl          # Trained job type model
│   │   └── *.pkl                      # Label encoders
│   ├── routes/
│   │   ├── predict.py                 # Prediction endpoints
│   │   └── charts.py                  # Chart generation endpoints
│   ├── main.py                        # FastAPI app entry point
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx            # Landing page
│   │   │   └── Dashboard.jsx          # Main dashboard
│   │   ├── components/
│   │   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   │   ├── predict/
│   │   │   │   ├── Form.jsx           # Prediction form
│   │   │   │   └── Result.jsx         # Prediction results
│   │   │   └── analytics/
│   │   │       ├── SalaryAnalysis.jsx
│   │   │       ├── ExperienceGrowth.jsx
│   │   │       ├── JobTypeAnalysis.jsx
│   │   │       ├── CompanySize.jsx
│   │   │       ├── CityComparison.jsx
│   │   │       └── RegressionResults.jsx
│   │   └── assets/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/careerlens-pakistan.git
cd careerlens-pakistan/backend

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Train the ML models
cd models
python train.py
cd ..

# 5. Start the server
uvicorn main:app --reload
```

Backend runs on: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# 1. Go to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📡 API Endpoints

### Prediction
```
POST /api/predict
```

**Request Body:**
```json
{
  "role": "FullStack",
  "city": "Lahore",
  "experience": "Fresh",
  "company_size": "Small",
  "job_type": "Onsite",
  "skills": ["ReactJS", "NodeJS", "MongoDB", "Git"]
}
```

**Response:**
```json
{
  "salary": {
    "predicted": 65000,
    "min": 55000,
    "max": 75000,
    "currency": "PKR",
    "period": "monthly"
  },
  "job_type": {
    "predicted": "Onsite",
    "confidence": 87.5,
    "onsite_prob": 87.5,
    "remote_prob": 12.5
  },
  "skill_gap": ["SQL", "Git"]
}
```

### Charts (all return PNG images)
```
GET /api/charts/salary-by-role
GET /api/charts/salary-by-city
GET /api/charts/salary-by-experience
GET /api/charts/salary-by-company
GET /api/charts/experience-growth
GET /api/charts/salary-distribution
GET /api/charts/jobtype-distribution
GET /api/charts/company-salary-by-role
GET /api/charts/city-salary-by-role
GET /api/charts/skill-salary-heatmap
GET /api/charts/jobtype-by-role
```

---

## 📊 Statistical Methods Used

| Method | Implementation |
|---|---|
| Descriptive Statistics | Mean, Median, Mode, Std Dev, IQR on salary data |
| Confidence Intervals | 95% CI shown for all salary predictions |
| Probability Distribution | Normal distribution curve on salary data |
| Linear Regression | Salary prediction model |
| Logistic Regression | Job type classification (Onsite/Remote) |
| Data Visualization | Bar charts, Box plots, Heatmaps, Pie charts, Line charts |

---

## 🗺️ City Salary Insights

| City | Avg Salary | Multiplier |
|---|---|---|
| Karachi | Highest | +20% |
| Islamabad | 2nd | +15% |
| Rawalpindi | 3rd | +8% |
| Lahore | 4th | +5% |
| Faisalabad | 5th | -15% |
| Peshawar | 6th | -20% |

---

## 📋 Requirements

```
fastapi
uvicorn
pandas
numpy
scikit-learn
matplotlib
seaborn
openpyxl
python-multipart
pickle
```

---

## 📄 License

This project was built for **Probability & Statistics — Spring 2026** course project.

---

## 🙏 Acknowledgements

- Data inspired by **Rozee.pk**, **LinkedIn Pakistan**, **Glassdoor Pakistan**
- Built with ❤️ for Pakistani tech students

---

<p align="center">
  <b>CareerLens Pakistan</b> — Know Your Market Worth Before You Negotiate 🚀
</p>
