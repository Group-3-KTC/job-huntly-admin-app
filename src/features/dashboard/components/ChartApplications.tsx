import ChartReuse from "../../../components/ui/ChartReuse";
import useFetchChartData from "../../../hooks/useFetchChartData";

const ChartApplications = () => {
  const { chartData, isLoading } = useFetchChartData(
    "https://dummyjson.com/c/42a5-abbe-4b45-8285",
    ["#3B82F6", "#93C5FD"],
  );

  if (isLoading || !chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="bar" />;
};

export default ChartApplications;
