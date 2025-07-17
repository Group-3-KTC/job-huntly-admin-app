// src/features/companylist/components/CompanyTable.tsx
import { useState, useEffect } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Company } from "../mockApi/mockCompany";
import {
  EyeIcon,
  PencilSimpleIcon,
  ProhibitIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import CompanyDetailModal from "./CompanyDetail";
import CompanyEditModal from "./CompanyEdit";

interface Props {
  companies: Company[]; 
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const statusLabel = {
  active: { text: "Active", style: "bg-green-100 text-green-700" },
  blocked: { text: "Blocked", style: "bg-red-100 text-red-700" },
  pending: {
    text: "Pending Confirmation",
    style: "bg-purple-100 text-purple-700",
  },
};

export const CompanyTable = ({ companies, loading, pagination }: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [data, setData] = useState<Company[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    const filtered = companies.filter((c) => !deletedIds.includes(c.id));
    setData(filtered);
  }, [companies, deletedIds]);

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa công ty này?");
    if (confirmDelete) {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  const handleSaveEdit = (updated: Company) => {
    setData((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const columns: TableColumn<Company>[] = [
    { key: "id", title: "ID", width: "80px" },
    { key: "email", title: "Email" },
    { key: "address", title: "Address", align: "left" },
    {
      key: "location_city",
      title: "City",
      render: (cities) => cities.join(", "),
    },
    { key: "location_ward", title: "Ward" },
    {
      key: "quantity_employee",
      title: "Employees",
      align: "center",
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: (status: keyof typeof statusLabel) => (
        <span
          className={`px-2 py-1 ${statusLabel[status].style} rounded-full text-xs`}
        >
          {statusLabel[status].text}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2 text-sm">
          <button
            className="text-blue-500 hover:text-blue-700"
            title="View"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCompany(record);
            }}
          >
            <EyeIcon size={18} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditingCompany(record);
            }}
          >
            <PencilSimpleIcon size={18} />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700"
            title="Block"
            onClick={(e) => {
              e.stopPropagation();
              alert("Block company feature not implemented");
            }}
          >
            <ProhibitIcon size={18} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
          >
            <TrashIcon size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={data}
        keyExtractor={(c) => c.id}
        loading={loading}
        emptyMessage="No companies found"
      />
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 border-t mt-5 ">
          <div className="text-sm text-gray-500">
            Hiển thị {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            trên {pagination.total} ứng viên
          </div>
          <div className="flex gap-1">
            <button
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &lt;
            </button>

            {/* Hiển thị các nút số trang */}
            {(() => {
              const totalPages = Math.ceil(
                pagination.total / pagination.pageSize
              );
              const pages = [];
              const maxVisible = 5;

              let startPage = Math.max(
                1,
                pagination.page - Math.floor(maxVisible / 2)
              );
              const initialEndPage = Math.min(
                totalPages,
                startPage + maxVisible - 1
              );

              if (initialEndPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, initialEndPage - maxVisible + 1);
              }

              const endPage = Math.min(totalPages, startPage + maxVisible - 1);

              // Hiển thị nút trang đầu và "..." nếu cần
              if (startPage > 1) {
                pages.push(
                  <button
                    key="first"
                    onClick={() => pagination.onPageChange(1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    1
                  </button>
                );

                if (startPage > 2) {
                  pages.push(
                    <span key="dots1" className="px-3 py-1">
                      ...
                    </span>
                  );
                }
              }

              // Hiển thị các trang giữa
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => pagination.onPageChange(i)}
                    className={`px-3 py-1 border rounded ${
                      pagination.page === i
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              // Hiển thị "..." và nút trang cuối nếu cần
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="dots2" className="px-3 py-1">
                      ...
                    </span>
                  );
                }

                pages.push(
                  <button
                    key="last"
                    onClick={() => pagination.onPageChange(totalPages)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            <button
              disabled={
                pagination.page ===
                Math.ceil(pagination.total / pagination.pageSize)
              }
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
      {editingCompany && (
        <CompanyEditModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};
