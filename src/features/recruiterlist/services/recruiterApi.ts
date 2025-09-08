import api from "../../../config/api";
import { RECRUITER_API, USER_API } from "../../../constants/apiUserConstants";
import type {
  RecruiterFilterParams,
  RecruiterProfile,
  RecruiterResponse,
} from "../types/recruiterTypes";

export type RecruiterUpdateStatus = "ACTIVE" | "BANNED";

const axiosInstance = api;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Phiên đăng nhập hết hạn, chuyển hướng đến trang login...");
      // Chuyển hướng đến trang login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const recruiterApi = {
  async getRecruiters(
    params: RecruiterFilterParams = {}
  ): Promise<RecruiterResponse> {
    const {
      page = 0,
      size = 10,
      searchText,
      sort,
      status,
      skills,
      location_city,
      created_from,
      created_to,
    } = params;

    let url = `${USER_API.GET_BY_ROLE("RECRUITER", page, size)}`;

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
      url += `&skills=${skills.join(",")}`;
    }

    if (location_city && location_city.length > 0) {
      url += `&location=${location_city.join(",")}`;
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
      console.error("Error fetching recruiters:", error);
      throw error;
    }
  },

  async getRecruiterById(id: number): Promise<RecruiterProfile> {
    try {
      const response = await axiosInstance.get(RECRUITER_API.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching recruiter with ID ${id}:`, error);
      throw error;
    }
  },

  async updateRecruiterStatus(
    id: number,
    status: RecruiterUpdateStatus
  ): Promise<RecruiterProfile> {
    try {
      const response = await axiosInstance.patch(
        RECRUITER_API.UPDATE_STATUS(id),
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for recruiter ${id}:`, error);
      throw error;
    }
  },

  async deleteRecruiter(id: number): Promise<void> {
    try {
      await axiosInstance.delete(RECRUITER_API.DELETE(id));
    } catch (error) {
      console.error(`Error deleting recruiter ${id}:`, error);
      throw error;
    }
  },

  async getUsersByRole(
    role: string,
    page: number = 0,
    size: number = 10
  ): Promise<unknown> {
    try {
      const response = await axiosInstance.get(
        USER_API.GET_BY_ROLE(role, page, size)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  },

  async blockRecruiter(id: number): Promise<RecruiterProfile> {
    return this.updateRecruiterStatus(id, "BANNED");
  },

  async unlockRecruiter(id: number): Promise<RecruiterProfile> {
    return this.updateRecruiterStatus(id, "ACTIVE");
  },
}; 