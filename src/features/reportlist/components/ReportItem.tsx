import { useEffect, useState } from "react";
import { Files, CheckCircle, Hourglass, XCircle } from "@phosphor-icons/react";
import type { StatisticCardProps } from "../../../types/statistics.type";
import StatisCard from "../../../components/ui/StatisticCard";
import { t } from "ttag";
import { getReportStats } from "../services/reportService";

const ReportItem = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    process: 0,
    rejected: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const s = await getReportStats();
        setStats(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statisticData: StatisticCardProps[] = [
    {
      label: t`Total Reports`,
      value: loading ? "…" : stats.total.toString(),
      icon: <Files size={24} />,
      change: { percentage: "8.5%", direction: "up", description: t`Up from yesterday` },
      colorScheme: "blue",
    },
    {
      label: t`Done Reports`,
      value: loading ? "…" : stats.done.toString(),
      icon: <CheckCircle size={24} />,
      change: { percentage: "5.2%", direction: "up", description: t`Up from last week` },
      colorScheme: "green",
    },
    {
      label: t`Processing Reports`,
      value: loading ? "…" : stats.process.toString(),
      icon: <Hourglass size={24} />,
      change: { percentage: "2.1%", direction: "down", description: t`Down from yesterday` },
      colorScheme: "orange",
    },
    {
      label: t`Rejected Reports`,
      value: loading ? "…" : stats.rejected.toString(),
      icon: <XCircle size={24} />,
      change: { percentage: "1.3%", direction: "down", description: t`Down from last month` },
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
