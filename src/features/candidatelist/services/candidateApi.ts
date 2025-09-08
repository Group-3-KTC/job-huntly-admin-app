import api from '../../../config/api';
import { CANDIDATE_API, USER_API } from '../../../constants/apiUserConstants';
import type { CandidateFilterParams, CandidateProfile, CandidateResponse } from '../types/candidateTypes';

// Chỉ chấp nhận 2 giá trị status khi cập nhật qua API
export type CandidateUpdateStatus = 'ACTIVE' | 'BANNED';

// Sử dụng instance đã được cấu hình từ config/api.ts
const axiosInstance = api;

// Thêm interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Phiên đăng nhập hết hạn, chuyển hướng đến trang login...');
      // Chuyển hướng đến trang login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const candidateApi = {
  // Lấy danh sách ứng viên với phân trang và lọc
  async getCandidates(params: CandidateFilterParams = {}): Promise<CandidateResponse> {
    const { page = 0, size = 10, searchText, sort, status, skills, location_city, created_from, created_to } = params;
    
    // Xây dựng query params
    let url = `${USER_API.GET_BY_ROLE('CANDIDATE', page, size)}`;
    
    if (searchText) {
      url += `&keyword=${encodeURIComponent(searchText)}`;
      url += `&name=${encodeURIComponent(searchText)}`;
      url += `&fullName=${encodeURIComponent(searchText)}`;
      url += `&query=${encodeURIComponent(searchText)}`;
    }
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    if (status) {
      url += `&status=${status}`;
    }
    
    if (skills && skills.length > 0) {
      url += `&skills=${skills.join(',')}`;
    }
    
    if (location_city && location_city.length > 0) {
      url += `&location=${location_city.join(',')}`;
    }
    
    if (created_from) {
      url += `&createdFrom=${created_from}`;
    }
    
    if (created_to) {
      url += `&createdTo=${created_to}`;
    }
    
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },
  
  // Lấy thông tin chi tiết của một ứng viên
  async getCandidateById(id: number): Promise<CandidateProfile> {
    try {
      const response = await axiosInstance.get(CANDIDATE_API.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Cập nhật trạng thái của ứng viên (Block/Unblock)
  async updateCandidateStatus(
    id: number,
    status: CandidateUpdateStatus,
  ): Promise<CandidateProfile> {
    try {
      const response = await axiosInstance.patch(CANDIDATE_API.UPDATE_STATUS(id), { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for candidate ${id}:`, error);
      throw error;
    }
  },
  
  // Xóa ứng viên
  async deleteCandidate(id: number): Promise<void> {
    try {
      await axiosInstance.delete(CANDIDATE_API.DELETE(id));
    } catch (error) {
      console.error(`Error deleting candidate ${id}:`, error);
      throw error;
    }
  },
  
  // Lấy danh sách người dùng theo vai trò (ví dụ: CANDIDATE)
  async getUsersByRole(role: string, page: number = 0, size: number = 10): Promise<unknown> {
    try {
      const response = await axiosInstance.get(USER_API.GET_BY_ROLE(role, page, size));
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  },

  // Khoá ứng viên (banned)
  async blockCandidate(id: number): Promise<CandidateProfile> {
    return this.updateCandidateStatus(id, 'BANNED');
  },

  // Mở khoá ứng viên (active)
  async unlockCandidate(id: number): Promise<CandidateProfile> {
    return this.updateCandidateStatus(id, 'ACTIVE');
  }
};
