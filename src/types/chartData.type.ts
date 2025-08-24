import type { ScriptableContext, Color } from "chart.js";

export type ChartDataset = {
  label: string;
  data: number[];
  borderColor?:
    | Color
    | ((
        ctx: ScriptableContext<"line" | "bar" | "pie" | "doughnut">,
      ) => Color | undefined);
  backgroundColor?:
    | Color
    | ((
        ctx: ScriptableContext<"line" | "bar" | "pie" | "doughnut">,
      ) => Color | undefined);
  tension?: number;
  stack?: string;
  pointHoverRadius?: number;
};

export type ChartData = {
  title: string;
  labels: string[];
  datasets: ChartDataset[];
};
