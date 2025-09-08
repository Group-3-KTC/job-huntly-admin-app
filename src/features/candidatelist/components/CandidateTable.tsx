import { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination";
import type { Candidate } from "../types/candidateTypes";
import {
  Eye as EyeIcon,
  Trash as TrashIcon,
  EnvelopeSimple,
  Phone,
  CheckCircle as CheckCircleIcon,
  Prohibit as ProhibitIcon,
} from "@phosphor-icons/react";
import { ViewCandidateModal } from "./modals/ViewCandidateModal";
import { candidateApi } from "../services/candidateApi";
import toast from "react-hot-toast";

interface CandidateTableProps {
  candidates: Candidate[];
  loading?: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (pageSize: number) => void;
  };
  onCandidateUpdated?: () => void;
}

const statusLabel = {
  ACTIVE: { text: "ACTIVE", style: "bg-green-100 text-green-700" },
  BANNED: { text: "BANNED", style: "bg-red-100 text-red-700" },
  INACTIVE: { text: "INACTIVE", style: "bg-yellow-100 text-yellow-700" },
};

export const CandidateTable = ({
  candidates,
  loading = false,
  pagination,
  onCandidateUpdated,
}: CandidateTableProps) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]); // Theo dõi ID của candidates đang xử lý
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "block" | "activate";
    candidate: Candidate;
  } | null>(null);

  const handleView = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewModalOpen(true);
  };

  const handleDownloadCV = (candidate: Candidate) => {
    if (candidate.cvUrl) {
      window.open(candidate.cvUrl, "_blank");
    } else {
      toast.error("No CV available for this candidate");
    }
  };

  // Xóa candidate
  const handleDeleteCandidate = async (candidate: Candidate) => {
    setProcessingIds((prev) => [...prev, candidate.id]);
    try {
      await candidateApi.deleteCandidate(candidate.id);
      toast.success(`Candidate ${candidate.name} has been deleted`);
      if (onCandidateUpdated) onCandidateUpdated();
    } catch (error) {
      console.error(`Error deleting candidate with id ${candidate.id}:`, error);
      toast.error(`Failed to delete candidate: ${(error as Error).message}`);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== candidate.id));
      setConfirmAction(null);
    }
  };
  
  // Block candidate - set status thành banned
  const handleBlockCandidate = async (candidate: Candidate) => {
    setProcessingIds((prev) => [...prev, candidate.id]);
    try {
      await candidateApi.blockCandidate(candidate.id);
      toast.success(`Candidate ${candidate.name} has been banned`);
      if (onCandidateUpdated) onCandidateUpdated();
    } catch (error) {
      console.error(`Error blocking candidate with id ${candidate.id}:`, error);
      toast.error(`Failed to ban candidate: ${(error as Error).message}`);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== candidate.id));
      setConfirmAction(null);
    }
  };
  
  // Activate candidate - set status thành active
  const handleActivateCandidate = async (candidate: Candidate) => {
    setProcessingIds((prev) => [...prev, candidate.id]);
    try {
      await candidateApi.unlockCandidate(candidate.id);
      toast.success(`Candidate ${candidate.name} has been activated`);
      if (onCandidateUpdated) onCandidateUpdated();
    } catch (error) {
      console.error(`Error activating candidate with id ${candidate.id}:`, error);
      toast.error(`Failed to activate candidate: ${(error as Error).message}`);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== candidate.id));
      setConfirmAction(null);
    }
  };

  const isProcessing = (id: number) => processingIds.includes(id);

  const columns: TableColumn<Candidate>[] = [
    {
      key: "index",
      title: "STT",
      align: "center",
      render: (_, __, index) => index + 1 + (pagination.page - 1) * pagination.pageSize,
    },
    {
      key: "name",
      title: "Candidate",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {row.avatarUrl ? (
              <img src={row.avatarUrl} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-600">{row.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      title: "Contact",
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <EnvelopeSimple size={16} className="text-gray-400" />
            <span className="text-sm">{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-1">
              <Phone size={16} className="text-gray-400" />
              <span className="text-sm">{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: (_, row) => {
        const status = row.status?.toUpperCase() || "INACTIVE";
        const statusInfo = statusLabel[status as keyof typeof statusLabel] || statusLabel.INACTIVE;
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.style}`}>
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (_, row) => {
        return (
        <div className="flex justify-center space-x-2 text-sm">
          <button
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="View"
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
          >
            <EyeIcon size={18} />
          </button>
          {row.status && row.status.toUpperCase() === "BANNED" ? (
            <button
              className="text-green-500 hover:text-green-700 cursor-pointer"
              title="Unlock"
              disabled={isProcessing(row.id)}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: "activate", candidate: row });
              }}
            >
              <CheckCircleIcon size={18} />
            </button>
          ) : row.status && row.status.toUpperCase() === "INACTIVE" ? (
            <button
              className="text-green-500 hover:text-green-700 cursor-pointer"
              title="Activate"
              disabled={isProcessing(row.id)}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: "activate", candidate: row });
              }}
            >
              <CheckCircleIcon size={18} />
            </button>
          ) : row.status && row.status.toUpperCase() === "ACTIVE" ? (
            <button
              className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
              title="Block"
              disabled={isProcessing(row.id)}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: "block", candidate: row });
              }}
            >
              <ProhibitIcon size={18} />
            </button>
          ) : null}
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer"
            title="Delete"
            disabled={isProcessing(row.id)}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmAction({ type: "delete", candidate: row });
            }}
          >
            <TrashIcon size={18} />
          </button>
          {row.cvUrl && (
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              title="Download CV"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadCV(row);
              }}
            >
              CV
            </button>
          )}
        </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <Table
        data={candidates}
        columns={columns}
        loading={loading}
        className="w-full"
        keyExtractor={(candidate) => candidate.id.toString()}
        emptyMessage="No candidates found"
      />

      <div className="mt-4">
        <Pagination
          currentPage={pagination.page}
          totalItems={pagination.total}
          itemsPerPage={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
          showItemsPerPage={true}
        />
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ViewCandidateModal
              candidate={selectedCandidate}
              onClose={() => setViewModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {confirmAction.type === "delete"
                ? "Confirm Delete"
                : confirmAction.type === "block"
                ? "Confirm Block"
                : confirmAction.candidate.status && confirmAction.candidate.status.toUpperCase() === "BANNED"
                ? "Confirm Unlock"
                : "Confirm Activation"}
            </h2>
            <p className="mb-4">
              Are you sure you want to
              {confirmAction.type === "delete"
                ? " delete "
                : confirmAction.type === "block"
                ? " block "
                : confirmAction.candidate.status && confirmAction.candidate.status.toUpperCase() === "BANNED"
                ? " unlock "
                : " activate "}
              <strong>{confirmAction.candidate.name}</strong>?
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
                    handleDeleteCandidate(confirmAction.candidate);
                  } else if (confirmAction.type === "block") {
                    handleBlockCandidate(confirmAction.candidate);
                  } else {
                    handleActivateCandidate(confirmAction.candidate);
                  }
                }}
                className={`px-4 py-2 ${
                  confirmAction.type === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : confirmAction.type === "block"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white rounded`}
                disabled={isProcessing(confirmAction.candidate.id)}
              >
                {isProcessing(confirmAction.candidate.id)
                  ? "Processing..."
                  : confirmAction.type === "delete"
                  ? "Delete"
                  : confirmAction.type === "block"
                  ? "Block"
                  : confirmAction.candidate.status && confirmAction.candidate.status.toUpperCase() === "BANNED"
                  ? "Unlock"
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};