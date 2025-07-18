// src/features/companylist/components/CompanyAdd.tsx
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { companyService } from "../services/companyService";
import type { Company } from "../mockApi/mockCompany";

interface Props {
  onClose: () => void;
}

const defaultForm: Omit<Company, "id" | "userId"> = {
  email: "",
  description: "",
  address: "",
  location_city: [],
  location_ward: "",
  quantity_employee: 0,
  status: "pending",
};

const cityOptions: Company["location_city"] = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Nha Trang",
];

const statusOptions: Company["status"][] = ["active", "blocked", "pending"];

export default function AddCompanyModal({ onClose }: Props) {
  const [form, setForm] = useState<Omit<Company, "id" | "userId">>(defaultForm);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const newCompany: Company = {
      ...form,
      id: Date.now(),
      userId: Math.floor(Math.random() * 10000),
    };
    await companyService.add(newCompany);
    onClose();
    window.location.reload();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto z-50 p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Add New Company
          </Dialog.Title>

          <div className="space-y-4">
            <input
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <input
              placeholder="Address"
              className="w-full px-3 py-2 border rounded"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <input
              placeholder="Ward"
              className="w-full px-3 py-2 border rounded"
              value={form.location_ward}
              onChange={(e) => handleChange("location_ward", e.target.value)}
            />

            <div>
              <label className="block font-medium mb-1">Cities:</label>
              <select
                multiple
                value={form.location_city}
                onChange={(e) =>
                  handleChange(
                    "location_city",
                    Array.from(e.target.selectedOptions).map(
                      (o) => o.value as Company["location_city"][number]
                    )
                  )
                }
                className="w-full px-3 py-2 border rounded"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <label className="block font-medium mb-1">Employees:</label>
            <input
              type="number"
              min={0}
              step={1}
              className="w-full px-3 py-2 border rounded"
              value={form.quantity_employee}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("quantity_employee", val === "" ? 0 : Number(val));
              }}
            />

            <div>
              <label className="block font-medium mb-1">Status:</label>
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as Company["status"])
                }
                className="w-full px-3 py-2 border rounded"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 text-right space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
