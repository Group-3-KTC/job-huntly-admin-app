import axios from "axios";
import { API_CONFIG } from "../../../config/config";
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

// Tạo instance axios với cấu hình cơ bản
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Thêm interceptor để tự động đính kèm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("admin_token");
    
    // Nếu có token, thêm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
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
};
