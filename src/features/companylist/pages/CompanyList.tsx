// src/features/companylist/pages/CompanyListPage.tsx
import { useEffect, useState } from "react";
import { type Company, mockCompany } from "../mockApi/mockCompany";
import { CompanyTable } from "../components/CompanyTable";
import { PlusIcon, FileXlsIcon } from "@phosphor-icons/react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";

const CompanyListPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchField] = useState("email");
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

  const filters: FilterField[] = [
    {
      key: "searchText",
      label: "Search",
      type: "text",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["active", "blocked", "pending"],
    },
    {
      key: "sort",
      label: "Sort",
      type: "select",
      options: ["id", "asc", "desc", "recent"],
    },
  ];

  const filtered = companies
    .filter((c) => {
      const searchTarget =
        searchField === "email"
          ? c.email
          : searchField === "city"
          ? c.location_city.join(", ")
          : searchField === "employees"
          ? c.quantity_employee.toString()
          : c.email;
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
      <FilterBar
        filters={filters}
        initialValues={{
          searchText,
          status: statusFilter,
          sort: sortOrder,
        }}
        onFilterChange={(values) => {
          setSearchText(values.searchText || "");
          setStatusFilter(values.status || "");
          setSortOrder(values.sort || "");
          setPage(1);
        }}
        onReset={() => {
          setSearchText("");
          setStatusFilter("");
          setSortOrder("");
          setPage(1);
        }}
      />

      <div className="flex justify-end">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            <PlusIcon size={16} className="mr-2" /> Add Company
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            <FileXlsIcon size={16} className="mr-2" /> Export to Excel
          </button>
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
