import { useState } from "react";
import { mockReport } from "../mockApi/mockReport";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import { SortAscending, SortDescending } from "@phosphor-icons/react";
import type { Reports } from "../mockApi/mockReport";

const ReportFilter = () => {
  const [filteredReports, setFilteredReports] = useState<Reports[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Lấy danh sách duy nhất từ reportType và status
  const reportTypes = [...new Set(mockReport.map((r) => r.reportType))];
  const statuses = [...new Set(mockReport.map((r) => r.status))];

  const filters: FilterField[] = [
    {
      key: "reportType",
      label: "Loại báo cáo",
      type: "select",
      options: reportTypes,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: statuses,
    },
  ];

  const handleFilterChange = (filterValues: Record<string, any>) => {
    let results = [...mockReport];

    if (filterValues.reportType) {
      results = results.filter((r) => r.reportType === filterValues.reportType);
    }

    if (filterValues.status) {
      results = results.filter((r) => r.status === filterValues.status);
    }

    results.sort((a, b) =>
      sortDirection === "asc" ? a.id - b.id : b.id - a.id
    );

    setFilteredReports(results);
  };

  const toggleSort = () => {
    const newSort = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newSort);

    // Áp dụng sắp xếp lại với filter hiện tại
    handleFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          {sortDirection === "asc" ? (
            <>
              <SortAscending size={18} /> ID tăng dần
            </>
          ) : (
            <>
              <SortDescending size={18} /> ID giảm dần
            </>
          )}
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => {
          setFilteredReports([]);
        }}
      />

      {/* Hiển thị kết quả sau lọc */}
      <div className="bg-white border rounded p-4">
        {filteredReports.length === 0 ? (
          <p className="text-gray-500 italic">Không có dữ liệu phù hợp.</p>
        ) : (
          <ul className="space-y-2">
            {filteredReports.map((report) => (
              <li
                key={report.id}
                className="p-3 border rounded hover:bg-gray-50 transition"
              >
                <strong>ID:</strong> {report.id} — <strong>Loại:</strong> {report.reportType} —{" "}
                <strong>Trạng thái:</strong> {report.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReportFilter;