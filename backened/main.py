import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from routes.predicts import router as predict_router, salary_pipeline, jobtype_pipeline
from routes.charts import router as charts_router

# Initialize App with redirect_slashes disabled to fix preflight OPTIONS issues
app = FastAPI(
    title="CareerLens Pakistan API",
    description="AI-Powered Career & Salary Intelligence Platform",
    version="1.0.0",
    redirect_slashes=False
)

# ─── CORS CONFIGURATION (SAB SE PEHLE) ──────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manual OPTIONS handler to catch any unhandled preflight requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {}

# ─── ROUTES ──────────────────────────────────────────────
app.include_router(predict_router, prefix="/api")
app.include_router(charts_router,  prefix="/api")

# ─── HEALTH CHECK ────────────────────────────────────────
@app.get("/health")
def health():
    salary_loaded = salary_pipeline is not None
    jobtype_loaded = jobtype_pipeline is not None
    healthy = salary_loaded and jobtype_loaded

    return {
        "status": "healthy" if healthy else "degraded",
        "version": "1.0.0",
        "models": {
            "salary_pipeline_loaded": salary_loaded,
            "jobtype_pipeline_loaded": jobtype_loaded,
            "salary_model_type": type(salary_pipeline.named_steps.get('regressor')).__name__ if salary_loaded else None,
            "jobtype_model_type": type(jobtype_pipeline.named_steps.get('classifier')).__name__ if jobtype_loaded else None
        }
    }

# ─── ROOT ────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "CareerLens Pakistan API is running! 🚀"}