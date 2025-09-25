import { useEffect, useState } from "react";
import axios from "axios";
import type { Company, Province, CategoryRoot } from "../types/companyType";
import { CompanyTable } from "../components/CompanyTable";
import { PlusIcon, FileXlsIcon, Buildings } from "@phosphor-icons/react";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import StatisCard from "../../../components/ui/StatisticCard";
import AddCompanyModal from "../components/CompanyAdd";
import CompanyEditModal from "../components/CompanyEdit";
import { t } from "ttag";
import { companyService } from "../services/companyService";
import {
  PROVINCES_API_URL,
  API_CATEGORY_ROOTS,
} from "../../../constants/apiCompanyConstants";
import { API_CONFIG } from "../../../config/config";

const CompanyListPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isProFilter, setIsProFilter] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(0); // API sử dụng zero-based index
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [stats, setStats] = useState({
    hcmCount: 0,
    hanoiCount: 0,
    danangCount: 0,
  });
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Lấy danh sách tỉnh thành từ API provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.get<Province[]>(PROVINCES_API_URL);
        const cityNames = response.data.map((province) => province.name);
        setCities(cityNames);
      } catch (error) {
        console.error("Không thể lấy danh sách tỉnh thành:", error);
        setCities(["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Nha Trang"]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchProvinces();
  }, []);

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get<CategoryRoot[]>(
          `${API_CONFIG.BASE_URL}${API_CATEGORY_ROOTS}`
        );
        const categoryNames = response.data.map((category) => category.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Không thể lấy danh sách danh mục:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Lấy dữ liệu từ API
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getPaginated(page, itemsPerPage);
      setCompanies(response.content);
      setTotalItems(response.totalElements);

      // Tính toán số lượng công ty theo thành phố
      const hcmCount = response.content.filter(
        (c) =>
          c.locationCity === "Thành phố Hồ Chí Minh" ||
          c.locationCity === "TP.HCM"
      ).length;
      const hanoiCount = response.content.filter(
        (c) =>
          c.locationCity === "Thành phố Hà Nội" || c.locationCity === "Hà Nội"
      ).length;
      const danangCount = response.content.filter(
        (c) =>
          c.locationCity === "Thành phố Đà Nẵng" || c.locationCity === "Đà Nẵng"
      ).length;

      setStats({ hcmCount, hanoiCount, danangCount });
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, itemsPerPage]); // Reload khi thay đổi trang hoặc số item mỗi trang

  const filters: FilterField[] = [
    {
      key: "searchText",
      label: "Search (ID, Email, Name)",
      type: "text",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["active", "blocked", "pending"],
    },
    {
      key: "is_pro",
      label: "Pro Company",
      type: "select",
      options: ["yes", "no"],
    },
    {
      key: "sort",
      label: "Sort",
      type: "select",
      options: ["ID", "Name", "Jobs"],
    },
    {
      key: "location_city",
      label: "City",
      type: "multiselect",
      options: cities,
      placeholder: "Chọn thành phố",
      loading: loadingCities,
      searchable: true
    },
    {
      key: "category",
      label: "Category",
      type: "multiselect",
      options: categories,
      placeholder: "Chọn danh mục",
      loading: loadingCategories,
      searchable: true
    },
  ];

  // Lọc dữ liệu theo tiêu chí
  const filtered = companies.filter((c) => {
    // Lọc theo text
    const matchSearch =
      c.email.toLowerCase().includes(searchText.toLowerCase()) ||
      c.id.toString().includes(searchText) ||
      c.companyName.toLowerCase().includes(searchText.toLowerCase());

    // Lọc theo trạng thái
    const matchStatus = statusFilter ? c.status === statusFilter : true;

    // Lọc theo thành phố
    const matchCity =
      selectedCities.length > 0
        ? selectedCities.includes(c.locationCity)
        : true;

    // Lọc theo Pro Company
    const matchPro = isProFilter
      ? isProFilter === "yes"
        ? c.isProCompany
        : !c.isProCompany
      : true;

    // Lọc theo danh mục
    const matchCategory =
      selectedCategories.length > 0
        ? c.parentCategories.some((cat) => selectedCategories.includes(cat))
        : true;

    return matchSearch && matchStatus && matchCity && matchPro && matchCategory;
  });

  // Sắp xếp dữ liệu
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "Name") return a.companyName.localeCompare(b.companyName);
    if (sortOrder === "Jobs") return b.jobsCount - a.jobsCount;
    return a.id - b.id; // Mặc định sắp xếp theo ID
  });

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(0); // Reset về trang đầu tiên khi thay đổi số lượng item mỗi trang
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleSaveCompany = (updatedCompany: Company) => {
    // Cập nhật danh sách công ty sau khi chỉnh sửa
    setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setSelectedCompany(null);
    fetchCompanies(); // Tải lại dữ liệu từ server
  };

  const handleDeleteCompany = (id: number) => {
    // Xóa công ty khỏi danh sách
    setCompanies(companies.filter(c => c.id !== id));
    setSelectedCompany(null);
    fetchCompanies(); // Tải lại dữ liệu từ server
  };

  return (
    <div className="w-full px-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisCard
          label={t`Total Companies`}
          value={totalItems}
          icon={<Buildings size={24} />}
          change={{
            direction: "up",
            percentage: "3.5%",
            description: t`Up from last month`,
          }}
          colorScheme="green"
        />
        <StatisCard
          label={t`Company in Ho Chi Minh`}
          value={stats.hcmCount}
          icon={<Buildings size={24} />}
          change={{
            direction: "up",
            percentage: "12%",
            description: t`Up from last month`,
          }}
          colorScheme="green"
        />
        <StatisCard
          label={t`Company in Ha Noi`}
          value={stats.hanoiCount}
          icon={<Buildings size={24} />}
          change={{
            direction: "down",
            percentage: "5.5%",
            description: t`Down from last month`,
          }}
          colorScheme="orange"
        />
        <StatisCard
          label={t`Company in Da Nang`}
          value={stats.danangCount}
          icon={<Buildings size={24} />}
          change={{
            direction: "down",
            percentage: "3%",
            description: t`Down from last month`,
          }}
          colorScheme="red"
        />
      </div>

      <FilterBar
        filters={filters}
        initialValues={{
          searchText,
          status: statusFilter,
          is_pro: isProFilter,
          sort: sortOrder,
          location_city: selectedCities,
          category: selectedCategories,
        }}
        onFilterChange={(values) => {
          setSearchText(values.searchText || "");
          setStatusFilter(values.status || "");
          setIsProFilter(values.is_pro || "");
          setSortOrder(values.sort || "");
          setSelectedCities(values.location_city || []);
          setSelectedCategories(values.category || []);
          setPage(0); // Reset về trang đầu tiên khi thay đổi bộ lọc
        }}
        onReset={() => {
          setSearchText("");
          setStatusFilter("");
          setIsProFilter("");
          setSortOrder("");
          setSelectedCities([]);
          setSelectedCategories([]);
          setPage(0);
        }}
      />

      <div className="flex justify-end">
        <div className="flex gap-2">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
          >
            <PlusIcon size={16} className="mr-2" /> Add Company
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
            <FileXlsIcon size={16} className="mr-2" /> Export to Excel
          </button>
        </div>
      </div>

      <div className="mt-6">
        <CompanyTable
          companies={sorted}
          loading={loading}
          onEdit={handleEditCompany}
          onRefresh={fetchCompanies}
          pagination={{
            page: page + 1, // Chuyển về 1-based index cho UI
            pageSize: itemsPerPage,
            total: totalItems,
            onPageChange: (newPage) => setPage(newPage - 1), // Chuyển về 0-based index cho API
            onItemsPerPageChange: handleItemsPerPageChange,
          }}
        />
      </div>

      {openAddModal && (
        <AddCompanyModal
          onClose={() => {
            setOpenAddModal(false);
            fetchCompanies(); // Tải lại dữ liệu sau khi thêm công ty
          }}
        />
      )}

      {selectedCompany && (
        <CompanyEditModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSave={handleSaveCompany}
          onDelete={handleDeleteCompany}
        />
      )}
    </div>
  );
};

export default CompanyListPage;
