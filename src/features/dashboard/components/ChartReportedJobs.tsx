import ChartReuse from "../../../components/ui/ChartReuse";
import useFetchChartData from "../../../hooks/useFetchChartData";

const ChartReportedJobs = () => {
  const { chartData, isLoading } = useFetchChartData(
    "https://dummyjson.com/c/e42e-de5f-43a6-ad1c",
    ["#EF4444", "#FCA5A5"],
  );

  if (isLoading || !chartData) return <p>Loading...</p>;
  return <ChartReuse {...chartData} type="line" />;
};

export default ChartReportedJobs;
