export const API_COMPANY_BASE = '/companies';
export const API_COMPANY_LIST = `${API_COMPANY_BASE}`;
export const API_COMPANY_DETAIL = (id: number) => `${API_COMPANY_BASE}/${id}`;
export const API_COMPANY_CREATE = API_COMPANY_BASE;
export const API_COMPANY_UPDATE = (id: number) => `${API_COMPANY_BASE}/${id}`;
export const API_COMPANY_DELETE = (id: number) => `${API_COMPANY_BASE}/${id}`;
export const API_COMPANY_STATUS = (id: number, status: string) => `${API_COMPANY_BASE}/${id}/status/${status}`;

// Phân trang
export const API_COMPANY_PAGINATION = (page: number, size: number) => 
  `${API_COMPANY_BASE}?page=${page}&size=${size}`;

// API Vietnam Provinces
export const PROVINCES_API_URL = "https://provinces.open-api.vn/api/";
export const PROVINCES_DISTRICT_API_URL = (provinceCode: number) => `${PROVINCES_API_URL}p/${provinceCode}?depth=2`;
export const PROVINCES_WARD_API_URL = (districtCode: number) => `${PROVINCES_API_URL}d/${districtCode}?depth=2`;

// Lấy danh sách locations
export const API_COMPANY_LOCATIONS = `${API_COMPANY_BASE}/locations`;

// Lấy danh sách category roots
export const API_CATEGORY_ROOTS = '/category/roots';
