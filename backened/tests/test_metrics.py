import pytest
import numpy as np
from models.train import compute_metrics

def test_perfect_prediction_metrics():
    """Verify metrics on identical ground truth and predictions."""
    y_true = np.array([50000, 100000, 150000, 200000])
    y_pred = np.array([50000, 100000, 150000, 200000])

    metrics = compute_metrics(y_true, y_pred)
    assert metrics['mae'] == 0.0
    assert metrics['rmse'] == 0.0
    assert metrics['r2'] == 1.0

def test_constant_offset_metrics():
    """Verify metrics when all predictions have a fixed error offset."""
    y_true = np.array([100.0, 200.0, 300.0, 400.0])
    y_pred = np.array([110.0, 210.0, 310.0, 410.0])  # constant +10 error

    metrics = compute_metrics(y_true, y_pred)
    assert metrics['mae'] == pytest.approx(10.0)
    assert metrics['rmse'] == pytest.approx(10.0)
    # Variance of true is 12500, MSE is 100 -> R2 = 1 - 100/12500 = 0.992
    assert metrics['r2'] == pytest.approx(0.992)

def test_rmse_greater_than_or_equal_to_mae():
    """Verify standard mathematical property: RMSE >= MAE."""
    np.random.seed(42)
    y_true = np.random.uniform(50000, 300000, size=50)
    y_pred = y_true + np.random.normal(0, 15000, size=50)

    metrics = compute_metrics(y_true, y_pred)
    assert metrics['rmse'] >= metrics['mae']
    assert 0 <= metrics['r2'] <= 1.0
