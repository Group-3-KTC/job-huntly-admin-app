"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { CvTemplateDto } from "../../../types/cvTemplate.type";
import { fetchCvTemplates, deleteCvTemplate } from "../services/cvTemplateApi";
import { useNavigate } from "react-router-dom";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination";
import { EyeIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

const CvTemplateTable = () => {
  const [allTemplates, setAllTemplates] = useState<CvTemplateDto[]>([]); // Raw data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null); // Separate state for date

  const navigate = useNavigate();

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCvTemplates();
      setAllTemplates(data || []);
    } catch (err) {
      setError("Failed to load templates.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleDelete = async (template: CvTemplateDto) => {
    // Show confirmation toast
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <div className="font-medium">Delete CV Template</div>
          <div className="text-sm text-gray-600">
            Are you sure you want to delete "<strong>{template.name}</strong>"?
            This action cannot be undone.
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmDelete(template.id, t.id)}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep toast open until user decides
        position: "top-center",
        style: {
          minWidth: "350px",
          padding: "16px",
        },
      },
    );
  };

   const confirmDelete = async (templateId: number, toastId: string) => {
     try {
       // Dismiss confirmation toast
       toast.dismiss(toastId);

       // Show loading toast
       const loadingToastId = toast.loading("Deleting template...");

       await deleteCvTemplate(templateId);
       await loadTemplates();

       // Dismiss loading toast and show success
       toast.dismiss(loadingToastId);
       toast.success("CV template deleted successfully!", {
         duration: 3000,
         position: "top-right",
       });
     } catch (err) {
       console.error(err);
       toast.error("Failed to delete CV template. Please try again.", {
         duration: 4000,
         position: "top-right",
       });
       setError("Delete failed");
     }
   };

  const filterFields: FilterField[] = [
    {
      key: "search",
      label: "Search by Name",
      type: "text",
      placeholder: "Enter template name...",
    },
    {
      key: "sort",
      label: "Sort by",
      type: "select",
      options: ["Oldest", "Newest"],
    },
    {
      key: "createdAt",
      label: "Created At",
      type: "date",
    },
  ];

  const handleFilter = (filters: Record<string, string | string[]>) => {
    const { sort, search, createdAt } = filters;

    if (typeof sort === "string") {
      setSortOrder(sort === "Newest" ? "recent" : "oldest");
    }

    if (typeof search === "string") {
      setSearchQuery(search);
    }

    if (typeof createdAt === "string") {
      setDateFilter(createdAt);
    } else {
      setDateFilter(null);
    }

    setCurrentPage(1);
  };

  const sortedAndFiltered = useMemo(() => {
    let data = [...allTemplates];

    // Date filter first
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      data = data.filter(
        (t) => new Date(t.createdAt).toDateString() === filterDate,
      );
    }

    // Sort
    if (sortOrder === "recent") {
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortOrder === "oldest") {
      data.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((t) => t.name.toLowerCase().includes(q));
    }

    return data;
  }, [allTemplates, sortOrder, searchQuery, dateFilter]);

  const total = sortedAndFiltered.length;
  const totalPages = Math.ceil(total / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAndFiltered.slice(start, start + itemsPerPage);
  }, [sortedAndFiltered, currentPage, itemsPerPage]);

  const columns: TableColumn<CvTemplateDto>[] = [
    { key: "id", title: "ID", width: "80px" },
    { key: "name", title: "Name" },
    {
      key: "previewImageUrl",
      title: "Preview",
      align: "center",
      render: (value) =>
        value ? (
          <img src={value} alt="preview" className="w-16 h-16 rounded border" />
        ) : (
          <span className="text-gray-400">No image</span>
        ),
    },
    {
      key: "createdAt",
      title: "Created At",
      align: "center",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "updatedAt",
      title: "Updated At",
      align: "center",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => navigate(`/admin/manageCv/${record.id}`)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            <EyeIcon size={16} />
          </button>
          <button
            onClick={() => navigate(`/admin/manageCv/${record.id}/edit`)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <PencilSimpleIcon size={16} />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar filters={filterFields} onFilterChange={handleFilter} />

      <Table<CvTemplateDto>
        columns={columns}
        data={paginatedData}
        keyExtractor={(t) => t.id}
        loading={loading}
        emptyMessage="No CV templates found."
      />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          showItemsPerPage={true}
        />
      )}
    </div>
  );
};

export default CvTemplateTable;
