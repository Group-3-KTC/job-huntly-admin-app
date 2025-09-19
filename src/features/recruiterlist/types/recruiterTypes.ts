// Định nghĩa các kiểu dữ liệu cho recruiter

export interface Recruiter {
  id: number;
  name: string;
  avatarUrl?: string;
  username?: string;
  email: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  skills: string[];
  location_city?: string;
  cvUrl?: string;
}

export interface RecruiterProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: string;
  location?: string;
  city?: string;
  skills?: string[];
  cvUrl?: string;
}

export interface RecruiterResponse {
  content: RecruiterProfile[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface RecruiterFilterParams {
  page?: number;
  size?: number;
  searchText?: string;
  status?: string;
  skills?: string[];
  location_city?: string[];
  created_from?: string;
  created_to?: string;
  sort?: string;
} 