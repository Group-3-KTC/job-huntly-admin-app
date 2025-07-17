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
  const [page, setPage] = useState(1);
  const pageSize = 5;
  // filter state
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    searchText: "",
    status: "",
    sort: "",
    skills: [],
    location_city: [],
    created_from: "",
    created_to: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const candidateFilters: FilterField[] = [
    {
      key: "searchText",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tìm theo tên hoặc username",
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: ["active", "blocked", "pending"],
      placeholder: "Chọn trạng thái",
    },
    {
      key: "skills",
      label: "Kỹ năng",
      type: "multiselect",
      options: ["Java", "Python", "React", "SQL"],
      placeholder: "Chọn kỹ năng",
    },
    {
      key: "location_city",
      label: "Thành phố",
      type: "multiselect",
      options: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Nha Trang"],
      placeholder: "Chọn thành phố",
    },
    {
      key: "created_from",
      label: "Ngày tạo",
      type: "date",
      placeholder: "Từ ngày",
      prefixLabel: "Từ:",
    },
    {
      key: "created_to",
      label: "Ngày tạo",
      type: "date",
      placeholder: "Đến ngày",
      prefixLabel: "Đến:",
    },
    {
      key: "sort",
      label: "Sắp xếp",
      type: "select",
      options: ["id", "asc", "desc", "recent"],
      placeholder: "Chọn cách sắp xếp",
    },
  ];

  // filter + sort
  const filtered = candidates
    .filter((c) => {
      const { searchText, status, skills, location_city } = filterValues;
      const matchSearch =
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.username.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = status ? c.status === status : true;

      const matchSkills = skills.length
        ? skills.every((s: string) => c.skills?.includes(s))
        : true;

      const matchLocation = location_city.length
        ? location_city.includes(c.location_city)
        : true;

      return matchSearch && matchStatus && matchSkills && matchLocation;
    })
    .sort((a, b) => {
      const sort = filterValues.sort;
      if (sort === "asc") return a.name.localeCompare(b.name);
      if (sort === "desc") return b.name.localeCompare(a.name);
      if (sort === "id") return a.id - b.id;
      if (sort === "recent") return b.id - a.id;
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
        <h1 className="font-extrabold text-2xl mb-4">Candidate List</h1>

        <FilterBar
          filters={candidateFilters}
          initialValues={filterValues}
          onFilterChange={(filters) => {
            setFilterValues(filters);
            setPage(1); // reset về trang đầu khi filter
          }}
          onReset={() => {
            const reset = {
              searchText: "",
              status: "",
              sort: "",
              skills: [],
              location_city: [],
              created_from: "",
              created_to: "",
            };
            setFilterValues(reset);
            setPage(1);
          }}
        />

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
