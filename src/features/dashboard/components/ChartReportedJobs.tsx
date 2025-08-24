import { useEffect, useState } from "react";
import type { ChartData, ChartDataset } from "../../../types/chartData.type";
import ChartReuse from "../../../components/ui/ChartReuse";

const ChartReportedJobs = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch("https://dummyjson.com/c/e42e-de5f-43a6-ad1c")
      .then((res) => res.json())
      .then(
        (raw: {
          title: string;
          labels: string[];
          series: { name: string; values: number[] }[];
        }) => {
          const datasets: ChartDataset[] = raw.series.map((s) => ({
            label: s.name,
            data: s.values,
            borderColor: "#EF4444",
            backgroundColor: "#FCA5A5",
            tension: 0.4,
          }));
          setChartData({ title: raw.title, labels: raw.labels, datasets });
        },
      );
  }, []);

  if (!chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="line" />;
};

export default ChartReportedJobs;
