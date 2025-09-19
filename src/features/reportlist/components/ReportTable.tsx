import { useEffect, useMemo, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination";
import type { Reports as Report } from "../mock/mockReport"; // (tạm) hoặc thay bằng type Report từ service
import { Trash, PencilSimpleLine } from "phosphor-react";
import { FilterBar, type FilterField } from "../../../components/common/FilterBar";
import {
  getReports,
  updateReportStatus,
  deleteReport,
  type ReportStatus,
} from "../services/reportService";

const ReportTable = () => {
  // --- state UI
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // --- filter từ FilterBar
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // --- data
  const [data, setData] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / itemsPerPage)), [total, itemsPerPage]);

  // --- modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<ReportStatus>("PROCESS");
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  // filter options: nếu cần bạn có thể fetch từ API; tạm thời lấy uniq từ data hiện tại
  const uniqueReportTypes = useMemo(() => Array.from(new Set(data.map(r => r.reportType))), [data]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(data.map(r => r.status))), [data]);

  const filters: FilterField[] = [
    { key: "reportType", label: "Report Type", type: "select", options: uniqueReportTypes },
    { key: "status", label: "Status", type: "select", options: uniqueStatuses },
    { key: "sortOrder", label: "Sort", type: "select", options: ["Oldest", "Newest"] },
  ];

  const loadPage = async () => {
    setLoading(true);
    try {
      const pageResp = await getReports({
        type: filterType || undefined,
        status: filterStatus || undefined,
        page: currentPage,
        size: itemsPerPage,
        sort: sortOrder,
      });
      setData(pageResp.content as unknown as Report[]);
      setTotal(pageResp.totalElements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // load khi đổi filter/pagination/sort
  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterStatus, currentPage, itemsPerPage, sortOrder]);

  const handleFilterChange = (filterValues: Record<string, string>) => {
    setFilterType(filterValues.reportType || "");
    setFilterStatus(filterValues.status || "");
    if (filterValues.sortOrder) {
      setSortOrder(filterValues.sortOrder === "Oldest" ? "asc" : "desc");
    }
    setCurrentPage(1);
  };

  const handleUpdate = (report: Report) => {
    setSelectedReport(report);
    setUpdatedStatus(report.status as ReportStatus);
  };

  const confirmUpdate = async () => {
    if (!selectedReport) return;
    try {
      // gọi API
      const updated = await updateReportStatus(selectedReport.id, updatedStatus);
      // optimistic update
      setData(prev => prev.map(r => (r.id === selectedReport.id ? { ...r, status: updated.status as any } : r)));
      setSelectedReport(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleItemsPerPageChange = (n: number) => {
    setItemsPerPage(n);
    setCurrentPage(1);
  };

  const columns: TableColumn<Report>[] = [
    { key: "id", title: "ID", width: "80px", align: "left" },
    { key: "reportType", title: "Report Type", align: "left" },
    { key: "description", title: "Description", align: "left" },
    { key: "userId", title: "User ID", align: "center" },
    { key: "reportedContentId", title: "Content Report ID", align: "center" },
    { key: "createdAt", title: "Created At", align: "center", render: (v) => new Date(v as string).toLocaleString() },
    { key: "status", title: "Status", align: "center", render: (v: any) => (
        <span className={`px-2 py-1 text-xs rounded font-medium ${
          v === "DONE" ? "bg-green-100 text-green-700" :
          v === "PROCESS" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>{v}</span>
      )},
    {
      key: "actions", title: "Actions", align: "center", render: (_: string, record: Report) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setReportToDelete(record)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
            title="Delete"
          >
            <Trash size={20} />
          </button>
          <button
            onClick={() => handleUpdate(record)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="Update"
          >
            <PencilSimpleLine size={20} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-full mt-2">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => {
          setFilterType("");
          setFilterStatus("");
          setSortOrder("desc");
          setCurrentPage(1);
        }}
      />

      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        loading={loading}
        emptyMessage="Không có báo cáo nào"
      />

      {!loading && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
        />
      )}

      {/* Modal Update */}
      {selectedReport && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl border border-gray-300">
            <h2 className="text-lg font-semibold">Cập nhật trạng thái báo cáo</h2>
            <div className="space-y-2 text-sm">
              <div><strong>ID:</strong> {selectedReport.id}</div>
              <div><strong>Report Type:</strong> {selectedReport.reportType}</div>
              <div><strong>Description:</strong> {selectedReport.description}</div>
              <div><strong>User ID:</strong> {selectedReport.userId}</div>
              <div>
                <label className="font-semibold">Status:</label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value as ReportStatus)}
                  className="ml-2 border px-2 py-1 rounded"
                >
                  <option value="PROCESS">Process</option>
                  <option value="DONE">Done</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Quay lại</button>
              <button onClick={confirmUpdate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4 shadow-2xl border border-gray-300">
            <h2 className="text-lg font-semibold text-red-600">Xác nhận xóa</h2>
            <p>Bạn có chắc muốn xóa báo cáo này không?</p>
            <div className="space-y-1 text-sm">
              <div><strong>ID:</strong> {reportToDelete.id}</div>
              <div><strong>Report Type:</strong> {reportToDelete.reportType}</div>
              <div><strong>Description:</strong> {reportToDelete.description}</div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setReportToDelete(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Quay lại</button>
              <button
                onClick={async () => {
                  try {
                    await deleteReport(reportToDelete.id);
                    // optimistic remove
                    setData(prev => prev.filter(r => r.id !== reportToDelete.id));
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setReportToDelete(null);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
