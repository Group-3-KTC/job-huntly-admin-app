import { useEffect, useState } from "react";
import type { ChartData, ChartDataset } from "../types/chartData.type";

type RawChartData = {
  title: string;
  labels: string[];
  series: { name: string; values: number[] }[];
};

// Cache lưu trữ kết quả fetch
const apiCache = new Map<string, { data: ChartData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

const useFetchChartData = (url: string, colors?: string[]) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Kiểm tra xem có dữ liệu trong cache không và cache còn mới
      const cachedData = apiCache.get(url);
      const now = Date.now();
      
      if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
        console.log('Using cached chart data for:', url);
        setChartData(cachedData.data);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching chart data from API:', url);
        const response = await fetch(url);
        const raw: RawChartData = await response.json();
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const datasets: ChartDataset[] = raw.series.map((s, i) => {
          let gradient: string | CanvasGradient = colors?.[i] ?? "#888";

          if (ctx && colors) {
            const g = ctx.createLinearGradient(0, 0, 0, 200);
            g.addColorStop(0, colors[i]);
            g.addColorStop(1, "transparent");
            gradient = g;
          }

          return {
            label: s.name,
            data: s.values,
            borderColor: gradient,
            backgroundColor: colors ? "transparent" : "#FCA5A5",
            tension: 0.4,
            pointHoverRadius: 7,
          };
        });

        const chartDataResult = { 
          title: raw.title, 
          labels: raw.labels, 
          datasets 
        };
        
        // Lưu kết quả vào cache
        apiCache.set(url, {
          data: chartDataResult,
          timestamp: now
        });
        
        setChartData(chartDataResult);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Cleanup function nếu component unmounted trước khi fetch hoàn tất
    return () => {
      // Không cần làm gì nếu đang sử dụng fetch API thông thường
    };
  }, [url, colors]);

  return { chartData, isLoading };
};

export default useFetchChartData;
