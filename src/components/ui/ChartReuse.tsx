/* eslint-disable @typescript-eslint/no-explicit-any */
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

const chartComponents: Record<ChartType, React.ComponentType<any>> = {
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
  const data: ChartJSData<ChartType, number[], string> = {
    labels,
    datasets,
  };

  const options: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index", intersect: false },
    },
    ...(type === "bar" || type === "line"
      ? {
          scales: {
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
              position: "left" as const,
            },
          },
        }
      : {}),
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
