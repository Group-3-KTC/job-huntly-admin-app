import { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Candidate } from "../mock/mockCandidates";
import {
  Eye,
  FileText,
  PencilSimple,
  Prohibit,
  Trash,
  Plus,
} from "@phosphor-icons/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg shadow-lg ${sizeClass[size]} w-full mx-4`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success";
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const buttonClass = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <p className="mb-4">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded ${buttonClass[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  candidates: Candidate[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const statusLabel = {
  active: { text: "Hoạt động", style: "bg-green-100 text-green-700" },
  blocked: { text: "Đã khóa", style: "bg-red-100 text-red-700" },
  pending: { text: "Chờ xác nhận", style: "bg-purple-100 text-purple-700" },
};

export const CandidateTable = ({ candidates, loading, pagination }: Props) => {
  // State cho các modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state cho add/edit
  const [formData, setFormData] = useState<Partial<Candidate>>({
    name: "",
    username: "",
    email: "",
    phone: "",
    status: "active",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Thực hiện thêm mới ứng viên
    console.log("Thêm ứng viên:", formData);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Thực hiện cập nhật ứng viên
    console.log("Cập nhật ứng viên:", selectedCandidate?.id, formData);
    setEditModalOpen(false);
  };

  const handleConfirmBlock = () => {
    if (!selectedCandidate) return;
    // TODO: Thực hiện block/unblock ứng viên
    console.log(
      selectedCandidate.status === "blocked"
        ? "Mở khóa ứng viên:"
        : "Khóa ứng viên:",
      selectedCandidate.id
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedCandidate) return;
    // TODO: Thực hiện xóa ứng viên
    console.log("Xóa ứng viên:", selectedCandidate.id);
  };

  const columns: TableColumn<Candidate>[] = [
    {
      key: "id",
      title: "ID",
      width: "80px",
    },
    {
      key: "name",
      title: "Họ tên",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "avatarUrl",
      title: "Ảnh đại diện",
      render: (url: string) => (
        <img
          src={url}
          alt="avatar"
          className="object-cover w-10 h-10 rounded-full"
        />
      ),
      align: "right",
      width: "80px",
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
      title: "Số điện thoại",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (status: keyof typeof statusLabel) => (
        <span
          className={`px-2 py-1 ${statusLabel[status].style} rounded-full text-xs`}
        >
          {statusLabel[status].text}
        </span>
      ),
      align: "center"
    },
    {
      key: "actions",
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2 text-sm">
          <button
            className="text-blue-500 hover:text-blue-700"
            title="Xem chi tiết"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(record);
            }}
          >
            <Eye size={18} weight="regular" />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700"
            title="Xem CV"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCV(record);
            }}
          >
            <FileText size={18} weight="regular" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            title="Sửa"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCandidate(record);
            }}
          >
            <PencilSimple size={18} weight="regular" />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700"
            title={record.status === "blocked" ? "Mở khóa" : "Khóa"}
            onClick={(e) => {
              e.stopPropagation();
              handleBlockCandidate(record);
            }}
          >
            <Prohibit size={18} weight="regular" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            title="Xóa"
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
        <h2 className="text-xl font-semibold">Danh sách ứng viên</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
          onClick={handleAddCandidate}
        >
          <Plus size={16} weight="bold" />
          Thêm ứng viên
        </button>
      </div>

      <Table
        columns={columns}
        data={candidates}
        keyExtractor={(candidate) => candidate.id}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="Không có ứng viên nào"
      />
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 border-t ">
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
              const totalPages = Math.ceil(pagination.total / pagination.pageSize);
              const pages = [];
              const maxVisible = 5;
              
              let startPage = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
              const initialEndPage = Math.min(totalPages, startPage + maxVisible - 1);
              
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

      {/* Modal xem chi tiết */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Thông tin ứng viên"
        size="lg"
      >
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedCandidate.avatarUrl}
                alt="avatar"
                className="object-cover w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedCandidate.name}</h3>
                <p className="text-gray-500">{selectedCandidate.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="font-semibold">Email:</p>
                <p>{selectedCandidate.email}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Số điện thoại:</p>
                <p>{selectedCandidate.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Trạng thái:</p>
                <p>
                  <span
                    className={`px-2 py-1 ${
                      statusLabel[selectedCandidate.status].style
                    } rounded-full text-xs`}
                  >
                    {statusLabel[selectedCandidate.status].text}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">ID:</p>
                <p>{selectedCandidate.id}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleViewCV(selectedCandidate);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xem CV
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal thêm ứng viên */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Thêm ứng viên mới"
        size="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Họ tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="active">Hoạt động</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="blocked">Đã khóa</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Ảnh đại diện
              </label>
              <input type="file" className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thêm mới
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal chỉnh sửa ứng viên */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Chỉnh sửa thông tin ứng viên"
        size="lg"
      >
        {selectedCandidate && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="blocked">Đã khóa</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Ảnh đại diện
                </label>
                <div className="flex items-center space-x-2">
                  <img
                    src={selectedCandidate.avatarUrl}
                    alt="avatar"
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <input
                    type="file"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal xác nhận block/unblock */}
      <ConfirmModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={handleConfirmBlock}
        title={
          selectedCandidate?.status === "blocked"
            ? "Mở khóa tài khoản"
            : "Khóa tài khoản"
        }
        message={
          selectedCandidate?.status === "blocked"
            ? `Bạn có chắc chắn muốn mở khóa tài khoản của "${selectedCandidate?.name}"?`
            : `Bạn có chắc chắn muốn khóa tài khoản của "${selectedCandidate?.name}"?`
        }
        type={selectedCandidate?.status === "blocked" ? "success" : "warning"}
        confirmText={
          selectedCandidate?.status === "blocked" ? "Mở khóa" : "Khóa"
        }
      />

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${selectedCandidate?.name}"? Hành động này không thể hoàn tác.`}
        type="danger"
      />

      {/* Modal xem CV */}
      <Modal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        title="CV của ứng viên"
        size="xl"
      >
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{selectedCandidate.name}</h3>
              <span
                className={`px-2 py-1 ${
                  statusLabel[selectedCandidate.status].style
                } rounded-full text-xs`}
              >
                {statusLabel[selectedCandidate.status].text}
              </span>
            </div>
            <div className="border rounded p-4 min-h-[400px] bg-gray-50">
              <div className="text-center py-10">
                <p className="text-gray-500">
                  Đây là nơi hiển thị CV của ứng viên.
                </p>
                <p className="text-gray-500 mt-2">
                  (Mẫu CV của {selectedCandidate.name})
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  // TODO: Tải xuống CV
                  console.log("Tải xuống CV của:", selectedCandidate.id);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tải xuống
              </button>
              <button
                onClick={() => setCvModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
