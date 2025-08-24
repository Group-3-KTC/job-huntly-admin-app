import { useEffect, useState } from "react";
import type { ChartData, ChartDataset } from "../../../types/chartData.type";
import ChartReuse from "../../../components/ui/ChartReuse";

const COLORS = ["#3B82F6", "#F97316"];

const ChartUserGrowth = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch("https://dummyjson.com/c/07be-8b55-434e-8dad")
      .then((res) => res.json())
      .then(
        (raw: {
          title: string;
          labels: string[];
          series: { name: string; values: number[] }[];
        }) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const datasets: ChartDataset[] = raw.series.map((s, i) => {
            let gradient: string | CanvasGradient = COLORS[i];
            if (ctx) {
              gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, COLORS[i]);
              gradient.addColorStop(1, "transparent");
            }

            return {
              label: s.name,
              data: s.values,
              borderColor: gradient,
              backgroundColor: "transparent",
              pointHoverRadius: 7,
            };
          });

          setChartData({ title: raw.title, labels: raw.labels, datasets });
        },
      );
  }, []);

  if (!chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="line" />;
};

export default ChartUserGrowth;
