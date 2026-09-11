import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, ImageOff, RefreshCw } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_URL || 'https://career-lens-salary-prediction-pakistan.onrender.com';

/**
 * Reusable chart card that fetches a PNG from the FastAPI backend.
 * @param {string} endpoint - e.g. "/api/charts/salary-by-role"
 * @param {string} title    - Card title
 * @param {string} description - Short description shown below chart
 * @param {number} delay    - AOS delay in ms
 */
export default function ChartCard({ endpoint, title, description, delay = 0 }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchChart = async () => {
    setLoading(true);
    setError(false);
    setSrc(null);
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, {
        responseType: 'blob',
        timeout: 15000,
      });
      const url = URL.createObjectURL(response.data);
      setSrc(url);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChart();
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className="glass-card rounded-2xl border border-white/6 overflow-hidden group hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600/20 to-emerald-500/20 flex items-center justify-center border border-white/8">
            <TrendingUp size={14} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        <button
          onClick={fetchChart}
          title="Refresh chart"
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Chart area */}
      <div className="p-4 chart-img-container">
        {loading && (
          <div className="w-full h-64 rounded-xl skeleton flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-600">
              <RefreshCw size={22} className="animate-spin" />
              <span className="text-xs">Loading chart…</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="w-full h-64 rounded-xl flex flex-col items-center justify-center gap-3 bg-red-500/5 border border-red-500/15 text-red-400">
            <ImageOff size={28} />
            <div className="text-center">
              <p className="text-sm font-semibold">Chart unavailable</p>
              <p className="text-xs text-slate-500 mt-1">Make sure the backend is running</p>
            </div>
            <button
              onClick={fetchChart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {src && !loading && (
          <img
            src={src}
            alt={title}
            className="w-full h-auto rounded-xl object-contain transition-transform duration-300"
            style={{ maxHeight: '480px' }}
          />
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="px-5 pb-4">
          <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
