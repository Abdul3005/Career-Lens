import ChartCard from './ChartCard';

export default function JobTypeAnalysis() {
  return (
    <div className="space-y-6">
      <div data-aos="fade-up" className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Job Type Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">
          Compare the prevalence and compensation differences between Onsite and Remote working models.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          endpoint="/api/charts/jobtype-distribution"
          title="Onsite vs Remote Distribution"
          description="The proportion of onsite versus remote roles in the dataset. Remote roles have seen significant adoption, though onsite remains dominant for certain junior or hardware-dependent roles."
          delay={100}
        />
        <ChartCard
          endpoint="/api/charts/jobtype-by-role"
          title="Job Types Across Roles"
          description="Examines which roles are more likely to be remote. For example, FullStack and AI roles often have higher remote flexibility compared to IT Support and local Management."
          delay={200}
        />
      </div>
    </div>
  );
}
