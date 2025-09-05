import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Company, Province, District, Ward } from "../types/companyType";
import { PROVINCES_API_URL, PROVINCES_DISTRICT_API_URL, PROVINCES_WARD_API_URL } from "../../../constants/apiCompanyConstants";
import { companyService } from "../services/companyService";

interface Props {
  company: Company | null;
  onClose: () => void;
  onSave?: (updated: Company) => void;
}

export default function CompanyEditModal({ company, onClose, onSave }: Props) {
  const [form, setForm] = useState<Company | null>(company);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  useEffect(() => {
    setForm(company);
  }, [company]);

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Province[]>(PROVINCES_API_URL);
        setProvinces(response.data);
      } catch (error) {
        console.error("Không thể lấy danh sách tỉnh thành:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
  const handleProvinceChange = async (provinceCode: number) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict(null);
    setWards([]);
    
    const provinceName = provinces.find(p => p.code === provinceCode)?.name || "";
    handleChange("locationCity", provinceName);
    
    try {
      const response = await axios.get<Province>(PROVINCES_DISTRICT_API_URL(provinceCode));
      if (response.data.districts) {
        setDistricts(response.data.districts);
      }
    } catch (error) {
      console.error("Không thể lấy danh sách quận/huyện:", error);
    }
  };

  // Lấy danh sách phường/xã khi chọn quận/huyện
  const handleDistrictChange = async (districtCode: number) => {
    setSelectedDistrict(districtCode);
    
    try {
      const response = await axios.get<District>(PROVINCES_WARD_API_URL(districtCode));
      if (response.data.wards) {
        setWards(response.data.wards);
      }
    } catch (error) {
      console.error("Không thể lấy danh sách phường/xã:", error);
    }
  };

  const handleChange = <K extends keyof Company>(key: K, value: Company[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!form || !form.id) return;
    
    setSubmitting(true);
    try {
      const updatedCompany = await companyService.update(form.id, form);
      if (onSave) {
        onSave(updatedCompany);
      }
      console.log(`Công ty ${form.companyName} đã được cập nhật thành công`);
      alert(`Công ty ${form.companyName} đã được cập nhật thành công`);
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật công ty:", error);
      alert(`Có lỗi xảy ra khi cập nhật công ty: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (newStatus: "active" | "blocked") => {
    if (!form || !form.id) return;
    
    setSubmitting(true);
    try {
      const updatedCompany = await companyService.updateStatus(form.id, newStatus);
      if (onSave) {
        onSave(updatedCompany);
      }
      const statusText = newStatus === "active" ? "mở khóa" : "khóa";
      console.log(`Công ty ${form.companyName} đã được ${statusText} thành công`);
      alert(`Công ty ${form.companyName} đã được ${statusText} thành công`);
      setForm(updatedCompany);
    } catch (error) {
      console.error(`Lỗi khi ${newStatus === "active" ? "mở khóa" : "khóa"} công ty:`, error);
      alert(`Có lỗi xảy ra: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
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
            Edit {form.companyName}
          </Dialog.Title>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                <input
                  type="number"
                  placeholder="Founded Year"
                  value={form.foundedYear}
                  onChange={(e) => handleChange("foundedYear", Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                placeholder="Website"
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={selectedProvince || ""}
                  onChange={(e) => handleProvinceChange(Number(e.target.value))}
                  disabled={loading}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={selectedDistrict || ""}
                  onChange={(e) => handleDistrictChange(Number(e.target.value))}
                  disabled={!selectedProvince || loading}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  disabled={!selectedDistrict || loading}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  placeholder="Country"
                  value={form.locationCountry}
                  onChange={(e) => handleChange("locationCountry", e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                <input
                  type="number"
                  value={form.quantityEmployee}
                  onChange={(e) =>
                    handleChange("quantityEmployee", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value as "active" | "blocked" | "pending")}
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.isProCompany}
                  onChange={(e) => handleChange("isProCompany", e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Pro Company</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 border rounded h-24"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <div>
              {form.status === "active" ? (
                <button
                  onClick={() => handleToggleStatus("blocked")}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Khóa công ty"}
                </button>
              ) : (
                <button
                  onClick={() => handleToggleStatus("active")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Mở khóa công ty"}
                </button>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={submitting}
              >
                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
