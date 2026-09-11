import ChartCard from './ChartCard';

export default function RegressionResults() {
  return (
    <div className="space-y-6">
      <div data-aos="fade-up" className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Statistical Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">
          Insights derived from our machine learning regression models and dataset distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          endpoint="/api/charts/salary-distribution"
          title="Salary Normal Distribution"
          description="A histogram showing the frequency of different salary ranges in our dataset. It illustrates the density of average salaries versus outliers (extremely high or low packages)."
          delay={100}
        />
        <ChartCard
          endpoint="/api/charts/skill-salary-heatmap"
          title="Skill vs Salary Correlation Heatmap"
          description="A correlation matrix showing how strongly specific skills correlate with higher salaries. Darker or more intense colors indicate skills that significantly boost earning potential."
          delay={200}
        />
      </div>
    </div>
  );
}