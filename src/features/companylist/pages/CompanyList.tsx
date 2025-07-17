import { useEffect, useState } from "react";
import { type Company, mockCompany } from "../mockApi/mockCompany";
import { CompanyTable } from "../components/CompanyTable";
import { PlusIcon, FileXlsIcon } from "@phosphor-icons/react";

const CompanyListPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("email");
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
      const searchTarget =
        searchField === "email"
          ? c.email
          : searchField === "city"
          ? c.location_city.join(", ")
          : searchField === "employees"
          ? c.quantity_employee.toString()
          : "";
      const matchSearch = searchTarget
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
    <div className="w-full px-6">
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="flex items-center justify-end flex-wrap gap-4">
          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              <PlusIcon size={16} className="mr-2" /> Add Company
            </button>
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <FileXlsIcon size={16} className="mr-2" /> Export to Excel
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 gap-2">
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setSearchText("");
              }}
              className="px-3 py-2 border rounded text-black"
            >
              <option value="email">Email</option>
              <option value="city">City</option>
              <option value="employees">Employees</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchText("");
                setStatusFilter("");
                setSortOrder("");
                setSearchField("email");
                setPage(1);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded text-black"
          >
            <option value="">Sort</option>
            <option value="id">ID Ascending</option>
            <option value="asc">Email A-Z</option>
            <option value="desc">Email Z-A</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
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
