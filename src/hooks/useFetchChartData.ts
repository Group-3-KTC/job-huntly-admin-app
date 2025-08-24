import { useEffect, useState } from "react";
import type { ChartData, ChartDataset } from "../types/chartData.type";

type RawChartData = {
  title: string;
  labels: string[];
  series: { name: string; values: number[] }[];
};

const useFetchChartData = (url: string, colors?: string[]) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((raw: RawChartData) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const datasets: ChartDataset[] = raw.series.map((s, i) => {
          let gradient: string | CanvasGradient = colors?.[i] ?? "#888";

          if (ctx && colors) {
            const g = ctx.createLinearGradient(0, 0, 0, 200);
            g.addColorStop(0, colors[i]);
            g.addColorStop(1, "transparent");
            gradient = g;
          }

          return {
            label: s.name,
            data: s.values,
            borderColor: gradient,
            backgroundColor: colors ? "transparent" : "#FCA5A5",
            tension: 0.4,
            pointHoverRadius: 7,
          };
        });

        setChartData({ title: raw.title, labels: raw.labels, datasets });
      })
      .catch((err) => console.error("Failed to fetch chart data:", err));
  }, [url, colors]);

  return chartData;
};

export default useFetchChartData;
