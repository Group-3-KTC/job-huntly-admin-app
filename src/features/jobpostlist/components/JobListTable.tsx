import { useEffect, useMemo, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination"; 
import type { JobPost } from "../mock/mockJob";
import { mockJob } from "../mock/mockJob";
import { Eye } from "phosphor-react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import axios from "axios";

const JobListTable = () => {
  const [searchField] = useState<keyof JobPost>("title");
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [sortOrder, setSortOrder] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/")
      .then((res) => {
        const names = res.data.map((city: any) => city.name);
        setCityOptions(names);
      })
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
      });
  }, []);

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

        if (!jobValue) return false;

        const jobValues = Array.isArray(jobValue)
          ? jobValue.map((v) => v.toString().toLowerCase().trim())
          : [jobValue.toString().toLowerCase().trim()];

        const filterValues = Array.isArray(value)
          ? value.map((v) => v.toString().toLowerCase().trim())
          : [value.toString().toLowerCase().trim()];
        return filterValues.every((filterVal) =>
          jobValues.some((jobVal) => jobVal.includes(filterVal)),
        );
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
      key: "company",
      label: "Company",
      type: "select",
      options: ["FPT", "CMC", "Like Lion", "Viettel", "VNPT"],
    },
    {
      key: "location_city",
      label: "City",
      type: "multiselect",
      options: cityOptions,
    },
    {
      key: "sort",
      label: "Sort",
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
  const totalPages = Math.ceil(total / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredData.slice(start, start + itemsPerPage);
  }, [sortedAndFilteredData, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

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
      align: "left",
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
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedJob([record])}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="Chi tiết"
          >
            <Eye size={20} />
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
          setCurrentPage(1);
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
          <div className="bg-white p-6 rounded-2xl w-full max-w-5xl space-y-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 border-b pb-2">
              Job Detail
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {Object.entries(selectedJob[0]).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <strong className="text-gray-600 capitalize mb-1">
                    {key.replaceAll("_", " ")}:
                  </strong>
                  <div className="text-gray-800 p-2 rounded whitespace-pre-wrap">
                    <strong>
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedJob([])}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {totalPages > 0 && (
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
    </div>
  );
};

export default JobListTable;