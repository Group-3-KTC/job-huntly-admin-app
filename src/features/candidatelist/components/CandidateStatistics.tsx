import { Users, CheckCircle, Clock, Prohibit } from "@phosphor-icons/react";
import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";
import type { Candidate } from "../types/candidateTypes";
import { t } from "ttag";

interface Props {
  candidates: Candidate[];
}

const CandidateStatistics = ({ candidates }: Props) => {
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(
    (c) => c.status && c.status.toUpperCase() === "ACTIVE",
  ).length;
  const inactiveCandidates = candidates.filter(
    (c) => c.status && c.status.toUpperCase() === "INACTIVE",
  ).length;
  const bannedCandidates = candidates.filter(
    (c) => c.status && c.status.toUpperCase() === "BANNED",
  ).length;

  const statisticData: StatisticCardProps[] = [
    {
      label: t`Total Candidates`,
      value: totalCandidates.toString(),
      icon: <Users size={24} />,
      change: {
        percentage: "12.5%",
        direction: "up",
        description: t`Up from last week`,
      },
      colorScheme: "blue",
    },
    {
      label: t`Active Candidates`,
      value: activeCandidates.toString(),
      icon: <CheckCircle size={24} />,
      change: {
        percentage: "8.2%",
        direction: "up",
        description: t`Up from last month`,
      },
      colorScheme: "green",
    },
    {
      label: t`Inactive Candidates`,
      value: inactiveCandidates.toString(),
      icon: <Clock size={24} />,
      change: {
        percentage: "3.1%",
        direction: "down",
        description: t`Down from yesterday`,
      },
      colorScheme: "orange",
    },
    {
      label: t`Banned Candidates`,
      value: bannedCandidates.toString(),
      icon: <Prohibit size={24} />,
      change: {
        percentage: "1.5%",
        direction: "up",
        description: t`Up from last month`,
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

export default CandidateStatistics;
