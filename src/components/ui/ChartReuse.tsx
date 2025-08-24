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
import type { ChartOptions, ChartData as ChartJSData } from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import type { ChartData } from "../../types/chartData.type";

// Register Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

type ChartType = "line" | "bar" | "pie" | "doughnut";

interface Props extends ChartData {
  type: ChartType;
  stacked?: boolean;
}

const chartComponents: Record<ChartType, React.ElementType> = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut,
};

const ChartReuse: React.FC<Props> = ({
  title,
  labels,
  datasets,
  type,
  stacked = false,
}) => {
  // Chart data
  const data: ChartJSData<any, number[], string> = {
    labels,
    datasets: datasets.map((d) => ({
      ...d,
      borderColor: d.borderColor,
      backgroundColor: d.backgroundColor,
      tension: d.tension,
      stack: d.stack,
      pointHoverRadius: d.pointHoverRadius,
    })),
  };

  // Chart options
  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index", intersect: false },
    },
    scales:
      type === "bar" || type === "line"
        ? {
            x: {
              grid: { display: false },
              stacked,
              ticks: { autoSkip: false },
              title: { display: true, text: "Time Period" },
            },
            y: {
              stacked,
              ticks: { stepSize: 100 },
              title: { display: true, text: "Value" },
              position: "left",
              padding: 10,
            },
          }
        : undefined,
  };

  const ChartComponent = chartComponents[type];

  return (
    <div className="w-full max-w-full p-4 pb-12 bg-white shadow-md rounded-xl h-[420px]">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
      <div className="h-full">
        <ChartComponent data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartReuse;
