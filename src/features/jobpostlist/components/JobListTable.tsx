import { useMemo, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { JobPost } from "../mockApi/mockJob";
import { mockJob } from "../mockApi/mockJob";
import { PencilSimpleLine } from "phosphor-react";

const JobListTable = () => {
  const [searchField, setSearchField] = useState<keyof JobPost>("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  const pageSize = 5;

  const sortedAndFilteredData = useMemo(() => {
    let temp = [...mockJob];

    // Sắp xếp
    if (sortOrder === "recent") {
      temp.sort((a, b) => b.id - a.id);
    } else if (sortOrder === "oldest") {
      temp.sort((a, b) => a.id - b.id);
    }

    // Lọc
    const query = searchQuery.toLowerCase();
    return temp.filter((job) => {
      const fieldValue = String(job[searchField] ?? "").toLowerCase();
      return fieldValue.includes(query);
    });
  }, [searchQuery, searchField, sortOrder]);

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
    { key: "description", title: "Description", align: "left" },
    { key: "salary", title: "Salary", align: "center" },
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
            onClick={() => setSelectedJob(record)}
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
    <div className="space-y-4 max-w-full">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-md shadow-lg flex flex-wrap gap-4 items-center justify-between w-full box-border">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as keyof JobPost)}
          className="border border-gray-300 rounded px-3 py-2 h-[40px]"
        >
          <option value="title">Title</option>
          <option value="company">Company</option>
          <option value="description">Description</option>
          <option value="location_city">Location City</option>
          <option value="location_ward">Location Ward</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[200px] h-[40px]"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 h-[40px]">
          Search
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 h-[40px]"
          onClick={() => {
            setSearchQuery("");
            setSearchField("title");
            setSortOrder("");
            setCurrentPage(1);
          }}
        >
          Reset
        </button>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded h-[40px]"
        >
          <option value="">Sắp xếp</option>
          <option value="recent">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        data={paginatedData}
        keyExtractor={(job) => job.id}
        emptyMessage="Không có công việc nào"
      />

      {/* Chi tiết công việc */}
      {selectedJob && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl border border-gray-300">
            <h2 className="text-lg font-semibold">Chi tiết công việc</h2>
            <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
              {Object.entries(selectedJob).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong>{" "}
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedJob(null)}
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
