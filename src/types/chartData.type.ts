import type { Scriptable, Color } from "chart.js";
export type ChartDataset = {
  label: string;
  data: number[];
  borderColor?: Color | Scriptable<Color, String>;
  backgroundColor?: Color | Scriptable<Color, String>;
  tension?: number;
  stack?: string;
  pointHoverRadius?: number;
};

export type ChartData = {
  title: string;
  labels: string[];
  datasets: ChartDataset[];
};
