import { useState } from 'react';
import axios from 'axios';
import { Brain, ChevronDown, Loader2, Sparkles, AlertCircle, Check } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_URL || 'https://career-lens-salary-prediction-pakistan.onrender.com';
const API = axios.create({ baseURL: API_BASE });

const ROLES    = ['FullStack', 'ITManagement', 'UIUXDesign', 'AIEngineer'];
const CITIES   = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];
const EXP      = ['Fresh', '6Months', '1Year', 'MoreThan1.5Years'];
const SIZES    = [
  { value: 'Small', label: 'Small (<50)' },
  { value: 'Medium', label: 'Medium (50-200)' },
  { value: 'Large', label: 'Large (200+)' }
];
const JOBTYPES = ['Onsite', 'Remote'];

const ROLE_SKILLS = {
  FullStack: [
    {
      label: 'FULLSTACK SKILLS',
      color: 'blue',
      skills: ['ReactJS', 'NodeJS', 'Python', 'SQL', 'MongoDB', 'Git', 'PWA', 'Socket_io'],
    },
    {
      label: 'MANAGEMENT SKILLS',
      color: 'amber',
      skills: ['Agile', 'JIRA', 'Documentation'],
    },
    {
      label: 'DESIGN SKILLS',
      color: 'pink',
      skills: ['Figma', 'Wireframing'],
    }
  ],
  ITManagement: [
    {
      label: 'MANAGEMENT SKILLS',
      color: 'amber',
      skills: ['Agile', 'JIRA', 'BA', 'Project_Mgmt', 'IT_Support', 'Documentation', 'Risk_Mgmt', 'Stakeholder_Mgmt'],
    },
    {
      label: 'TECHNICAL SKILLS',
      color: 'blue',
      skills: ['SQL', 'Python', 'Git', 'Pandas'],
    }
  ],
  UIUXDesign: [
    {
      label: 'DESIGN SKILLS',
      color: 'pink',
      skills: ['Figma', 'User_Research', 'Wireframing', 'Prototyping', 'Adobe_XD', 'Design_Systems', 'Usability_Testing', 'Interaction_Design'],
    },
    {
      label: 'SUPPORTING SKILLS',
      color: 'purple',
      skills: ['ReactJS', 'Agile', 'JIRA', 'Documentation', 'BA'],
    }
  ],
  AIEngineer: [
    {
      label: 'AI Engineer SKILLS',
      color: 'purple',
      skills: ['Python', 'Pandas', 'Scikit_learn', 'TensorFlow', 'LLM', 'LangChain'],
    },
    {
      label: 'SUPPORTING SKILLS',
      color: 'blue',
      skills: ['SQL', 'Git', 'MongoDB', 'Agile', 'JIRA', 'Documentation'],
    }
  ]
};

const COLOR_MAP = {
  blue:   { dot: 'bg-blue-400',   label: 'text-blue-400' },
  purple: { dot: 'bg-purple-400', label: 'text-purple-400' },
  amber:  { dot: 'bg-amber-400',  label: 'text-amber-400'  },
  pink:   { dot: 'bg-pink-400',   label: 'text-pink-400'   },
};

function SelectField({ label, id, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#0F172A] border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none transition-colors cursor-pointer hover:border-white/15"
        >
          <option value="" disabled className="text-slate-500">{placeholder}</option>
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lbl = typeof o === 'string' ? o : o.label;
            return (
              <option key={val} value={val} className="bg-[#0F172A]">{lbl}</option>
            );
          })}
        </select>
        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function Form({ onResult }) {
  const [form, setForm] = useState({
    role: '', city: '', experience: '', company_size: '', job_type: '',
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleRoleChange = (val) => {
    setForm((f) => ({ ...f, role: val }));
    setSelectedSkills([]);
    setError('');
    setWarning('');
  };

  const handleFieldChange = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setError('');
    setWarning('');
  };

  const toggleSkill = (skill) => {
    setError('');
    setWarning('');
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearAllSkills = () => {
    setSelectedSkills([]);
    setError('');
    setWarning('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const missing = Object.entries(form).filter(([, v]) => !v);
    if (missing.length > 0) {
      setError('Please fill in all profile fields before predicting.');
      return;
    }

    if (selectedSkills.length === 0) {
      setError('Please select at least one skill to get a prediction');
      return;
    }

    if (selectedSkills.length < 4) {
      setWarning('⚠️ Please increase your skills for the market — this is not enough (atleast 4 required)');
      return;
    }

    setError('');
    setWarning('');
    setLoading(true);
    
    try {
      const { data } = await API.post('/api/predict', {
        ...form,
        skills: selectedSkills,
      });
      onResult(data);
      setTimeout(() => {
        document.getElementById('prediction-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to connect to the API. Make sure the backend is running on localhost:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const currentRoleSkills = form.role ? ROLE_SKILLS[form.role] : null;

  return (
    <div data-aos="fade-up" className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">AI Prediction</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-2">
          Predict Your{' '}
          <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Market Value
          </span>
        </h1>
        <p className="text-slate-400 text-sm">
          Fill in your profile details and our ML model will predict your salary, job type fit, and skill gaps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Fields */}
        <div className="glass-card rounded-2xl p-6 border border-white/6">
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Brain size={16} className="text-blue-400" />
            Your Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField
              label="Role"
              id="role"
              value={form.role}
              onChange={handleRoleChange}
              options={ROLES}
              placeholder="Select role…"
            />
            <SelectField
              label="City"
              id="city"
              value={form.city}
              onChange={handleFieldChange('city')}
              options={CITIES}
              placeholder="Select city…"
            />
            <SelectField
              label="Experience"
              id="experience"
              value={form.experience}
              onChange={handleFieldChange('experience')}
              options={EXP}
              placeholder="Select experience…"
            />
            <SelectField
              label="Company Size"
              id="company_size"
              value={form.company_size}
              onChange={handleFieldChange('company_size')}
              options={SIZES}
              placeholder="Select size…"
            />
            <SelectField
              label="Job Type"
              id="job_type"
              value={form.job_type}
              onChange={handleFieldChange('job_type')}
              options={JOBTYPES}
              placeholder="Select type…"
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="glass-card rounded-2xl p-6 border border-white/6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              Skills
              {currentRoleSkills && (
                <span className="text-xs text-slate-500 font-normal">
                  ({selectedSkills.length} skills selected)
                </span>
              )}
            </h2>
            {selectedSkills.length > 0 && (
              <button
                type="button"
                onClick={clearAllSkills}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {!currentRoleSkills ? (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-white/5 rounded-xl border border-white/10 border-dashed">
              <Brain size={32} className="text-slate-500 mb-3" />
              <p className="text-slate-400 text-sm font-medium">
                Please select a role first to see relevant skills
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentRoleSkills.map((group) => {
                const c = COLOR_MAP[group.color];
                return (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className={`text-xs font-semibold ${c.label} uppercase tracking-wider`}>
                        {group.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {group.skills.map((skill) => {
                        const active = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                              active
                                ? 'bg-linear-to-r from-blue-600 to-emerald-500 border-transparent text-white shadow-lg shadow-blue-900/30'
                                : 'bg-[#0F172A] border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            {active && <Check size={14} className="text-white" strokeWidth={3} />}
                            {skill.replace(/_/g, ' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Validation Messages */}
        {warning && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
            <span className="mt-0.5 whitespace-pre-line leading-relaxed">{warning}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold text-base hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Analyzing your profile…
            </>
          ) : (
            <>
              <Brain size={20} />
              Predict Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}