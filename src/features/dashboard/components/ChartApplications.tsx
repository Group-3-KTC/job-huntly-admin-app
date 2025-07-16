import { useEffect, useState } from "react";
import type { ChartData } from "../../../types/chartData.type";
import ChartReuse from "../../../components/ui/ChartReuse";

const COLORS = ["#6366F1", "#EC4899", "#22D3EE"];

const ChartApplications = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch("https://dummyjson.com/c/e4cb-572c-4c1b-928f")
      .then((res) => res.json())
      .then((raw) => {
        const datasets = raw.series.map((s: any, i: number) => ({
          label: s.name,
          data: s.values,
          borderColor: COLORS[i],
          backgroundColor: COLORS[i],
          stack: "stack-1",
        }));

        setChartData({ title: raw.title, labels: raw.labels, datasets });
      });
  }, []);

  if (!chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="bar" stacked />;
};

export default ChartApplications;
