import type { Scriptable, Color } from "chart.js";
export type ChartDataset = {
  label: string;
  data: number[];
  borderColor?: Color | Scriptable<Color, any>;
  backgroundColor?: Color | Scriptable<Color, any>;
  tension?: number;
  stack?: string;
  pointHoverRadius?: number;
};

export type ChartData = {
  title: string;
  labels: string[];
  datasets: ChartDataset[];
};
