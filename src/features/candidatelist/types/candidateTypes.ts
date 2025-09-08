// Định nghĩa các kiểu dữ liệu cho candidate

export interface Candidate {
  id: number;
  name: string;
  avatarUrl?: string;
  username?: string;
  email: string;
  phone?: string;
  status: "active" | "inactive" | "banned" | "pending";
  skills: string[];
  location_city?: string;
  cvUrl?: string;
}

export interface CandidateProfile {
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

export interface CandidateResponse {
  content: CandidateProfile[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CandidateFilterParams {
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