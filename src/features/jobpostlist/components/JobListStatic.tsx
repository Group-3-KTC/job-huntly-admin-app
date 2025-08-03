import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";
import { mockJob } from "../mock/mockJob";
import { Files, City } from "@phosphor-icons/react";

const JobListStatic = () => {
  const totalJob = mockJob.length;
  const HCMJob = mockJob.filter((r) =>
    r.location_city.includes("Thành phố Hồ Chí Minh")
  ).length;
  const HNJob = mockJob.filter((r) =>
    r.location_city.includes("Thành phố Hà Nội")
  ).length;
  const DNJob = mockJob.filter((r) =>
    r.location_city.includes("Đà Nẵng")
  ).length;

  const statisticData: StatisticCardProps[] = [
    {
      label: "Total Jobs",
      value: totalJob.toString(),
      icon: <Files size={24} />,
      change: {
        percentage: "8.5%",
        direction: "up",
        description: "Up from yesterday",
      },
      colorScheme: "blue",
    },
    {
      label: "Hồ Chí Minh Jobs",
      value: HCMJob.toString(),
      icon: <City size={24} />,
      change: {
        percentage: "5.2%",
        direction: "up",
        description: "Up from last week",
      },
      colorScheme: "green",
    },
    {
      label: "Hà nội Jobs",
      value: HNJob.toString(),
      icon: <City size={24} />,
      change: {
        percentage: "2.1%",
        direction: "down",
        description: "Down from yesterday",
      },
      colorScheme: "orange",
    },
    {
      label: "Đà Nẵng Jobs",
      value: DNJob.toString(),
      icon: <City size={24} />,
      change: {
        percentage: "1.3%",
        direction: "down",
        description: "Down from last month",
      },
      colorScheme: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statisticData.map((item, index) => (
        <StatisCard key={index} {...item} />
      ))}
    </div>
  );
};

export default JobListStatic;
