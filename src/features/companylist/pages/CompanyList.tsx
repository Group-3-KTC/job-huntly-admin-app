import { useEffect, useState } from "react";
import { type Company, mockCompany } from "../mockApi/mockCompany";
import { CompanyTable } from "../components/CompanyTable";
import { PlusIcon, FileXlsIcon } from "@phosphor-icons/react";

const CompanyListPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompanies(mockCompany);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = companies
    .filter((c) => {
      const matchSearch = c.email
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? c.status === statusFilter : true;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.email.localeCompare(b.email);
      if (sortOrder === "desc") return b.email.localeCompare(a.email);
      if (sortOrder === "id") return a.id - b.id;
      if (sortOrder === "recent") return b.id - a.id;
      return 0;
    });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full p-6">
      <div className="p-6 bg-black">
        <h1 className="text-2xl font-semibold text-white">
          Welcome to the Company List
        </h1>
      </div>
      <div className="flex items-center justify-end mb-6 mt-5">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            <PlusIcon size={16} className="mr-2" /> Thêm Công Ty
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 rounded hover:bg-gray-300">
            <FileXlsIcon size={16} className="mr-2" /> Xuất Excel
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-end gap-4">
          <input
            type="text"
            placeholder="Tìm theo email công ty"
            className="px-4 py-2 border border-gray-300 rounded"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="blocked">Đã khóa</option>
            <option value="pending">Chờ xác nhận</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Sắp xếp</option>
            <option value="id">ID tăng dần</option>
            <option value="asc">Email A-Z</option>
            <option value="desc">Email Z-A</option>
            <option value="recent">Mới nhất</option>
          </select>
          <button
            onClick={() => {
              setSearchText("");
              setStatusFilter("");
              setSortOrder("");
              setPage(1);
            }}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Đặt lại
          </button>
        </div>

        <CompanyTable
          companies={paginated}
          loading={loading}
          pagination={{
            page,
            pageSize,
            total: filtered.length,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default CompanyListPage;
