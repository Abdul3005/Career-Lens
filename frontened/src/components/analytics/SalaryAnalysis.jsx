import ChartCard from './ChartCard';

export default function SalaryAnalysis() {
  return (
    <div className="space-y-6">
      <div data-aos="fade-up" className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Salary Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore compensation trends across different roles and geographical locations in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          endpoint="/api/charts/salary-by-role"
          title="Average Salary by Role"
          description="A breakdown of average monthly salaries for FullStack, IT Management, UI/UX Design, and AI Engineering roles. Notice how management and AI roles tend to command a premium."
          delay={100}
        />
        <ChartCard
          endpoint="/api/charts/salary-by-city"
          title="Average Salary by City"
          description="Comparison of median salaries across major tech hubs. Islamabad and Lahore often lead in compensation due to higher living costs and denser tech ecosystems."
          delay={200}
        />
      </div>
    </div>
  );
}