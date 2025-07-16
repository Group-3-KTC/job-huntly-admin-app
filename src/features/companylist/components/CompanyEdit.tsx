import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";
import { type Company } from "../mockApi/mockCompany";
import { ArrowLeftIcon, CheckIcon } from "@phosphor-icons/react";

const CompanyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        try {
          const data = await companyService.getById(parseInt(id));
          if (data) {
            setFormData(data);
          }
        } catch (error) {
          console.error("Error fetching company:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCompany();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await companyService.update(parseInt(id), formData);
        navigate("/companies");
      } catch (error) {
        console.error("Error updating company:", error);
        alert("Lỗi khi cập nhật công ty");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "location_city") {
      setFormData((prev) => ({
        ...prev,
        location_city: [
          value as
            | "Hồ Chí Minh"
            | "Hà Nội"
            | "Đà Nẵng"
            | "Cần Thơ"
            | "Nha Trang",
        ],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!formData.id) return <div className="p-6">Không tìm thấy công ty</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/companies")}
        className="flex items-center mb-4 text-blue-500 hover:text-blue-700"
      >
        <ArrowLeftIcon size={20} className="mr-2" />
        Quay lại danh sách
      </button>
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Sửa thông tin công ty</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Mô tả</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Thành phố</label>
            <select
              name="location_city"
              value={formData.location_city?.[0] || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Chọn thành phố</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Nha Trang">Nha Trang</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Phường</label>
            <input
              type="text"
              name="location_ward"
              value={formData.location_ward || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Số nhân viên</label>
            <input
              type="number"
              name="quantity_employee"
              value={formData.quantity_employee || 0}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Trạng thái</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="active">Hoạt động</option>
              <option value="blocked">Đã khóa</option>
              <option value="pending">Chờ xác nhận</option>
            </select>
          </div>
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            <CheckIcon size={16} className="mr-2" />
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyEdit;
