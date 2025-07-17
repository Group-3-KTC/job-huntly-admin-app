import {
  Files,
  CheckCircle,
  Hourglass,
  XCircle
} from "@phosphor-icons/react";
import { mockReport } from "../mockApi/mockReport";
import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";

const ReportItem = () => {
  const totalReports = mockReport.length;
  const doneReports = mockReport.filter((r) => r.status === "Done").length;
  const processReports = mockReport.filter((r) => r.status === "Process").length;
  const cancelReports = mockReport.filter((r) => r.status === "Cancel").length;

  const statisticData: StatisticCardProps[] = [
    {
      label: "Total Reports",
      value: totalReports.toString(),
      icon: <Files size={24} />,
      change: {
        percentage: "8.5%",
        direction: "up",
        description: "Up from yesterday",
      },
      colorScheme: "blue",
    },
    {
      label: "Done Reports",
      value: doneReports.toString(),
      icon: <CheckCircle size={24} />,
      change: {
        percentage: "5.2%",
        direction: "up",
        description: "Up from last week",
      },
      colorScheme: "green",
    },
    {
      label: "Processing Reports",
      value: processReports.toString(),
      icon: <Hourglass size={24} />,
      change: {
        percentage: "2.1%",
        direction: "down",
        description: "Down from yesterday",
      },
      colorScheme: "orange",
    },
    {
      label: "Cancelled Reports",
      value: cancelReports.toString(),
      icon: <XCircle size={24} />,
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

export default ReportItem;