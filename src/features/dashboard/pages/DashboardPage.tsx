import {
  Briefcase,
  Buildings,
  ReadCvLogo,
  User,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { BuildingsIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";

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
    <div className="flex flex-wrap justify-between gap-4 px-4">
      {statisticData.map((item, index) => (
        <StatisCard key={index} {...item} />
      ))}
    </div>
  );
};

export default DashboardPage;
