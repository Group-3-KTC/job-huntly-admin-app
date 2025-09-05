import api from "../../../config/api";
import type {
  Company,
  CompanyResponse,
  CompanyLocation,
} from "../types/companyType";
import {
  API_COMPANY_LIST,
  API_COMPANY_DETAIL,
  API_COMPANY_CREATE,
  API_COMPANY_UPDATE,
  API_COMPANY_DELETE,
  API_COMPANY_STATUS,
  API_COMPANY_PAGINATION,
  API_COMPANY_LOCATIONS,
} from "../../../constants/apiCompanyConstants";

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

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await axiosInstance.get<CompanyResponse>(
        API_COMPANY_LIST
      );
      return response.data.content;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  },

  getPaginated: async (page = 0, size = 10): Promise<CompanyResponse> => {
    try {
      const response = await axiosInstance.get<CompanyResponse>(
        API_COMPANY_PAGINATION(page, size)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated companies:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Company | undefined> => {
    try {
      const response = await axiosInstance.get<Company>(API_COMPANY_DETAIL(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching company with id ${id}:`, error);
      throw error;
    }
  },

  getLocations: async (): Promise<CompanyLocation[]> => {
    try {
      const response = await axiosInstance.get<CompanyLocation[]>(
        API_COMPANY_LOCATIONS
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching company locations:", error);
      throw error;
    }
  },

  add: async (company: Omit<Company, "id">): Promise<Company> => {
    try {
      const response = await axiosInstance.post<Company>(
        API_COMPANY_CREATE,
        company
      );
      return response.data;
    } catch (error) {
      console.error("Error adding company:", error);
      throw error;
    }
  },

  update: async (id: number, patch: Partial<Company>): Promise<Company> => {
    try {
      const response = await axiosInstance.patch<Company>(
        API_COMPANY_UPDATE(id),
        patch
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating company with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(API_COMPANY_DELETE(id));
      return true;
    } catch (error) {
      console.error(`Error deleting company with id ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: number, status: string): Promise<Company> => {
    try {
      const response = await axiosInstance.put<Company>(
        API_COMPANY_STATUS(id, status)
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating company status with id ${id}:`, error);
      throw error;
    }
  },

  // Phương thức chuyên biệt để kích hoạt công ty (isActive = true)
  setActive: async (id: number): Promise<Company> => {
    try {
      const response = await axiosInstance.patch<Company>(
        API_COMPANY_UPDATE(id),
        { status: "active" }
      );
      return response.data;
    } catch (error) {
      console.error(`Error activating company with id ${id}:`, error);
      throw error;
    }
  },

  // Phương thức chuyên biệt để khóa công ty (isActive = false) 
  setInactive: async (id: number): Promise<Company> => {
    try {
      const response = await axiosInstance.patch<Company>(
        API_COMPANY_UPDATE(id),
        { status: "banned" }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deactivating company with id ${id}:`, error);
      throw error;
    }
  }
};
