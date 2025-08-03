import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import type { Company } from "../mock/mockCompany";

interface Props {
  company: Company | null;
  onClose: () => void;
  onSave: (updated: Company) => void;
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

export default function CompanyEditModal({ company, onClose, onSave }: Props) {
  const [form, setForm] = useState<Company | null>(company);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  useEffect(() => {
    setForm(company);
  }, [company]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  const handleChange = <K extends keyof Company>(key: K, value: Company[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const name = provinces.find((p) => p.code === code)?.name || "";
    handleChange("location_city", [name]);
    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts);
        setWards([]);
        handleChange("location_ward", "");
      });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const name = districts.find((d) => d.code === code)?.name || "";
    setSelectedDistrict(name);
    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards);
        handleChange("location_ward", "");
      });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name =
      wards.find((w) => w.code === Number(e.target.value))?.name || "";
    const full = `${name}, ${selectedDistrict}`;
    handleChange("location_ward", full);
  };

  const handleSubmit = () => {
    if (form) {
      onSave(form);
      onClose();
    }
  };

  if (!form) return null;

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
            Edit for Company
          </Dialog.Title>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <label className="font-medium">Province:</label>
            <select
              className="w-full px-3 py-2 border rounded"
              onChange={handleProvinceChange}
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
            >
              <option value="">Select ward</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>

            <label className="font-medium">Employees:</label>
            <input
              type="number"
              value={form.quantity_employee}
              onChange={(e) =>
                handleChange("quantity_employee", Number(e.target.value))
              }
              className="w-full px-3 py-2 border rounded"
            />
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
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
