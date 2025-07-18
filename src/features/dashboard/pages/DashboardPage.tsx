import ChartUserGrowth from "../components/ChartUserGrowth";
import ChartApplications from "../components/ChartApplications";
import ChartReportedJobs from "../components/ChartReportedJobs";
import StatisticItem from "../components/StatisticItem";

const DashboardPage = () => {
  return (
    <div className="w-full px-2 md:px-6">
      <StatisticItem />

      <div className="mt-4 mb-6">
        <ChartUserGrowth />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 my-14">
        <ChartApplications />
        <ChartReportedJobs />
      </div>
    </div>
  );
};

export default DashboardPage;
