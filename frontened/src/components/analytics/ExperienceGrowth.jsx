import ChartCard from './ChartCard';

export default function ExperienceGrowth() {
  return (
    <div className="space-y-6">
      <div data-aos="fade-up" className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Experience & Growth</h1>
        <p className="text-slate-400 text-sm mt-1">
          Analyze how years of experience impact earning potential in the Pakistani tech market.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          endpoint="/api/charts/experience-growth"
          title="Career Growth Trajectory"
          description="Shows the general trajectory of salary growth as professionals move from fresh graduates to senior positions (1.5+ years). The steepest growth often occurs after the first year."
          delay={100}
        />
        <ChartCard
          endpoint="/api/charts/salary-by-experience"
          title="Salary Distribution by Experience"
          description="A detailed box plot or bar chart showing the variance and average salaries at different experience milestones. Outliers often represent exceptional skills or remote global jobs."
          delay={200}
        />
      </div>
    </div>
  );
}