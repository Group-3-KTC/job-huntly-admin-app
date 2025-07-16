import { Dialog } from "@headlessui/react";
import { useState } from "react";
import type { Company } from "../mockApi/mockCompany";

interface Props {
  company: Company | null;
  onClose: () => void;
  onSave: (updated: Company) => void;
}

export default function CompanyEditModal({ company, onClose, onSave }: Props) {
  const [form, setForm] = useState<Company | null>(company);

  if (!form) return null;

  const handleChange = <K extends keyof Company>(key: K, value: Company[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = () => {
    if (form) {
      onSave(form);
      onClose();
    }
  };

  return (
    <Dialog
      open={!!form}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto z-50 p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Chỉnh sửa công ty
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="font-medium">Email:</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">Địa chỉ:</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">Phường:</label>
              <input
                type="text"
                value={form.location_ward}
                onChange={(e) => handleChange("location_ward", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">
                Thành phố (phân cách bởi dấu phẩy):
              </label>
              <input
                type="text"
                value={form.location_city.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "location_city",
                    e.target.value
                      .split(",")
                      .map((c) => c.trim())
                      .filter((c): c is Company["location_city"][number] =>
                        [
                          "Hồ Chí Minh",
                          "Hà Nội",
                          "Đà Nẵng",
                          "Cần Thơ",
                          "Nha Trang",
                        ].includes(c)
                      )
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">Số nhân sự:</label>
              <input
                type="number"
                value={form.quantity_employee}
                onChange={(e) =>
                  handleChange("quantity_employee", Number(e.target.value))
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6 text-right space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
