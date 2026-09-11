import { useEffect, useRef } from 'react';
import {
  TrendingUp,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  User,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';

function StatBadge({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/6">
      <span className="text-slate-500">{icon}</span>
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider leading-none mb-0.5">{label}</div>
        <div className="text-xs text-slate-300 font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function Result({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('fade-in-up');
    }
  }, [data]);

  if (!data) return null;

  const { salary, job_type, skill_gap, input_summary } = data;

  const confidenceColor =
    job_type.confidence >= 80
      ? 'from-emerald-500 to-emerald-400'
      : job_type.confidence >= 60
      ? 'from-blue-500 to-blue-400'
      : 'from-amber-500 to-amber-400';

  const formatSalary = (n) =>
    new Intl.NumberFormat('en-PK').format(Math.round(n));

  const expLabel = {
    Fresh: 'Fresh Graduate',
    '6Months': '6 Months',
    '1Year': '1 Year',
    'MoreThan1.5Years': '1.5+ Years',
  };

  return (
    <div id="prediction-result" ref={ref} className="max-w-4xl mx-auto mt-8 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
        <CheckCircle2 size={14} />
        Prediction Results
      </div>

      {/* Main Salary Card */}
      <div className="relative glass-card rounded-2xl p-7 border border-emerald-500/20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Predicted Monthly Salary
                </span>
              </div>
              <div className="text-5xl md:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent leading-none">
                {formatSalary(salary.predicted)}
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                PKR / month
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                <ArrowUpRight size={14} />
                Live Estimate
              </div>
              <span className="text-xs text-slate-500">Based on {input_summary.skills_count} skills</span>
            </div>
          </div>

          {/* Salary Range Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Min: <span className="text-slate-300 font-medium">PKR {formatSalary(salary.min)}</span></span>
              <span>Max: <span className="text-slate-300 font-medium">PKR {formatSalary(salary.max)}</span></span>
            </div>
            <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
              {/* Range fill */}
              <div
                className="absolute top-0 h-full bg-linear-to-r from-blue-500/50 to-emerald-500/50 rounded-full"
                style={{ left: '0%', right: '0%' }}
              />
              {/* Predicted marker */}
              <div
                className="absolute top-0 h-full w-1 bg-white rounded-full shadow-lg"
                style={{
                  left: `${((salary.predicted - salary.min) / (salary.max - salary.min)) * 100}%`,
                }}
              />
            </div>
            <div className="text-center text-[11px] text-slate-500 mt-1.5">
              Salary range: PKR {formatSalary(salary.min)} – {formatSalary(salary.max)}
            </div>
          </div>

          {/* Input Summary Badges */}
          <div className="flex flex-wrap gap-2">
            <StatBadge icon={<User size={12} />}       label="Role"       value={input_summary.role} />
            <StatBadge icon={<MapPin size={12} />}      label="City"       value={input_summary.city} />
            <StatBadge icon={<Clock size={12} />}       label="Experience" value={expLabel[input_summary.experience] || input_summary.experience} />
            <StatBadge icon={<Building2 size={12} />}   label="Company"    value={input_summary.company_size} />
          </div>
        </div>
      </div>

      {/* Job Type + Skill Gap Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Job Type Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/6">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold text-white">Job Type Prediction</h3>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-4 py-2 rounded-xl font-bold text-base ${
                job_type.predicted === 'Onsite'
                  ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {job_type.predicted}
            </span>
            <span className="text-2xl font-black text-white">
              {job_type.confidence.toFixed(1)}%
            </span>
          </div>

          {/* Confidence Bar */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
              <span>Confidence</span>
              <span>{job_type.confidence.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full bg-linear-to-r ${confidenceColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${job_type.confidence}%` }}
              />
            </div>
          </div>

          {/* Onsite vs Remote Split */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="text-center p-2.5 rounded-xl bg-blue-500/8 border border-blue-500/15">
              <div className="text-lg font-bold text-blue-300">{job_type.onsite_prob.toFixed(0)}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Onsite</div>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
              <div className="text-lg font-bold text-emerald-300">{job_type.remote_prob.toFixed(0)}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Remote</div>
            </div>
          </div>
        </div>

        {/* Skill Gap Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/6">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white">Skill Gap Analysis</h3>
          </div>

          {skill_gap && skill_gap.length > 0 ? (
            <>
              <div className="flex items-start gap-2 mb-4 text-amber-400/80 text-xs bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2.5">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                <span>
                  {skill_gap.length} skill{skill_gap.length > 1 ? 's' : ''} recommended to maximize your market value.
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill_gap.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium"
                  >
                    + {skill.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-28 text-center">
              <CheckCircle2 size={32} className="text-emerald-400 mb-3" />
              <p className="text-emerald-400 font-semibold text-sm">No skill gaps detected!</p>
              <p className="text-slate-500 text-xs mt-1">Your skill set is well-matched for this role.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}