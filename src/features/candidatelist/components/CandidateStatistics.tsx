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
    (c) => c.status === "active",
  ).length;
  const pendingCandidates = candidates.filter(
    (c) => c.status === "pending",
  ).length;
  const blockedCandidates = candidates.filter(
    (c) => c.status === "blocked",
  ).length;

  const statisticData: StatisticCardProps[] = [
    {
      label: t`Total Candidates`,
      value: totalCandidates.toString(),
      icon: <Users size={24} />,
      change: {
        percentage: "12.5%",
        direction: "up",
        description: "Increase from last week",
      },
      colorScheme: "blue",
    },
    {
      label: "Active Candidates",
      value: activeCandidates.toString(),
      icon: <CheckCircle size={24} />,
      change: {
        percentage: "8.2%",
        direction: "up",
        description: "Increase from last month",
      },
      colorScheme: "green",
    },
    {
      label: "Pending Candidates",
      value: pendingCandidates.toString(),
      icon: <Clock size={24} />,
      change: {
        percentage: "3.1%",
        direction: "down",
        description: "Decrease from yesterday",
      },
      colorScheme: "orange",
    },
    {
      label: "Blocked Candidates",
      value: blockedCandidates.toString(),
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

export default CandidateStatistics;
