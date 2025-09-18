import { api } from "../../../config/api";
import type { CvTemplateDto } from "../../../types/cvTemplate.type";

// Get all templates
export async function fetchCvTemplates() {
  const res = await api.get<CvTemplateDto[]>("/cv-templates");
  return res.data;
}

// Get by id
export async function fetchCvTemplateById(id: number) {
  const res = await api.get<CvTemplateDto>(`/cv-templates/${id}`);
  return res.data;
}

// Fetch HTML content from htmlUrl
export async function fetchHtmlContent(htmlUrl: string) {
  const res = await fetch(htmlUrl, {
    headers: {
      Accept: "text/html",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch HTML content: ${res.statusText}`);
  }
  return await res.text();
}

// Create (multipart form data)
export async function createCvTemplate(body: {
  name: string;
  htmlFile: File;
  previewImage: File;
}) {
  const formData = new FormData();
  formData.append("name", body.name);
  formData.append("htmlFile", body.htmlFile);
  formData.append("previewImage", body.previewImage);

  const res = await api.post<CvTemplateDto>("/cv-templates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Update (multipart form data)
export async function updateCvTemplate(
  id: number,
  body: {
    name?: string;
    htmlFile?: File;
    previewImage?: File;
  },
) {
  const formData = new FormData();
  if (body.name) formData.append("name", body.name);
  if (body.htmlFile) formData.append("htmlFile", body.htmlFile);
  if (body.previewImage) formData.append("previewImage", body.previewImage);

  const res = await api.put<CvTemplateDto>(`/cv-templates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Delete
export async function deleteCvTemplate(id: number) {
  await api.delete(`/cv-templates/${id}`);
}
