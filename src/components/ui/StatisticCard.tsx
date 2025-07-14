import React from "react";
import type { StatisticCardProps } from "../../types/statistics.type";
import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react";

const colorMap = {
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-500",
  blue: "bg-blue-100 text-blue-800"
};

const StatisCard: React.FC<StatisticCardProps> = ({
  label,
  value,
  icon,
  change,
  colorScheme = "green",
}) => {
  return (
    <div className="w-full sm:w-[48%] md:w-[24%] bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`rounded-full p-2 text-xl ${colorMap[colorScheme]}`}>
          {icon}
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-800">{value}</div>

      {change && (
        <div
          className={`flex items-center gap-1 text-sm ${
            change.direction === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {change.direction === "up" ? (
            <TrendUpIcon className="w-4 h-4" />
          ) : (
            <TrendDownIcon className="w-4 h-4" />
          )}
          <span>{change.percentage}</span>
          <span className="text-gray-500">{change.description}</span>
        </div>
      )}
    </div>
  );
};

export default StatisCard;
