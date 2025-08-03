import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import type { Company } from "../mock/mockCompany";

interface Props {
  onClose: () => void;
}

interface Province {
  code: number;
  name: string;
  districts: District[];
}

interface District {
  code: number;
  name: string;
  wards: Ward[];
}

interface Ward {
  code: number;
  name: string;
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

const statusOptions: Company["status"][] = ["active", "blocked", "pending"];

export default function AddCompanyModal({ onClose }: Props) {
  const [form, setForm] = useState<Omit<Company, "id" | "userId">>(defaultForm);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const selected = provinces.find((p) => p.code.toString() === code);
    if (!selected) return;
    handleChange("location_city", [selected.name]);
    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts);
        setWards([]);
        handleChange("location_ward", "");
      });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const selected = districts.find((d) => d.code.toString() === code);
    if (!selected) return;
    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards);
        handleChange("location_ward", "");
      });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const ward = wards.find((w) => w.code.toString() === code);
    const district = districts.find((d) =>
      d.wards.some((w) => w.code.toString() === code)
    );
    if (!ward || !district) return;
    handleChange("location_ward", `${ward.name}, ${district.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany: Company = {
      ...form,
      id: Date.now(),
      userId: Math.floor(Math.random() * 10000),
    };
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCompany),
    });
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 border rounded"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />

            <input
              placeholder="Address"
              className="w-full px-3 py-2 border rounded"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />

            <label className="font-medium">Province:</label>
            <select
              className="w-full px-3 py-2 border rounded"
              onChange={handleProvinceChange}
              required
            >
              <option value="">Select province</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>

            <label className="font-medium">District:</label>
            <select
              className="w-full px-3 py-2 border rounded"
              onChange={handleDistrictChange}
              required
              disabled={districts.length === 0}
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>

            <label className="font-medium">Ward:</label>
            <select
              className="w-full px-3 py-2 border rounded"
              onChange={handleWardChange}
              required
              disabled={wards.length === 0}
            >
              <option value="">Select ward</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>

            <label className="block font-medium">Employees:</label>
            <input
              type="number"
              min={0}
              step={1}
              className="w-full px-3 py-2 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={form.quantity_employee}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("quantity_employee", val === "" ? 0 : Number(val));
              }}
              required
            />

            <div>
              <label className="block font-medium">Status:</label>
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as Company["status"])
                }
                className="w-full px-3 py-2 border rounded"
                required
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 text-right space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
