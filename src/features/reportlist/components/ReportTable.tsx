import { useEffect, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Reports } from "../mockApi/mockReport";
import { mockReport } from "../mockApi/mockReport";
import { Trash, PencilSimpleLine } from "phosphor-react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";

const ReportTable = () => {
  const [searchField] = useState("reportType");
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReport, setSelectedReport] = useState<Reports | null>(null);
  const [updatedStatus, setUpdatedStatus] =
    useState<Reports["status"]>("Process");
  const [data, setData] = useState<Reports[]>(mockReport);
  const [showDetail, setShowDetail] = useState(false);
  const pageSize = 5;

  const uniqueReportTypes = [...new Set(mockReport.map((r) => r.reportType))];
  const uniqueStatuses = [...new Set(mockReport.map((r) => r.status))];

  useEffect(() => {
  setLoading(true);
  const timeout = setTimeout(() => {
    setData(mockReport);
    setLoading(false);
  }, 2000); // 2 giây

  return () => clearTimeout(timeout);
}, []);

  const filters: FilterField[] = [
    {
      key: "reportType",
      label: "Report Type",
      type: "select",
      options: uniqueReportTypes,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: uniqueStatuses,
    },
    {
      key: "sortOrder",
      label: "Sort",
      type: "select",
      options: ["Oldest", "Newest"],
    },
  ];

  const handleFilterChange = (filterValues: Record<string, any>) => {
    let filtered = [...mockReport];

    if (filterValues.reportType) {
      filtered = filtered.filter(
        (r) => r.reportType === filterValues.reportType
      );
    }

    if (filterValues.status) {
      filtered = filtered.filter((r) => r.status === filterValues.status);
    }

    if (filterValues.sortOrder) {
      setSortOrder(filterValues.sortOrder);
    }

    setData(filtered);
  };

  useEffect(() => {
    setData((prev) => {
      const sorted = [...prev];
      if (sortOrder === "asc") {
        sorted.sort((a, b) => a.id - b.id);
      } else {
        sorted.sort((a, b) => b.id - a.id);
      }
      return sorted;
    });
  }, [sortOrder]);

  const filteredData = data.filter((report) => {
    const fieldValue = String(
      report[searchField as keyof Reports]
    ).toLowerCase();
    return fieldValue.includes(searchQuery.toLowerCase());
  });

  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusStyle = {
    Done: "bg-green-100 text-green-700",
    Process: "bg-yellow-100 text-yellow-700",
    Cancel: "bg-red-100 text-red-700",
  } as const;

  const handleUpdate = (report: Reports) => {
    setShowDetail(false);
    setSelectedReport(report);
    setUpdatedStatus(report.status);
  };

  const confirmUpdate = () => {
    if (selectedReport) {
      setData((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id ? { ...r, status: updatedStatus } : r
        )
      );
      setSelectedReport(null);
    }
  };

  const columns: TableColumn<Reports>[] = [
    {
      key: "id",
      title: "ID",
      width: "80px",
      align: "left",
    },
    {
      key: "reportType",
      title: "Report Type",
      align: "left",
    },
    {
      key: "description",
      title: "Description",
      align: "left",
    },
    {
      key: "userId",
      title: "User ID",
      align: "center",
    },
    {
      key: "reportedContentId",
      title: "Content Report ID",
      align: "center",
    },
    {
      key: "createAt",
      title: "Created At",
      align: "center",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: (value: Reports["status"]) => (
        <span
          className={`px-2 py-1 text-xs rounded font-medium ${statusStyle[value]}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (_: any, record: Reports) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => alert(`Xóa báo cáo ID: ${record.id}`)}
            className="text-red-500 hover:text-red-700"
            title="Xóa"
          >
            <Trash size={20} />
          </button>
          <button
            onClick={() => handleUpdate(record)}
            className="text-blue-500 hover:text-blue-700"
            title="Cập nhật"
          >
            <PencilSimpleLine size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 max-w-full mt-2">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => {
          setData(mockReport);
          setSortOrder("desc");
        }}
      />

      <Table
        columns={columns}
        data={paginatedData}
        keyExtractor={(report) => report.id}
        loading={loading}
        emptyMessage="Không có báo cáo nào"
      />

      {selectedReport && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          {/* Popup chính */}
          <div className="relative bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl border border-gray-300">
            <h2 className="text-lg font-semibold">
              Cập nhật trạng thái báo cáo
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>ID:</strong> {selectedReport.id}
              </div>
              <div>
                <strong>Report Type:</strong> {selectedReport.reportType}
              </div>
              <div>
                <strong>Description:</strong> {selectedReport.description}
              </div>
              <div>
                <strong>User ID:</strong> {selectedReport.userId}
              </div>
              <div className="flex items-center gap-2">
                <strong>Content Report ID:</strong>{" "}
                {selectedReport.reportedContentId}
                <button
                  onClick={() => setShowDetail(true)}
                  className="text-blue-500 underline text-sm hover:text-blue-700"
                >
                  Show
                </button>
              </div>
              <div>
                <label className="font-semibold">Status:</label>
                <select
                  value={updatedStatus}
                  onChange={(e) =>
                    setUpdatedStatus(e.target.value as Reports["status"])
                  }
                  className="ml-2 border px-2 py-1 rounded"
                >
                  <option value="Process">Process</option>
                  <option value="Done">Done</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Quay lại
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xác nhận
              </button>
            </div>

            {/* Popup phụ */}
            {showDetail && (
              <div className="absolute top-0 right-[-320px] w-72 bg-white border shadow-lg rounded-xl p-4">
                <h1 className="text-lg font-bold">Detail...</h1>
              </div>
            )}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="text-sm text-gray-500">
            Hiển thị {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, total)} trên {total} báo cáo
          </div>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &lt;
            </button>
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let startPage = Math.max(
                1,
                currentPage - Math.floor(maxVisible / 2)
              );
              let endPage = Math.min(totalPages, startPage + maxVisible - 1);
              if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }
              if (startPage > 1) {
                pages.push(
                  <button
                    key="first"
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    1
                  </button>
                );
                if (startPage > 2)
                  pages.push(
                    <span key="dots1" className="px-3 py-1">
                      ...
                    </span>
                  );
              }
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              if (endPage < totalPages) {
                if (endPage < totalPages - 1)
                  pages.push(
                    <span key="dots2" className="px-3 py-1">
                      ...
                    </span>
                  );
                pages.push(
                  <button
                    key="last"
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                );
              }
              return pages;
            })()}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
