import { useEffect, useState } from "react";
import { CandidateTable } from "../components/CandidateTable";
import { type Candidate, mockCandidates } from "../mock/mockCandidates";
import {
  FilterBar,
  type FilterField,
} from "../../../components/common/FilterBar";
import CandidateStatistics from "../components/CandidateStatistics";

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
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    searchText: "",
    status: "",
    sort: "",
    skills: [],
    location_city: [],
    created_from: "",
    created_to: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const candidateFilters: FilterField[] = [
    {
      key: "searchText",
      label: "Search",
      type: "text",
      placeholder: "Search by name or username",
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

  const filtered = candidates
    .filter((c) => {
      const { searchText, status, skills, location_city } = filterValues;
      const matchSearch =
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.username.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = status ? c.status === status : true;
      const matchSkills = skills.length
        ? skills.every((s: string) => c.skills?.includes(s))
        : true;
      const matchLocation = location_city.length
        ? location_city.includes(c.location_city)
        : true;
      return matchSearch && matchStatus && matchSkills && matchLocation;
    })
    .sort((a, b) => {
      const sort = filterValues.sort;
      if (sort === "asc") return a.name.localeCompare(b.name);
      if (sort === "desc") return b.name.localeCompare(a.name);
      if (sort === "id") return a.id - b.id;
      if (sort === "recent") return b.id - a.id;
      return 0;
    });

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  return (
    <div className="w-full px-6">
      <CandidateStatistics candidates={candidates} />
      <FilterBar
        filters={candidateFilters}
        initialValues={filterValues}
        onFilterChange={(filters) => {
          setFilterValues(filters as unknown as FilterValues);
          setPage(1);
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
          setPage(1);
        }}
      />
      <CandidateTable
        candidates={paginated}
        loading={loading}
        pagination={{
          page,
          pageSize: itemsPerPage,
          total: filtered.length,
          onPageChange: setPage,
          onItemsPerPageChange: handleItemsPerPageChange, // Pass handler to table
        }}
      />
    </div>
  );
};