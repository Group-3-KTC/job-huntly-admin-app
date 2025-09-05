export interface CompanyResponse {
  content: Company[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Company {
  id: number;
  userId: number;
  companyName: string;
  description: string;
  email: string;
  phoneNumber: string;
  website: string;
  address: string;
  locationCity: string;
  locationCountry: string;
  foundedYear: number;
  quantityEmployee: number;
  status: "active" | "banned" | "inactive";
  isProCompany: boolean;
  followersCount: number;
  jobsCount: number;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  mapEmbedUrl: string | null;
  avatar: string;
  avatarCover: string;
  categories: string[];
  parentCategories: string[];
  categoryIds: number[] | null;
}

export interface CompanyLocation {
  name: string;
}

// Category Root từ API
export interface CategoryRoot {
  id: number;
  name: string;
}

// Vietnam Provinces API Types
export interface Province {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
  districts?: District[];
}

export interface District {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
  wards?: Ward[];
}

export interface Ward {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  district_code: number;
}
