import ChartCard from './ChartCard';

export default function CityComparison() {
  return (
    <div className="space-y-6">
      <div data-aos="fade-up" className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">City Comparison</h1>
        <p className="text-slate-400 text-sm mt-1">
          A deep dive into the tech landscapes of Pakistan's 6 major cities.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          endpoint="/api/charts/salary-by-city"
          title="City Salary Baselines"
          description="A direct comparison of baseline and average salaries across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and Peshawar."
          delay={100}
        />
        <ChartCard
          endpoint="/api/charts/city-salary-by-role"
          title="Role Valuations Across Cities"
          description="Identifies which cities pay the most for specific roles. E.g., Islamabad might show a spike for AI Engineers due to specific tech parks or remote software houses based there."
          delay={200}
        />
      </div>
    </div>
  );
}