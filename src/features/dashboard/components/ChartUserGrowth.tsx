import { useEffect, useState } from "react";
import type { ChartData } from "../../../types/chartData.type";
import ChartReuse from "../../../components/ui/ChartReuse";

const COLORS = ["#3B82F6", "#F97316"]; // Giữ màu gốc nhưng sẽ thêm gradient

const ChartUserGrowth = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch("https://dummyjson.com/c/07be-8b55-434e-8dad")
      .then((res) => res.json())
      .then((raw) => {
        const datasets = raw.series.map((s: any, i: number) => ({
          label: s.name,
          data: s.values,
          borderColor: (context: any) => {
            const gradient = context.chart.ctx.createLinearGradient(
              0,
              0,
              0,
              200,
            );
            gradient.addColorStop(0, COLORS[i]);
            return gradient;
          },
          backgroundColor: "transparent", // Loại bỏ nền để tập trung vào đường
          pointHoverRadius: 7, // Điểm khi hover lớn hơn
        }));

        setChartData({ title: raw.title, labels: raw.labels, datasets });
      });
  }, []);

  if (!chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="line" />;
};

export default ChartUserGrowth;
