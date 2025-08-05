import ChartUserGrowth from "../components/ChartUserGrowth";
import ChartApplications from "../components/ChartApplications";
import ChartReportedJobs from "../components/ChartReportedJobs";
import StatisticItem from "../components/StatisticItem";

const DashboardPage = () => {
  return (
    <div className="w-full px-6">
      <StatisticItem />

      <div className="mt-4 mb-6">
        <ChartUserGrowth />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 my-6">
        <ChartApplications />
        <ChartReportedJobs />
      </div>
    </div>
  );
};

export default DashboardPage;
