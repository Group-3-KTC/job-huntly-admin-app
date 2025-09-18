"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import CvTemplateForm from "../components/CvTemplateForm";
import type { CvTemplateDto } from "../../../types/cvTemplate.type";
import {
  createCvTemplate,
  fetchCvTemplateById,
  updateCvTemplate,
} from "../services/cvTemplateApi";
import { ArrowLeft } from "phosphor-react";

export default function CvTemplateFormPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<CvTemplateDto | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const isEdit = !!params.id;
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && params?.id) {
      loadData(Number(params.id));
    } else {
      setLoading(false);
    }
  }, [params?.id, isEdit]);

  async function loadData(id: number) {
    try {
      setLoading(true);
      const res = await fetchCvTemplateById(id);
      setInitialData(res);
    } catch (error) {
      console.error(error);
      navigate("/admin/manageCv");
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    navigate("/admin/manageCv");
  };

  async function handleSubmit(form: {
    name: string;
    htmlFile?: File;
    previewImage?: File;
  }) {
    try {
      setSubmitting(true);

      if (isEdit && initialData) {
        await updateCvTemplate(initialData.id, form);
        toast.success("Template updated successfully!");
      } else {
        if (!form.htmlFile || !form.previewImage) {
          toast.error("HTML file and preview image are required!");
          return;
        }
        await createCvTemplate({
          name: form.name,
          htmlFile: form.htmlFile,
          previewImage: form.previewImage,
        });
        toast.success("Template created successfully!");
      }

      navigate("/admin/manageCv");
    } catch (error) {
      console.error("Operation failed", error);
      toast.error("Operation failed, please try again!");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  const pageTitle = isEdit
    ? `Edit CV Template${initialData ? ` - ${initialData.name}` : ""}`
    : "Create CV Template";
  const submitLabel = isEdit ? "Update" : "Create";

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-white gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          type="button"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <CvTemplateForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
        submitting={submitting}
      />
    </div>
  );
}
