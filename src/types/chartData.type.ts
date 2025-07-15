export type ChartDataset = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  stack?: string;
};

export type ChartData = {
  title: string;
  labels: string[];
  datasets: ChartDataset[];
};
