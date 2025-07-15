// src/features/candidatelist/components/CandidateTable.tsx
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Candidate } from "../mock/mockCandidates";
import {
  Eye,
  FileText,
  PencilSimple,
  Prohibit,
  Trash,
} from "@phosphor-icons/react";

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
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
      align: "center",
      width: "80px",
    },
    {
      key: "username",
      title: "Username",
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
              // Handle view details
              alert("Xem profile");
            }}
          >
            <Eye size={18} weight="regular" />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700"
            title="Xem CV"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view CV
              alert("Xem CV");
            }}
          >
            <FileText size={18} weight="regular" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            title="Sửa"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit
              alert("Edit profile");
            }}
          >
            <PencilSimple size={18} weight="regular" />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700"
            title="Khóa"
            onClick={(e) => {
              e.stopPropagation();
              // Handle block
              alert("Block tài khoản");
            }}
          >
            <Prohibit size={18} weight="regular" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            title="Xóa"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
              alert("Xóa tài khoản");
            }}
          >
            <Trash size={18} weight="regular" />
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (candidate: Candidate, index: number) => {
    console.log("Row clicked:", candidate);
    // Handle row click - maybe navigate to detail page
    alert("Trang detail ứng viên");
  };

  return (
    <>
      <Table
        columns={columns}
        data={candidates}
        keyExtractor={(candidate) => candidate.id}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="Không có ứng viên nào"
      />
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="text-sm text-gray-500">
            Hiển thị {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            trên {pagination.total} ứng viên
          </div>
          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              &lt;
            </button>
            <button
              disabled={
                pagination.page ===
                Math.ceil(pagination.total / pagination.pageSize)
              }
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
};
