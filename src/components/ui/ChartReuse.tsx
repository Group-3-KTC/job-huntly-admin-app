import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import type { ChartData } from "../../types/chartData.type";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type Props = ChartData & {
  type: "line" | "bar" | "pie" | "doughnut";
  stacked?: boolean;
};

const ChartReuse: React.FC<Props> = ({
  title,
  labels,
  datasets,
  type,
  stacked = false,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales:
      type === "bar" || type === "line"
        ? {
            x: {
              grid: { display: false },
              stacked,
              ticks: { autoSkip: false },
            },
            y: {
              stacked,
              ticks: { stepSize: 10 },
            },
          }
        : undefined,
  };

  const data = { labels, datasets };

  const renderChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      default:
        return <p>Invalid chart type</p>;
    }
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-xl h-[380px]">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
      <div className="h-full">{renderChart()}</div>
    </div>
  );
};

export default ChartReuse;
