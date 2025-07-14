export interface StatisticCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    percentage: string;
    direction: "up" | "down";
    description: string;
  };
  colorScheme?: "green" | "red" | "orange" | "blue";
}
