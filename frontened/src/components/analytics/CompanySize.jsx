import ChartCard from './ChartCard';

export default function CompanySize() {
  return (
    <div className="space-y-6">
      <div data-aos="fade-up" className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Company Size Impact</h1>
        <p className="text-slate-400 text-sm mt-1">
          Understand how joining a startup versus an enterprise affects your compensation package.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          endpoint="/api/charts/salary-by-company"
          title="Salary vs Company Size"
          description="Average salaries offered by Small, Medium, and Large enterprises. While large companies often offer stability and higher base pay, small startups might offer varied rapid-growth roles."
          delay={100}
        />
        <ChartCard
          endpoint="/api/charts/company-salary-by-role"
          title="Role Salaries by Company Size"
          description="A breakdown showing how specific roles are valued differently depending on the organization's scale. Enterprise companies might pay a premium for specialized AI or Management roles."
          delay={200}
        />
      </div>
    </div>
  );
}