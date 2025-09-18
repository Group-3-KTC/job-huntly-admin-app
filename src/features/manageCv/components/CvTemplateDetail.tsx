"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CvTemplateDto } from "../../../types/cvTemplate.type";
import {
  fetchCvTemplateById,
  fetchHtmlContent,
} from "../services/cvTemplateApi";
import {
  FileText,
  CalendarBlank,
  CalendarCheck,
  PencilSimple,
  ArrowLeft,
} from "phosphor-react";
import CvPreview from "./CvTemplateReview";

export default function CvTemplateDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CvTemplateDto | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigate("/admin/manageCv");
  };

  useEffect(() => {
    if (params?.id) {
      loadData(Number(params.id));
    }
  }, [params?.id]);

  async function loadData(id: number) {
    try {
      setLoading(true);
      const templateData = await fetchCvTemplateById(id);
      const html = await fetchHtmlContent(templateData.htmlUrl);
      setData(templateData);
      setHtmlContent(html);
    } catch (error) {
      console.error(error);
      navigate("/manageCv");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="p-6 text-gray-600 animate-pulse">Loading...</div>;
  if (!data) return <div className="p-6">Template not found</div>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 bg-white px-3 py-2 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText size={24} className="text-blue-600" />
            Template Detail - {data.name}
          </h1>
        </div>
        <button
          onClick={() => navigate(`/admin/manageCv/${data.id}/edit`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          type="button"
        >
          <PencilSimple size={18} /> Edit
        </button>
      </div>

      {/* Info + Preview in 1 column */}
      <div className="space-y-6">
        <div className="bg-white shadow rounded-xl p-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Template Info
          </h2>
          <p>
            <strong>ID:</strong> {data.id}
          </p>
          <p>
            <strong>Name:</strong> {data.name}
          </p>
          <p className="flex items-center gap-2">
            <CalendarBlank size={18} className="text-gray-500" />
            <span>
              <strong>Created:</strong>{" "}
              {new Date(data.createdAt).toLocaleString()}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarCheck size={18} className="text-gray-500" />
            <span>
              <strong>Updated:</strong>{" "}
              {new Date(data.updatedAt).toLocaleString()}
            </span>
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <CvPreview
            htmlContent={htmlContent}
            templateName={data.name}
            isDetail={true}
          />
        </div>
      </div>
    </div>
  );
}
