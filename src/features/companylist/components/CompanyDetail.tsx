import { Dialog } from "@headlessui/react";
import type { Company } from "../mockApi/mockCompany";

interface Props {
  company: Company | null;
  onClose: () => void;
}

export default function CompanyDetailModal({ company, onClose }: Props) {
  if (!company) return null;

  return (
    <Dialog
      open={!!company}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto z-50 p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Thông tin chi tiết công ty
          </Dialog.Title>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>ID:</strong> {company.id}
            </div>
            <div>
              <strong>Email:</strong> {company.email}
            </div>
            <div>
              <strong>Địa chỉ:</strong> {company.address}
            </div>
            <div>
              <strong>Phường:</strong> {company.location_ward}
            </div>
            <div>
              <strong>Thành phố:</strong> {company.location_city.join(", ")}
            </div>
            <div>
              <strong>Nhân sự:</strong> {company.quantity_employee}
            </div>
            <div>
              <strong>Trạng thái:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  company.status === "active"
                    ? "bg-green-100 text-green-700"
                    : company.status === "blocked"
                    ? "bg-red-100 text-red-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {company.status === "active"
                  ? "Hoạt động"
                  : company.status === "blocked"
                  ? "Đã khóa"
                  : "Chờ xác nhận"}
              </span>
            </div>
            <div>
              <strong>Người dùng ID:</strong> {company.userId}
            </div>
            <div className="col-span-2">
              <strong>Mô tả:</strong>{" "}
              <div className="mt-1 text-sm text-gray-700">
                {company.description}
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
