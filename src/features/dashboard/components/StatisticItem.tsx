import { Briefcase, Buildings, ReadCvLogo, User } from "@phosphor-icons/react";
import type { StatisticCardProps } from "../../../types/statistics.type";
import { mockCandidates } from "../../candidatelist/mock/mockCandidates";
import { mockCompany } from "../../companylist/mockApi/mockCompany";
import { mockReport } from "../../reportlist/mockApi/mockReport";
import { mockJob } from "../../jobpostlist/mockApi/mockJob";
import StatisCard from "../../../components/ui/StatisticCard";


const statisticData: StatisticCardProps[] = [
  {
    label: "Total Candidates",
    value: mockCandidates.length.toLocaleString(),
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
    value: mockCompany.length.toLocaleString(),
    icon: <Buildings />,
    change: {
      percentage: "1.3%",
      direction: "up",
      description: "Up from past week",
    },
    colorScheme: "orange",
  },
  {
    label: "Total Reports",
    value: mockReport.length.toLocaleString(),
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
    value: mockJob.length.toLocaleString(),
    icon: <Briefcase />,
    change: {
      percentage: "1.8%",
      direction: "up",
      description: "Up from yesterday",
    },
    colorScheme: "orange",
  },
];

// ✅ Trả component thống kê
export default function StatisticItem() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statisticData.map((item, index) => (
        <StatisCard key={index} {...item} />
      ))}
    </section>
  );
}
