// src/features/companylist/pages/CompanyListPage.tsx
import { useEffect, useState } from "react";
import { type Company, mockCompany } from "../mockApi/mockCompany";
import { CompanyTable } from "../components/CompanyTable";
import { PlusIcon, FileXlsIcon, Buildings } from "@phosphor-icons/react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import StatisCard from "../../../components/ui/StatisticCard";
import AddCompanyModal from "../components/CompanyAdd";

const CompanyListPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
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
      label: "Search (ID, Email, Employees)",
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
    {
      key: "location_city",
      label: "Thành phố",
      type: "multiselect",
      options: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Nha Trang"],
      placeholder: "Chọn thành phố",
    },
  ];

  const filtered = companies
    .filter((c) => {
      const matchSearch =
        c.email.toLowerCase().includes(searchText.toLowerCase()) ||
        c.id.toString().includes(searchText) ||
        c.quantity_employee.toString().includes(searchText);

      const matchStatus = statusFilter ? c.status === statusFilter : true;

      const matchCity =
        selectedCities.length > 0
          ? c.location_city.some((city) => selectedCities.includes(city))
          : true;

      return matchSearch && matchStatus && matchCity;
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
    <div className="w-full px-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisCard
          label="Total Companies"
          value={companies.length}
          icon={<Buildings size={24} />}
          change={{
            direction: "up",
            percentage: "3.5%",
            description: "Up from last month",
          }}
          colorScheme="green"
        />
        <StatisCard
          label="Company in HCM"
          value={
            companies.filter((c) => c.location_city.includes("Hồ Chí Minh"))
              .length
          }
          icon={<Buildings size={24} />}
          change={{
            direction: "up",
            percentage: "12%",
            description: "Up from last month",
          }}
          colorScheme="green"
        />
        <StatisCard
          label="Company in Hà Nội"
          value={
            companies.filter((c) => c.location_city.includes("Hà Nội")).length
          }
          icon={<Buildings size={24} />}
          change={{
            direction: "down",
            percentage: "5.5%",
            description: "Down from last month",
          }}
          colorScheme="orange"
        />
        <StatisCard
          label="Company in Đà Nẵng"
          value={
            companies.filter((c) => c.location_city.includes("Đà Nẵng")).length
          }
          icon={<Buildings size={24} />}
          change={{
            direction: "down",
            percentage: "3%",
            description: "Down from last month",
          }}
          colorScheme="red"
        />
      </div>

      <FilterBar
        filters={filters}
        initialValues={{
          searchText,
          status: statusFilter,
          sort: sortOrder,
          location_city: selectedCities,
        }}
        onFilterChange={(values) => {
          setSearchText(values.searchText || "");
          setStatusFilter(values.status || "");
          setSortOrder(values.sort || "");
          setSelectedCities(values.location_city || []);
          setPage(1);
        }}
        onReset={() => {
          setSearchText("");
          setStatusFilter("");
          setSortOrder("");
          setSelectedCities([]);
          setPage(1);
        }}
      />

      <div className="flex justify-end">
        <div className="flex gap-2">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
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

      {openAddModal && (
        <AddCompanyModal onClose={() => setOpenAddModal(false)} />
      )}
    </div>
  );
};

export default CompanyListPage;
