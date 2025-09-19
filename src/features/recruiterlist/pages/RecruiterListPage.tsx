import { useEffect, useState, useCallback } from "react";
import { RecruiterTable } from "../components/RecruiterTable";
import { type Recruiter } from "../types/recruiterTypes";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import RecruiterStatistics from "../components/RecruiterStatistics";
import { recruiterApi } from "../services/recruiterApi";

interface FilterValues {
  searchText: string;
  status: string;
  sort: string;
  skills: string[];
  location_city: string[];
  created_from: string;
  created_to: string;
}

export const RecruiterListPage = () => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    searchText: "",
    status: "",
    sort: "",
    skills: [],
    location_city: [],
    created_from: "",
    created_to: "",
  });

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await recruiterApi.getRecruiters({
        page,
        size: itemsPerPage,
      });

      const mappedRecruiters: Recruiter[] = response.content.map((profile) => ({
        id: profile.id,
        name: profile.fullName,
        avatarUrl:
          profile.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        email: profile.email,
        phone: profile.phone || "",
        status: profile.status 
          ? (profile.status.toLowerCase && profile.status.toLowerCase() === "blocked"
              ? "BANNED"
              : profile.status.toUpperCase && profile.status.toUpperCase() as "ACTIVE" | "INACTIVE" | "BANNED" || "INACTIVE")
          : "INACTIVE",
        skills: profile.skills || [],
        location_city: profile.city || "",
        cvUrl: profile.cvUrl || "",
      }));

      setRecruiters(mappedRecruiters);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  // Lọc dữ liệu theo tiêu chí
  const filtered = recruiters.filter((c) => {

    const matchSearch =
      c.email.toLowerCase().includes(filterValues.searchText.toLowerCase()) ||
      c.id.toString().includes(filterValues.searchText) ||
      c.name.toLowerCase().includes(filterValues.searchText.toLowerCase());

    const matchStatus = filterValues.status 
      ? c.status === filterValues.status 
      : true;

    const matchCity =
      filterValues.location_city.length > 0
        ? c.location_city && filterValues.location_city.includes(c.location_city)
        : true;

    const matchSkills =
      filterValues.skills.length > 0
        ? c.skills.some(skill => filterValues.skills.includes(skill))
        : true;


    const matchCreatedDate = true;
    return matchSearch && matchStatus && matchCity && matchSkills && matchCreatedDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filterValues.sort === "name") return a.name.localeCompare(b.name);
    if (filterValues.sort === "email") return a.email.localeCompare(b.email);
    return a.id - b.id; // Mặc định sắp xếp theo ID
  });

  const recruiterFilters: FilterField[] = [
    {
      key: "searchText",
      label: "Search",
      type: "text",
      placeholder: "Search by name or email",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["ACTIVE", "BANNED", "INACTIVE"],
      placeholder: "Select status",
    },
    {
      key: "skills",
      label: "Skills",
      type: "multiselect",
      options: ["Java", "Python", "React", "SQL"],
      placeholder: "Select skills",
    },
    {
      key: "location_city",
      label: "City",
      type: "multiselect",
      options: ["Ho Chi Minh", "Ha noi", "Da Nang", "Can Tho", "Nha Trang"],
      placeholder: "Select city",
    },
    {
      key: "created_from",
      label: "Created Date",
      type: "date",
      placeholder: "From date",
      prefixLabel: "From:",
    },
    {
      key: "created_to",
      label: "Created Date",
      type: "date",
      placeholder: "To date",
      prefixLabel: "To:",
    },
    {
      key: "sort",
      label: "Sort",
      type: "select",
      options: ["id", "name", "email"],
      placeholder: "Select sort order",
      prefixLabel: "Sort by:",
    },
  ];

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(0);
  };

  const handleRecruiterUpdated = () => {
    fetchRecruiters();
  };

  return (
    <div className="w-full px-6">
      <RecruiterStatistics recruiters={sorted} />
      <FilterBar
        filters={recruiterFilters}
        initialValues={filterValues}
        onFilterChange={(filters) => {
          setFilterValues(filters as unknown as FilterValues);
        }}
        onReset={() => {
          setFilterValues({
            searchText: "",
            status: "",
            sort: "",
            skills: [],
            location_city: [],
            created_from: "",
            created_to: "",
          });
        }}
      />
      <RecruiterTable
        recruiters={sorted}
        loading={loading}
        pagination={{
          page: page + 1,
          pageSize: itemsPerPage,
          total: totalItems,
          onPageChange: (newPage) => setPage(newPage - 1),
          onItemsPerPageChange: handleItemsPerPageChange,
        }}
        onRecruiterUpdated={handleRecruiterUpdated}
      />
    </div>
  );
}; 