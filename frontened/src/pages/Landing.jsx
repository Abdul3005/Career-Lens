import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  TrendingUp,
  MapPin,
  Award,
  ChevronRight,
  BarChart2,
  Briefcase,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      easing: "ease-out-cubic" });
  }, []);

  const features = [
    {
      icon: <TrendingUp size={22} />,
      title: "Salary Prediction",
      desc: "Get accurate salary estimates based on your skills, experience, and city using ML regression models.",
    },
    {
      icon: <Briefcase size={22} />,
      title: "Job Type Classifier",
      desc: "Predict whether your profile fits Onsite or Remote roles with confidence percentages.",
    },
    {
      icon: <MapPin size={22} />,
      title: "6 City Coverage",
      desc: "Compare salaries across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad & Peshawar.",
    },
    {
      icon: <BarChart2 size={22} />,
      title: "Visual Analytics",
      desc: "Explore interactive charts — salary trends, city comparisons, company size impact & more.",
    },
    {
      icon: <Zap size={22} />,
      title: "Skill Gap Analysis",
      desc: "Discover which skills to learn next to maximize your market value and earning potential.",
    },
    {
      icon: <Users size={22} />,
      title: "All Tech Roles",
      desc: "Covers FullStack, IT Management, UI/UX Design, and AI Engineer career paths.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Fill Your Profile",
      desc: "Select your role, city, experience level, company preference, and technical skills.",
      icon: <CheckCircle size={18} />,
    },
    {
      num: "02",
      title: "AI Analyzes Data",
      desc: "Our ML models trained on 400+ Pakistan market records process your profile instantly.",
      icon: <Zap size={18} />,
    },
    {
      num: "03",
      title: "Get Insights",
      desc: "Receive salary predictions, job type forecasts, skill gaps, and visual market analytics.",
      icon: <Star size={18} />,
    },
  ];

  const stats = [
    { val: "400+", label: "Market Records" },
    { val: "6", label: "Major Cities" },
    { val: "4", label: "Tech Roles" },
    { val: "29", label: "Skills Tracked" },
  ];

  return (
    <div className="min-h-screen bg-[#060B18] text-white overflow-x-hidden font-['Sora',sans-serif]">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#060B18]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-emerald-400 rounded-xl blur-md opacity-60" />
            <div className="relative bg-linear-to-br from-blue-600 to-emerald-500 p-2 rounded-xl">
              <Search size={18} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Career<span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Lens</span>
          </span>
          <span className="text-xs text-slate-500 font-medium ml-0.5">Pakistan</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-white transition-colors">About</a>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-emerald-500 text-sm font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-900/30"
        >
          Get Started <ChevronRight size={15} />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">

        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px]" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Badge */}
        <div
          data-aos="fade-down"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-8"
        >
          <Globe size={12} />
          Pakistan's First AI Career Intelligence Platform
        </div>

        {/* Heading */}
        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-5xl mb-6"
        >
          Know Your{" "}
          <span className="relative">
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Market Worth
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-blue-400 to-emerald-400 opacity-40" />
          </span>
          <br />
          Before You Negotiate
        </h1>

        {/* Subheading */}
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          CareerLens Pakistan uses real market data and ML models to predict
          your salary, job type fit, and skill gaps built specifically for
          Pakistani tech professionals.
        </p>

        {/* CTA Buttons */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-emerald-500 text-white font-semibold text-base hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-blue-900/40"
          >
            Start Predicting Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            See How It Works
          </a>
        </div>

        {/* Stats row */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="flex flex-wrap justify-center gap-8"
          id="stats"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {s.val}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
              Everything You Need to{" "}
              <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Decide Smarter
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Data-driven tools built for Pakistan's tech job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group relative p-6 rounded-2xl border border-white/5 bg-white/3 hover:bg-white/6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-600/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-br from-blue-600/20 to-emerald-500/20 text-blue-400 group-hover:text-emerald-400 transition-colors mb-4 border border-white/5">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-70 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
              3 Steps to Career{" "}
              <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Clarity
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 150}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-linear-to-r from-blue-500/40 to-transparent" />
                )}

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600/20 to-emerald-500/20 border border-white/10 mb-6 relative">
                  <span className="text-3xl font-black bg-linear-to-br from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16" data-aos="fade-up">
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold text-base hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-blue-900/40"
            >
              Try CareerLens Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-blue-600 to-emerald-500 p-1.5 rounded-lg">
              <Search size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm">
              Career<span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Lens</span>
              <span className="text-slate-500 ml-1">Pakistan</span>
            </span>
          </div>
          <p className="text-slate-600 text-xs">
            Built for Pakistani tech students & professionals — ProbTech
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Award size={12} />
            AI-Powered Career Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}