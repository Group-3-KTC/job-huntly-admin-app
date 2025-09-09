import { useEffect, useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination";
import type { Company } from "../types/companyType";
import {
  EyeIcon,
  PencilSimpleIcon,
  StarIcon,
  ProhibitIcon,
  CheckCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import CompanyDetailModal from "./CompanyDetail";
import { companyService } from "../services/companyService";
import toast from "react-hot-toast";

interface Props {
  companies: Company[];
  loading?: boolean;
  onEdit?: (company: Company) => void;
  onRefresh?: () => void; // Callback để refresh dữ liệu sau khi block/delete
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
  banned: { text: "Blocked", style: "bg-red-100 text-red-700" },
  inactive: { text: "Pending", style: "bg-purple-100 text-purple-700" },
};

export const CompanyTable = ({
  companies,
  loading,
  pagination,
  onEdit,
  onRefresh,
}: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [data, setData] = useState<Company[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]); // Theo dõi ID của companies đang xử lý
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "block" | "activate";
    company: Company;
  } | null>(null);

  useEffect(() => {
    setData(companies);
  }, [companies]);

  const getLocationDisplay = (city: string, country: string) => {
    return `${city}${country ? `, ${country}` : ""}`;
  };

  // Block công ty - set status thành banned
  const handleBlockCompany = async (company: Company) => {
    setProcessingIds((prev) => [...prev, company.id]);
    try {
      // Cập nhật status thành "banned"
      await companyService.update(company.id, { status: "banned" });
      toast.success(`Company ${company.companyName} has been blocked`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Error blocking company with id ${company.id}:`, error);
      toast.error(`Failed to block company: ${(error as Error).message}`);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== company.id));
      setConfirmAction(null);
    }
  };

  // Kích hoạt công ty - set status thành active
  const handleActivateCompany = async (company: Company) => {
    setProcessingIds((prev) => [...prev, company.id]);
    try {
      // Cập nhật status thành "active"
      await companyService.update(company.id, { status: "active" });
      toast.success(`Company ${company.companyName} has been activated`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Error activating company with id ${company.id}:`, error);
      toast.error(`Failed to activate company: ${(error as Error).message}`);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== company.id));
      setConfirmAction(null);
    }
  };

  const handleDeleteCompany = async (company: Company) => {
    setProcessingIds((prev) => [...prev, company.id]);
    try {
      await companyService.delete(company.id);
      toast.success(`Company ${company.companyName} has been deleted`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Error deleting company with id ${company.id}:`, error);
      toast.error(`Failed to delete company: ${(error as Error).message}`);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== company.id));
      setConfirmAction(null);
    }
  };

  const isProcessing = (id: number) => processingIds.includes(id);

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
              if (onEdit) onEdit(record);
            }}
          >
            <PencilSimpleIcon size={18} />
          </button>
          {record.status === "banned" ? (
            <button
              className="text-green-500 hover:text-green-700 cursor-pointer"
              title="Activate"
              disabled={isProcessing(record.id)}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: "activate", company: record });
              }}
            >
              <CheckCircleIcon size={18} />
            </button>
          ) : (
            <button
              className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
              title="Block"
              disabled={isProcessing(record.id)}
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
            disabled={isProcessing(record.id)}
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
      {confirmAction && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {confirmAction.type === "delete"
                ? "Confirm Delete"
                : confirmAction.type === "block"
                ? "Confirm Block"
                : "Confirm Activation"}
            </h2>
            <p className="mb-4">
              Are you sure you want to
              {confirmAction.type === "delete"
                ? " delete "
                : confirmAction.type === "block"
                ? " block "
                : " activate "}
              <strong>{confirmAction.company.companyName}</strong>?
              {confirmAction.type === "delete" &&
                " This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === "delete") {
                    handleDeleteCompany(confirmAction.company);
                  } else if (confirmAction.type === "block") {
                    handleBlockCompany(confirmAction.company);
                  } else {
                    handleActivateCompany(confirmAction.company);
                  }
                }}
                className={`px-4 py-2 ${
                  confirmAction.type === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : confirmAction.type === "block"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white rounded`}
                disabled={isProcessing(confirmAction.company.id)}
              >
                {isProcessing(confirmAction.company.id)
                  ? "Processing..."
                  : confirmAction.type === "delete"
                  ? "Delete"
                  : confirmAction.type === "block"
                  ? "Block"
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
