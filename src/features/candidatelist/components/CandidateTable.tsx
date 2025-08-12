import { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import Pagination from "../../../components/common/Pagination";
import type { Candidate } from "../mock/mockCandidates";
import {
  Eye,
  FileText,
  PencilSimple,
  Prohibit,
  Trash,
  Plus,
} from "@phosphor-icons/react";
import {
  ConfirmModal,
  CandidateDetailsModal,
  CandidateAddModal,
  CandidateEditModal,
  CandidateCVModal,
} from "./modals";

interface Props {
  candidates: Candidate[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void; // Add this
  };
}

const statusLabel = {
  active: { text: "Active", style: "bg-green-100 text-green-700" },
  blocked: { text: "Blocked", style: "bg-red-100 text-red-700" },
  pending: { text: "Pending", style: "bg-purple-100 text-purple-700" },
};

export const CandidateTable = ({ candidates, loading, pagination }: Props) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Candidate>>({
    name: "",
    username: "",
    email: "",
    phone: "",
    status: "active",
    skills: [],
    location_city: "Hồ Chí Minh",
  });

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewModalOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      name: candidate.name,
      username: candidate.username,
      email: candidate.email,
      phone: candidate.phone,
      status: candidate.status,
    });
    setEditModalOpen(true);
  };

  const handleBlockCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setBlockModalOpen(true);
  };

  const handleDeleteCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDeleteModalOpen(true);
  };

  const handleViewCV = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCvModalOpen(true);
  };

  const handleAddCandidate = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      phone: "",
      status: "active",
    });
    setAddModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Thêm ứng viên:", formData);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cập nhật ứng viên:", selectedCandidate?.id, formData);
    setEditModalOpen(false);
  };

  const handleConfirmBlock = () => {
    if (!selectedCandidate) return;
    console.log(
      selectedCandidate.status === "blocked"
        ? "Unlock candidate"
        : "Block candidate",
      selectedCandidate.id,
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedCandidate) return;
    console.log("Xóa ứng viên:", selectedCandidate.id);
  };

  const columns: TableColumn<Candidate>[] = [
    {
      key: "id",
      title: "ID",
      width: "50px",
    },
    {
      key: "name",
      title: "Name",
      width: "180px",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "avatarUrl",
      title: "Avatar",
      render: (url: string) => (
        <img
          src={url}
          alt="avatar"
          className="object-cover w-10 h-10 rounded-full"
        />
      ),
      align: "right",
      width: "50px",
    },
    {
      key: "username",
      title: "Username",
      align: "center",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "phone",
      title: "Phone",
    },
    {
      key: "status",
      title: "Status",
      render: (status: keyof typeof statusLabel) => (
        <span
          className={`px-2 py-1 ${statusLabel[status].style} rounded-full text-xs`}
        >
          {statusLabel[status].text}
        </span>
      ),
      align: "center",
    },
    {
      key: "skills",
      title: "Skills",
      render: (skills: string[]) => (
        <div className="flex flex-wrap gap-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "location_city",
      title: "City",
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2 text-sm">
          <button
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="View details"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(record);
            }}
          >
            <Eye size={18} weight="regular" />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="View CV"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCV(record);
            }}
          >
            <FileText size={18} weight="regular" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCandidate(record);
            }}
          >
            <PencilSimple size={18} weight="regular" />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
            title={record.status === "blocked" ? "Unlock" : "Block"}
            onClick={(e) => {
              e.stopPropagation();
              handleBlockCandidate(record);
            }}
          >
            <Prohibit size={18} weight="regular" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCandidate(record);
            }}
          >
            <Trash size={18} weight="regular" />
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (candidate: Candidate) => {
    console.log("Row clicked:", candidate);
    handleViewDetails(candidate);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2 cursor-pointer"
          onClick={handleAddCandidate}
        >
          <Plus size={16} weight="bold" />
          Add candidate
        </button>
      </div>
      <Table
        columns={columns}
        data={candidates}
        keyExtractor={(candidate) => candidate.id}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No candidate found"
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
      <CandidateDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        candidate={selectedCandidate}
        onViewCV={handleViewCV}
      />
      <CandidateAddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleAddSubmit}
      />
      <CandidateEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        candidate={selectedCandidate}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleEditSubmit}
      />
      <CandidateCVModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        candidate={selectedCandidate}
      />
      <ConfirmModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={handleConfirmBlock}
        title={
          selectedCandidate?.status === "blocked"
            ? "Unlock account"
            : "Block account"
        }
        message={
          selectedCandidate?.status === "blocked"
            ? `Are you sure you want to unlock the account of "${selectedCandidate?.name}"?`
            : `Are you sure you want to block the account of "${selectedCandidate?.name}"?`
        }
        type={selectedCandidate?.status === "blocked" ? "success" : "warning"}
        confirmText={
          selectedCandidate?.status === "blocked" ? "Unlock" : "Block"
        }
      />
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete account"
        message={`Are you sure you want to delete the account of "${selectedCandidate?.name}"? This action cannot be undone.`}
        type="danger"
      />
    </>
  );
};