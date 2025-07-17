import { useEffect, useMemo, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { JobPost } from "../mockApi/mockJob";
import { mockJob } from "../mockApi/mockJob";
import { PencilSimpleLine } from "phosphor-react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";

const JobListTable = () => {
  const [searchField, setSearchField] = useState<keyof JobPost>("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPost[]>([]);

  const pageSize = 5;

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setJobs(mockJob);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleFilter = (filters: Record<string, string | string[]>) => {
    const { sort, ...otherFilters } = filters;

    if (typeof sort === "string") {
      setSortOrder(sort === "Newest" ? "recent" : "oldest");
    }

    const filtered = mockJob.filter((job) => {
      return Object.entries(otherFilters).every(([key, value]) => {
        const jobValue = job[key as keyof JobPost];
        if (Array.isArray(value)) {
          return value.every((val) => (jobValue as string[]).includes(val));
        } else {
          return String(jobValue).includes(value);
        }
      });
    });

    setJobs(filtered);
    setCurrentPage(1);
  };

  const filterFields: FilterField[] = [
    {
      key: "workType",
      label: "Work Type",
      type: "select",
      options: ["On-site", "Remote", "Hybrid"],
    },
    {
      key: "majors",
      label: "Majors",
      type: "select",
      options: ["IT", "Marketing", "Sales", "HR"],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: ["Intern", "Fresher", "Middle", "Senior", "Associate"],
    },
    {
      key: "location_city",
      label: "City",
      type: "select",
      options: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Nha Trang"],
    },
    {
      key: "sort",
      label: "Sắp xếp",
      type: "select",
      options: ["Oldest", "Newest"],
    },
  ];

  const sortedAndFilteredData = useMemo(() => {
    let temp = [...jobs];

    if (sortOrder === "recent") {
      temp.sort((a, b) => b.id - a.id);
    } else if (sortOrder === "oldest") {
      temp.sort((a, b) => a.id - b.id);
    }

    const query = searchQuery.toLowerCase();
    return temp.filter((job) => {
      const fieldValue = String(job[searchField] ?? "").toLowerCase();
      return fieldValue.includes(query);
    });
  }, [searchQuery, searchField, sortOrder, jobs]);

  const total = sortedAndFilteredData.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredData.slice(start, start + pageSize);
  }, [sortedAndFilteredData, currentPage]);

  const columns: TableColumn<JobPost>[] = [
    { key: "id", title: "ID", width: "80px", align: "left" },
    { key: "company", title: "Company", align: "left" },
    { key: "title", title: "Title", align: "left" },
    {
      key: "datePost",
      title: "Date Post",
      align: "center",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "location_city",
      title: "City",
      align: "center",
      render: (value: string[]) => value.join(", "),
    },
    {
      key: "majors",
      title: "Majors",
      align: "center",
      render: (value: string[]) => value.join(", "),
    },
    {
      key: "expired_date",
      title: "Expired Date",
      align: "center",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedJob([record])}
            className="text-blue-500 hover:text-blue-700"
            title="Chi tiết"
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
        filters={filterFields}
        onFilterChange={handleFilter}
        onReset={() => {
          setJobs(mockJob);
          setSortOrder("desc");
        }}
      />

      <Table
        columns={columns}
        data={paginatedData}
        keyExtractor={(job) => job.id}
        loading={loading}
        emptyMessage="Không có công việc nào"
      />

      {selectedJob.length > 0 && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl border border-gray-300">
            <h2 className="text-lg font-semibold">Chi tiết công việc</h2>
            <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
              {Object.entries(selectedJob[0]).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong>{" "}
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedJob([])}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
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

export default JobListTable;
