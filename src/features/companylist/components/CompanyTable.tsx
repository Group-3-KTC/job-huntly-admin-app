import { useEffect, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination";
import type { Company } from "../types/companyType";
import {
  EyeIcon,
  PencilSimpleIcon,
  ProhibitIcon,
  TrashIcon,
  CheckCircleIcon,
  StarIcon,
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
    onItemsPerPageChange: (itemsPerPage: number) => void;
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

  const getLocationDisplay = (city: string, country: string) => {
    return `${city}${country ? `, ${country}` : ""}`;
  };

  const columns: TableColumn<Company>[] = [
    { key: "id", title: "ID", width: "60px" },
    { key: "companyName", title: "Company Name" },
    { key: "email", title: "Email" },
    { key: "phoneNumber", title: "Phone Number" },
    { key: "address", title: "Address", align: "left", width: "180px" },
    {
      key: "location",
      title: "City",
      render: (_, record) =>
        getLocationDisplay(record.locationCity, record.locationCountry),
    },
    {
      key: "parentCategories",
      title: "Categories",
      render: (categories) =>
        Array.isArray(categories) ? categories.join(", ") : "",
    },
    {
      key: "jobsCount",
      title: "Jobs",
      align: "center",
    },
    {
      key: "isProCompany",
      title: "Pro",
      align: "center",
      render: (isPro) =>
        isPro ? (
          <StarIcon
            size={16}
            weight="fill"
            className="text-yellow-500 mx-auto"
          />
        ) : (
          <span className="text-xs text-gray-500">-</span>
        ),
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
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="View"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCompany(record);
            }}
          >
            <EyeIcon size={18} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditingCompany(record);
            }}
          >
            <PencilSimpleIcon size={18} />
          </button>
          {record.status === "blocked" ? (
            <span title="Blocked">
              <CheckCircleIcon size={18} className="text-yellow-500" />
            </span>
          ) : (
            <button
              className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
              title="Block"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: "block", company: record });
              }}
            >
              <ProhibitIcon size={18} />
            </button>
          )}
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmAction({ type: "delete", company: record });
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
      {!loading && pagination && pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          totalItems={pagination.total}
          itemsPerPage={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
          showItemsPerPage={true}
        />
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
                : "Confirm company block"}
            </h2>
            <p className="mb-4">
              Are you sure
              {confirmAction.type === "delete" ? " Delete " : " Block "}
              Company <strong>{confirmAction.company.email}</strong>?
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
