import ChartReuse from "../../../components/ui/ChartReuse";
import useFetchChartData from "../../../hooks/useFetchChartData";

const ChartUserGrowth = () => {
  const { chartData, isLoading } = useFetchChartData(
    "https://dummyjson.com/c/07be-8b55-434e-8dad",
    ["#3B82F6", "#F97316"],
  );

  if (isLoading || !chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="line" />;
};

export default ChartUserGrowth;
