// src/features/candidatelist/pages/CandidateListPage.tsx
import { useEffect, useState } from "react";
import { CandidateTable } from "../components/CandidateTable";
import { type Candidate, mockCandidates } from "../mock/mockCandidates";
import { FileXls, Plus } from "@phosphor-icons/react";

export const CandidateListPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/Search/Sort state
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    // Giả lập gọi API mất 2 giây
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filtered = candidates
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.username.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? c.status === statusFilter : true;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      if (sortOrder === "desc") return b.name.localeCompare(a.name);
      if (sortOrder === "id") return parseInt(a.id) - parseInt(b.id);
      if (sortOrder === "recent") return parseInt(b.id) - parseInt(a.id);
      return 0;
    });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAddCandidate = () => {
    alert("Add Candidate");
  };

  const handleExportExcel = () => {
    alert("Xuat excel");
  };

  return (
    <>
      <div className="p-6 bg-black">
        <h1 className="text-2xl font-semibold text-white">
          Welcome to the Candidate List
        </h1>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-6 justify-end">
          <div className="flex gap-2 ">
            <button
              onClick={handleAddCandidate}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={16} className="mr-2" /> Thêm Ứng Viên
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center bg-green-500 px-4 py-2 rounded hover:bg-gray-300"
            >
              <FileXls size={16} className="mr-2" /> Xuất Excel
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc username"
              className="border border-gray-300 px-4 py-2 rounded"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 px-4 py-2 rounded"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Đã khóa</option>
              <option value="pending">Chờ xác nhận</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 px-4 py-2 rounded"
            >
              <option value="">Sắp xếp</option>
              <option value="id">ID tăng dần</option>
              <option value="asc">Tên A-Z</option>
              <option value="desc">Tên Z-A</option>
              <option value="recent">Mới nhất</option>
            </select>
            <button
              onClick={() => {
                setSearchText("");
                setStatusFilter("");
                setSortOrder("");
                setPage(1);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đặt lại
            </button>
          </div>

          {/* This CandidateTable component now uses the generic Table component internally */}
          <CandidateTable
            candidates={paginated}
            loading={loading}
            pagination={{
              page,
              pageSize,
              total: filtered.length,
              onPageChange: setPage,
            }}
          />
        </div>
      </div>
    </>
  );
};
