import { Users, CheckCircle, Clock, Prohibit } from "@phosphor-icons/react";
import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";
import type { Recruiter } from "../types/recruiterTypes";
import { t } from "ttag";

interface Props {
  recruiters: Recruiter[];
}

const RecruiterStatistics = ({ recruiters }: Props) => {
  const totalRecruiters = recruiters.length;
  const activeRecruiters = recruiters.filter(
    (c) => c.status && c.status.toUpperCase() === "ACTIVE",
  ).length;
  const inactiveRecruiters = recruiters.filter(
    (c) => c.status && c.status.toUpperCase() === "INACTIVE",
  ).length;
  const bannedRecruiters = recruiters.filter(
    (c) => c.status && c.status.toUpperCase() === "BANNED",
  ).length;

  const statisticData: StatisticCardProps[] = [
    {
      label: t`Total Recruiters`,
      value: totalRecruiters.toString(),
      icon: <Users size={24} />,
      change: {
        percentage: "12.5%",
        direction: "up",
        description: "Increase from last week",
      },
      colorScheme: "blue",
    },
    {
      label: "Active Recruiters",
      value: activeRecruiters.toString(),
      icon: <CheckCircle size={24} />,
      change: {
        percentage: "8.2%",
        direction: "up",
        description: "Increase from last month",
      },
      colorScheme: "green",
    },
    {
      label: "Inactive Recruiters",
      value: inactiveRecruiters.toString(),
      icon: <Clock size={24} />,
      change: {
        percentage: "3.1%",
        direction: "down",
        description: "Decrease from yesterday",
      },
      colorScheme: "orange",
    },
    {
      label: "Banned Recruiters",
      value: bannedRecruiters.toString(),
      icon: <Prohibit size={24} />,
      change: {
        percentage: "1.5%",
        direction: "up",
        description: "Increase from last month",
      },
      colorScheme: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      {statisticData.map((item, index) => (
        <StatisCard key={index} {...item} />
      ))}
    </div>
  );
};

export default RecruiterStatistics; 