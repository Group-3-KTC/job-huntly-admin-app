import { useEffect, useState, useCallback } from "react";
import { CandidateTable } from "../components/CandidateTable";
import { type Candidate } from "../types/candidateTypes";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import CandidateStatistics from "../components/CandidateStatistics";
import { candidateApi } from "../services/candidateApi";

interface FilterValues {
  searchText: string;
  status: string;
  sort: string;
  skills: string[];
  location_city: string[];
  created_from: string;
  created_to: string;
}

export const CandidateListPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
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

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await candidateApi.getCandidates({
        page,
        size: itemsPerPage,
        searchText: filterValues.searchText,
        status: filterValues.status,
        sort: filterValues.sort,
      });

      const mappedCandidates: Candidate[] = response.content.map((profile) => ({
        id: profile.id,
        name: profile.fullName,
        avatarUrl:
          profile.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg", // Fallback avatar
        email: profile.email,
        phone: profile.phone || "",
        status:
          (profile.status?.toLowerCase() === "blocked"
            ? "banned"
            : (profile.status?.toLowerCase() as
                | "active"
                | "inactive"
                | "pending")) || "pending",
        skills: profile.skills || [],
        location_city: profile.city || "",
        cvUrl: profile.cvUrl || "",
      }));

      setCandidates(mappedCandidates);
      setTotalItems(response.totalElements);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  }, [
    page,
    itemsPerPage,
    filterValues.searchText,
    filterValues.status,
    filterValues.sort,
  ]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterValues.searchText) {
        fetchCandidates();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filterValues.searchText, fetchCandidates]);

  const candidateFilters: FilterField[] = [
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
      options: ["active", "blocked", "pending"],
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
      options: ["id", "asc", "desc", "recent"],
      placeholder: "Select sort order",
      prefixLabel: "Sort by:",
    },
  ];

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(0);
  };

  const handleCandidateUpdated = () => {
    fetchCandidates();
  };

  return (
    <div className="w-full px-6">
      <CandidateStatistics candidates={candidates} />
      <FilterBar
        filters={candidateFilters}
        initialValues={filterValues}
        onFilterChange={(filters) => {
          setFilterValues(filters as unknown as FilterValues);
          setPage(0); 
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
          setPage(0);
        }}
      />
      <CandidateTable
        candidates={candidates}
        loading={loading}
        pagination={{
          page: page + 1,
          pageSize: itemsPerPage,
          total: totalItems,
          onPageChange: (newPage) => setPage(newPage - 1),
          onItemsPerPageChange: handleItemsPerPageChange,
        }}
        onCandidateUpdated={handleCandidateUpdated}
      />
    </div>
  );
};
