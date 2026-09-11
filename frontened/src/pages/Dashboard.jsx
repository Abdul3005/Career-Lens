import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import Sidebar from '../components/Sidebar';
import Form from '../components/predict/Form';
import Result from '../components/predict/Result';
import SalaryAnalysis from '../components/analytics/SalaryAnalysis';
import ExperienceGrowth from '../components/analytics/ExperienceGrowth';
import JobTypeAnalysis from '../components/analytics/JobTypeAnalysis';
import CompanySize from '../components/analytics/CompanySize';
import CityComparison from '../components/analytics/CityComparison';
import RegressionResults from '../components/analytics/RegressionResults';
import { Search, Menu, X, Info, BarChart2, Brain } from 'lucide-react';

function AboutView() {
  return (
    <div data-aos="fade-up" className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">About</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">
          About <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">CareerLens Pakistan</span>
        </h1>
        <p className="text-slate-400 leading-relaxed">
          Pakistan's first AI-powered career and salary intelligence platform, built specifically for tech professionals.
        </p>
      </div>

      <div className="grid gap-5">
        {[
          {
            icon: <Brain size={20} className="text-blue-400" />,
            title: 'AI-Powered Predictions',
            desc: 'Our ML regression models are trained on 400+ real market records from Pakistan\'s tech sector, covering salary, job type, and skill data across 4 major roles and 6 cities.',
          },
          {
            icon: <BarChart2 size={20} className="text-emerald-400" />,
            title: 'Comprehensive Analytics',
            desc: 'Explore 11 interactive visual charts covering salary trends, experience growth curves, city comparisons, company size impact, and statistical regression analysis.',
          },
          {
            icon: <Info size={20} className="text-blue-400" />,
            title: 'Skill Gap Insights',
            desc: 'Beyond salary, CareerLens identifies which skills you\'re missing relative to your role and experience level — helping you upskill strategically for maximum earning potential.',
          },
        ].map((item, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 100}
            className="glass-card rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div data-aos="fade-up" data-aos-delay="300" className="mt-8 glass-card rounded-2xl p-6 border border-blue-500/20">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot inline-block" />
          Platform Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: '400+', label: 'Market Records' },
            { val: '6', label: 'Major Cities' },
            { val: '4', label: 'Tech Roles' },
            { val: '29', label: 'Skills Tracked' },
          ].map((s, i) => (
            <div key={i} className="text-center py-3">
              <div className="text-2xl font-extrabold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{s.val}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <p data-aos="fade-up" data-aos-delay="400" className="text-center text-slate-600 text-xs mt-8">
        Built by ProbTech — Empowering Pakistani tech professionals with data-driven career decisions.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState('predict');
  const [predictionResult, setPredictionResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true });
  }, []);

  useEffect(() => {
    AOS.refresh();
    // Reset prediction result when switching away from predict
    if (activeView !== 'predict') {
      // keep result so user can come back
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleViewChange = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'predict':
        return (
          <div>
            <Form onResult={setPredictionResult} />
            {predictionResult && <Result data={predictionResult} />}
          </div>
        );
      case 'salary':     return <SalaryAnalysis />;
      case 'experience': return <ExperienceGrowth />;
      case 'jobtype':    return <JobTypeAnalysis />;
      case 'company':    return <CompanySize />;
      case 'city':       return <CityComparison />;
      case 'regression': return <RegressionResults />;
      case 'about':      return <AboutView />;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex font-['Sora',sans-serif]">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleViewChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-[#060B18]/95 backdrop-blur-xl sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            aria-label="Open menu"
          >
            <Menu size={19} className="text-slate-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-emerald-400 rounded-lg blur-sm opacity-60" />
              <div className="relative bg-linear-to-br from-blue-600 to-emerald-500 p-1.5 rounded-lg">
                <Search size={13} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="font-bold text-sm">
              Career<span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Lens</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            aria-label="Home"
          >
            <X size={19} className="text-slate-300" />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-5 md:p-7 lg:p-9 max-w-7xl w-full mx-auto">
          {renderView()}
        </div>
      </div>
    </div>
  );
}