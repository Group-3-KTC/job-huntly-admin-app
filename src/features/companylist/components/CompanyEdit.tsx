import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import type { Company } from "../mockApi/mockCompany";

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

  const handleProvinceChange = (selected: any) => {
    if (!selected) return;
    handleChange("location_city", [selected.label]);
    fetch(`https://provinces.open-api.vn/api/p/${selected.value}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts);
        setWards([]);
        handleChange("location_ward", "");
      });
  };

  const handleDistrictChange = (selected: any) => {
    if (!selected) return;
    setSelectedDistrict(selected.label);
    fetch(`https://provinces.open-api.vn/api/d/${selected.value}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards);
        handleChange("location_ward", "");
      });
  };

  const handleWardChange = (selected: any) => {
    if (!selected) return;
    const full = `${selected.label}, ${selectedDistrict}`;
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
              <label className="font-medium">Address:</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="font-medium">City:</label>
              <Select
                options={provinces.map((p) => ({
                  label: p.name,
                  value: p.code,
                }))}
                onChange={handleProvinceChange}
              />
            </div>
            <div>
              <label className="font-medium">District:</label>
              <Select
                options={districts.map((d) => ({
                  label: d.name,
                  value: d.code,
                }))}
                onChange={handleDistrictChange}
              />
            </div>
            <div>
              <label className="font-medium">Ward:</label>
              <Select
                options={wards.map((w) => ({ label: w.name, value: w.name }))}
                onChange={handleWardChange}
              />
            </div>
            <div>
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
