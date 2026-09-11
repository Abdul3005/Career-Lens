import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Brain,
  BarChart2,
  TrendingUp,
  Briefcase,
  Building2,
  MapPin,
  LineChart,
  Info,
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';

const MENU = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={17} />,
    type: 'navigate',
  },
  {
    id: 'predict',
    label: 'Predict',
    icon: <Brain size={17} />,
    type: 'view',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 size={17} />,
    type: 'group',
    children: [
      { id: 'salary',     label: 'Salary Analysis',      icon: <TrendingUp size={15} /> },
      { id: 'experience', label: 'Experience & Growth',   icon: <LineChart size={15} /> },
      { id: 'jobtype',    label: 'Job Type Analysis',     icon: <Briefcase size={15} /> },
      { id: 'company',    label: 'Company Size Impact',   icon: <Building2 size={15} /> },
      { id: 'city',       label: 'City Comparison',       icon: <MapPin size={15} /> },
      { id: 'regression', label: 'Regression Results',    icon: <BarChart2 size={15} /> },
    ],
  },
  {
    id: 'about',
    label: 'About',
    icon: <Info size={17} />,
    type: 'view',
  },
];

export default function Sidebar({ activeView, setActiveView, isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [analyticsOpen, setAnalyticsOpen] = useState(
    ['salary', 'experience', 'jobtype', 'company', 'city', 'regression'].includes(activeView)
  );

  const analyticsIds = ['salary', 'experience', 'jobtype', 'company', 'city', 'regression'];
  const isAnalyticsActive = analyticsIds.includes(activeView);

  const handleClick = (item) => {
    if (item.type === 'navigate') {
      navigate('/');
    } else if (item.type === 'view') {
      setActiveView(item.id);
    } else if (item.type === 'group') {
      setAnalyticsOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#0A1020] border-r border-white/5 z-40">
        <SidebarContent
          activeView={activeView}
          setActiveView={setActiveView}
          analyticsOpen={analyticsOpen}
          setAnalyticsOpen={setAnalyticsOpen}
          isAnalyticsActive={isAnalyticsActive}
          handleClick={handleClick}
          onClose={null}
        />
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-[#0A1020] border-r border-white/5 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          activeView={activeView}
          setActiveView={setActiveView}
          analyticsOpen={analyticsOpen}
          setAnalyticsOpen={setAnalyticsOpen}
          isAnalyticsActive={isAnalyticsActive}
          handleClick={handleClick}
          onClose={() => setIsOpen(false)}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  activeView,
  setActiveView,
  analyticsOpen,
  setAnalyticsOpen,
  isAnalyticsActive,
  handleClick,
  onClose,
}) {
  const navigate = useNavigate();
  const analyticsIds = ['salary', 'experience', 'jobtype', 'company', 'city', 'regression'];

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-emerald-400 rounded-xl blur-md opacity-60" />
            <div className="relative bg-linear-to-br from-blue-600 to-emerald-500 p-2 rounded-xl">
              <Search size={16} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight">
              Career<span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Lens</span>
            </span>
            <div className="text-[10px] text-slate-500 font-medium -mt-0.5">Pakistan</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium group"
        >
          <Home size={17} className="group-hover:text-blue-400 transition-colors" />
          Home
        </button>

        {/* Predict */}
        <button
          onClick={() => setActiveView('predict')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeView === 'predict'
              ? 'sidebar-active text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Brain
            size={17}
            className={activeView === 'predict' ? 'text-blue-400' : 'group-hover:text-blue-400'}
          />
          Predict
          {activeView === 'predict' && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          )}
        </button>

        {/* Analytics Group */}
        <div>
          <button
            onClick={() => setAnalyticsOpen((p) => !p)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isAnalyticsActive
                ? 'text-white bg-white/5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2
              size={17}
              className={isAnalyticsActive ? 'text-emerald-400' : ''}
            />
            Analytics
            <span className="ml-auto">
              {analyticsOpen
                ? <ChevronDown size={14} className="text-slate-500" />
                : <ChevronRight size={14} className="text-slate-500" />
              }
            </span>
          </button>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              analyticsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="ml-4 mt-1 space-y-0.5 border-l border-white/5 pl-3">
              {[
                { id: 'salary',     label: 'Salary Analysis',    icon: <TrendingUp size={14} /> },
                { id: 'experience', label: 'Experience & Growth', icon: <LineChart size={14} /> },
                { id: 'jobtype',    label: 'Job Type Analysis',   icon: <Briefcase size={14} /> },
                { id: 'company',    label: 'Company Size Impact', icon: <Building2 size={14} /> },
                { id: 'city',       label: 'City Comparison',     icon: <MapPin size={14} /> },
                { id: 'regression', label: 'Regression Results',  icon: <BarChart2 size={14} /> },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveView(sub.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeView === sub.id
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={activeView === sub.id ? 'text-emerald-400' : 'text-slate-600'}>
                    {sub.icon}
                  </span>
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <button
          onClick={() => setActiveView('about')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeView === 'about'
              ? 'sidebar-active text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Info
            size={17}
            className={activeView === 'about' ? 'text-blue-400' : ''}
          />
          About
          {activeView === 'about' && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          )}
        </button>
      </nav>

      {/* Footer */}
      {/* <div className="px-4 py-4 border-t border-white/5">
        <div className="px-3 py-3 rounded-xl bg-linear-to-br from-blue-600/10 to-emerald-500/10 border border-blue-500/10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs text-emerald-400 font-semibold">API Connected</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            FastAPI backend on <span className="text-slate-400 font-mono">localhost:8000</span>
          </p>
        </div>
      </div> */}
    </div>
  );
}