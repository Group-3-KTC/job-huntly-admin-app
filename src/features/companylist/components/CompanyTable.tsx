import { useState, useEffect } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Company } from "../mockApi/mockCompany";
import { Eye, Edit2, LockKeyholeOpen, Trash2, LockKeyhole } from "lucide-react";
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
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "block";
    company: Company;
  } | null>(null);

  useEffect(() => {
    const filtered = companies.filter((c) => !deletedIds.includes(c.id));
    setData(filtered);
  }, [companies, deletedIds]);

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => [...prev, id]);
    setConfirmAction(null);
  };

  const handleBlock = (id: number) => {
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "blocked" } : c))
    );
    setConfirmAction(null);
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
            <Eye size={18} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditingCompany(record);
            }}
          >
            <Edit2 size={18} />
          </button>
          {record.status === "blocked" ? (
            <span title="Blocked">
              <LockKeyhole size={18} className="text-yellow-500" />
            </span>
          ) : (
            <button
              className="text-yellow-500 hover:text-yellow-700"
              title="Block"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: "block", company: record });
              }}
            >
              <LockKeyholeOpen size={18} />
            </button>
          )}
          <button
            className="text-red-500 hover:text-red-700"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmAction({ type: "delete", company: record });
            }}
          >
            <Trash2 size={18} />
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
        <div className="flex items-center justify-between px-6 py-3 border-t ">
          <div className="text-sm text-gray-500">
            Display {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} candidates
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

      {confirmAction && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {confirmAction.type === "delete"
                ? "Confirm company deletion"
                : "Confirm company key"}
            </h2>
            <p className="mb-4">
              Are you sure
              {confirmAction.type === "delete" ? " Delete " : " Block "}
              Company<strong>{confirmAction.company.email}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  confirmAction.type === "delete"
                    ? handleDelete(confirmAction.company.id)
                    : handleBlock(confirmAction.company.id)
                }
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
