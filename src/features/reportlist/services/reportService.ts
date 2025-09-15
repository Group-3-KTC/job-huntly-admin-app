import axios from "axios";
import { API_CONFIG } from "../../../config/config";

export type ReportStatus = "PROCESS" | "DONE" | "REJECTED";
export type ReportType = string;

export interface Report {
  id: number;
  reportType: ReportType;
  description: string;
  userId: number;
  reportedContentId: number;
  createdAt: string; // ISO string
  status: ReportStatus;
}

export interface PageResp<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const API = axios.create({
  baseURL: API_CONFIG.BASE_URL || "https://api.jobhuntly.io.vn/api/v1",
  withCredentials: true,
});

export async function getReports(params: {
  type?: string;
  status?: string;
  page?: number;    // 1-based từ UI, convert sang 0-based khi call
  size?: number;
  sort?: "asc" | "desc"; // sort theo createdAt
}) {
  const { type, status, page = 1, size = 10, sort = "desc" } = params || {};
  const resp = await API.get<PageResp<Report>>("/report", {
    params: {
      type: type || undefined,
      status: status || undefined,
      page: Math.max(0, page - 1),
      size,
      sort: `createdAt,${sort}`,
    },
  });
  return resp.data;
}

export async function getReportDetail(id: number) {
  const resp = await API.get<Report>(`/report/${id}`);
  return resp.data;
}

export async function updateReportStatus(id: number, status: ReportStatus) {
  const resp = await API.patch<Report>(`/report/${id}/status`, { status });
  return resp.data;
}

export async function deleteReport(id: number) {
  await API.delete(`/report/${id}`);
}

export async function getReportStats() {
  const r = await API.get("/report/stats");
  return r.data as { total:number; done:number; process:number; rejected:number; };
}