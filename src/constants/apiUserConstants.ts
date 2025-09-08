export const API_USER_BASE = '/users';
export const API_USER_LIST = `${API_USER_BASE}`;
export const API_USER_DETAIL = (id: number) => `${API_USER_BASE}/${id}`;
export const API_USER_CREATE = API_USER_BASE;
export const API_USER_UPDATE = (id: number) => `${API_USER_BASE}/${id}`;
export const API_USER_DELETE = (id: number) => `${API_USER_BASE}/${id}`;

// Phân trang và lọc theo role
export const API_USER_PAGINATION = (page: number, size: number) => 
  `${API_USER_BASE}?page=${page}&size=${size}`;

export const API_USER_FILTER_BY_ROLE = (role: string, page: number, size: number) =>
  `${API_USER_BASE}?role=${role}&page=${page}&size=${size}`;

// API cho các thao tác với User
export const USER_API = {
  GET_ALL: API_USER_LIST,
  GET_BY_ID: (id: number) => API_USER_DETAIL(id),
  CREATE: API_USER_CREATE,
  UPDATE: (id: number) => API_USER_UPDATE(id),
  DELETE: (id: number) => API_USER_DELETE(id),
  GET_PAGINATED: (page: number, size: number) => API_USER_PAGINATION(page, size),
  GET_BY_ROLE: (role: string, page: number, size: number) => API_USER_FILTER_BY_ROLE(role, page, size),
};

// API cho các thao tác với Candidate (đơn giản hóa, chỉ lấy các API cơ bản)
export const CANDIDATE_API = {
  GET_ALL: API_USER_FILTER_BY_ROLE('CANDIDATE', 0, 10),
  GET_BY_ID: (id: number) => `${API_USER_BASE}/${id}`,
  UPDATE_STATUS: (id: number, status: string) => `${API_USER_BASE}/${id}/status/${status}`,
  DELETE: (id: number) => API_USER_DELETE(id),
};
