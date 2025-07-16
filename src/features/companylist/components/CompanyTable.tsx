// src/features/companylist/components/CompanyTable.tsx
import { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Company } from "../mockApi/mockCompany";
import {
  EyeIcon,
  PencilSimpleIcon,
  ProhibitIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import CompanyDetailModal from "./CompanyDetail";

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
  active: { text: "Hoạt động", style: "bg-green-100 text-green-700" },
  blocked: { text: "Đã khóa", style: "bg-red-100 text-red-700" },
  pending: { text: "Chờ xác nhận", style: "bg-purple-100 text-purple-700" },
};

export const CompanyTable = ({ companies, loading, pagination }: Props) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const columns: TableColumn<Company>[] = [
    { key: "id", title: "ID", width: "80px" },
    { key: "email", title: "Email" },
    { key: "address", title: "Địa chỉ", align: "left" },
    {
      key: "location_city",
      title: "Thành phố",
      render: (cities) => cities.join(", "),
    },
    { key: "location_ward", title: "Phường" },
    {
      key: "quantity_employee",
      title: "Nhân sự",
      align: "center",
    },
    {
      key: "status",
      title: "Trạng thái",
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
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2 text-sm">
          <button
            className="text-blue-500 hover:text-blue-700"
            title="Xem chi tiết"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCompany(record);
            }}
          >
            <EyeIcon size={18} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            title="Sửa"
            onClick={(e) => {
              e.stopPropagation();
              alert("Sửa thông tin công ty");
            }}
          >
            <PencilSimpleIcon size={18} />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700"
            title="Khóa"
            onClick={(e) => {
              e.stopPropagation();
              alert("Khóa công ty");
            }}
          >
            <ProhibitIcon size={18} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            title="Xóa"
            onClick={(e) => {
              e.stopPropagation();
              alert("Xóa công ty");
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
        data={companies}
        keyExtractor={(c) => c.id}
        loading={loading}
        emptyMessage="Không có công ty nào"
      />
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="text-sm text-gray-500">
            Hiển thị {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            trên {pagination.total} công ty
          </div>
          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &lt;
            </button>
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
    </>
  );
};
