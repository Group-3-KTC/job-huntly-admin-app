import { Briefcase, Buildings, ReadCvLogo, User } from "@phosphor-icons/react";
import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";
import ChartUserGrowth from "../components/ChartUserGrowth";
import ChartApplications from "../components/ChartApplications";
import ChartReportedJobs from "../components/ChartReportedJobs";

const DashboardPage = () => {
  const statisticData: StatisticCardProps[] = [
    {
      label: "Total Users",
      value: "40,689",
      icon: <User />,
      change: {
        percentage: "8.5%",
        direction: "up",
        description: "Up from yesterday",
      },
      colorScheme: "green",
    },
    {
      label: "Total Companies",
      value: "10,293",
      icon: <Buildings />,
      change: {
        percentage: "1.3%",
        direction: "up",
        description: "Up from past week",
      },
      colorScheme: "orange",
    },
    {
      label: "Total CVs",
      value: "$89,000",
      icon: <ReadCvLogo />,
      change: {
        percentage: "4.3%",
        direction: "down",
        description: "Down from yesterday",
      },
      colorScheme: "blue",
    },
    {
      label: "Total Job Applications",
      value: "2,040",
      icon: <Briefcase />,
      change: {
        percentage: "1.8%",
        direction: "up",
        description: "Up from yesterday",
      },
      colorScheme: "orange",
    },
  ];

  return (
    <div className="w-full px-2 md:px-4">
      <h1 className="font-extrabold text-2xl my-4">DashBoard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statisticData.map((item, index) => (
          <StatisCard key={index} {...item} />
        ))}
      </div>
      {/* Chart */}
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
