// src/features/candidatelist/pages/CandidateListPage.tsx
import { useEffect, useState } from "react";
import { CandidateTable } from "../components/CandidateTable";
import { type Candidate, mockCandidates } from "../mock/mockCandidates";
import { FileXls, Plus } from "@phosphor-icons/react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";

export const CandidateListPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // filter state
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const candidateFilters: FilterField[] = [
    { key: "searchText", label: "Tìm tên/username", type: "text" },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: ["active", "blocked", "pending"],
    },
    {
      key: "sort",
      label: "Sắp xếp",
      type: "select",
      options: ["id", "asc", "desc", "recent"],
    },
  ];

  // filter + sort
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
      if (sortOrder === "id") return a.id - b.id;
      if (sortOrder === "recent") return b.id - a.id;
      return 0;
    });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAddCandidate = () => {
    alert("Add Candidate");
  };

  const handleExportExcel = () => {
    alert("Xuất Excel");
  };

  return (
    <>
      <div className="w-full p-6">
        {/* Bộ lọc dùng FilterBar */}
        <FilterBar
          filters={candidateFilters}
          initialValues={{
            searchText,
            status: statusFilter,
            sort: sortOrder,
          }}
          onFilterChange={(filters) => {
            setSearchText(filters.searchText || "");
            setStatusFilter(filters.status || "");
            setSortOrder(filters.sort || "");
            setPage(1);
          }}
          onReset={() => {
            setSearchText("");
            setStatusFilter("");
            setSortOrder("");
            setPage(1);
          }}
        />

        {/* Action buttons */}
        <div className="flex items-center justify-end my-6">
          <div className="flex gap-2">
            <button
              onClick={handleAddCandidate}
              className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              <Plus size={16} className="mr-2" /> Thêm Ứng Viên
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center px-4 py-2 bg-green-500 rounded hover:bg-gray-300"
            >
              <FileXls size={16} className="mr-2" /> Xuất Excel
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
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
    </>
  );
};
