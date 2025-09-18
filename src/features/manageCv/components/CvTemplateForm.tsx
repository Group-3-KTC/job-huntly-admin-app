"use client";
import React, { useState, useEffect } from "react";
import { fetchHtmlContent } from "../services/cvTemplateApi";
import type { CvTemplateDto } from "../../../types/cvTemplate.type";
import CvPreview from "./CvTemplateReview";

interface Props {
  initialData?: CvTemplateDto;
  onSubmit: (form: {
    name: string;
    htmlFile?: File;
    previewImage?: File;
  }) => Promise<void>;
  submitLabel: string;
  isDetail?: boolean; // thêm flag để phân biệt detail hay form
  submitting?: boolean;
}

const CustomFileInput: React.FC<{
  label: string;
  accept: string;
  value?: string;
  onChange: (file: File | undefined) => void;
}> = ({ label, accept, value, onChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
    onChange(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept={accept}
          className="hidden"
          id={`file-${label.toLowerCase().replace(" ", "-")}`}
          onChange={handleFileChange}
        />
        <label
          htmlFor={`file-${label.toLowerCase().replace(" ", "-")}`}
          className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded hover:bg-blue-100"
        >
          {selectedFile ? selectedFile.name : "Choose File"}
        </label>
        {value && !selectedFile && (
          <span className="text-sm text-gray-600">
            Current:{" "}
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {value}
            </a>
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {label === "HTML File"
          ? "Upload an HTML file. Required for new templates."
          : "Upload an image or use screenshot below. Required for new templates."}
      </p>
    </div>
  );
};

// Lấy tên file từ URL
const getFileNameFromUrl = (url?: string) => {
  if (!url) return "";
  const parts = url.split("/");
  return parts[parts.length - 1] || "preview_image";
};

export default function CvTemplateForm({
  initialData,
  onSubmit,
  submitLabel,
  isDetail = false,
  submitting = false,
}: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [htmlFile, setHtmlFile] = useState<File | undefined>();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<File | undefined>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(
    initialData?.previewImageUrl,
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPreviewImageUrl(initialData.previewImageUrl);
    }
  }, [initialData]);

  useEffect(() => {
    async function loadHtml() {
      if (htmlFile) {
        const text = await htmlFile.text();
        setHtmlContent(text);
      } else if (initialData?.htmlUrl) {
        const text = await fetchHtmlContent(initialData.htmlUrl);
        setHtmlContent(text);
      } else {
        setHtmlContent("");
      }
    }
    loadHtml();
  }, [htmlFile, initialData?.htmlUrl]);

  const handleScreenshot = (image: File) => {
    setPreviewImage(image);
    setPreviewImageUrl(URL.createObjectURL(image));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ name, htmlFile, previewImage });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Template Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter template name"
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Provide a unique name for the CV template.
        </p>
      </div>

      {!isDetail && (
        <CustomFileInput
          label="HTML File"
          accept=".html"
          value={initialData?.htmlUrl}
          onChange={setHtmlFile}
        />
      )}

      <div>
        <label
          htmlFor="previewImage"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Preview Image
        </label>
        {initialData?.previewImageUrl && (
          <p className="text-sm text-gray-600 mb-1">
            Current File: {getFileNameFromUrl(initialData.previewImageUrl)}
          </p>
        )}
        {!isDetail && (
          <input
            id="previewImage"
            type="file"
            accept="image/*"
            className="border border-gray-300 px-3 py-2 rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreviewImage(file);
              if (file) {
                setPreviewImageUrl(URL.createObjectURL(file));
              }
            }}
          />
        )}
        <p className="text-xs text-gray-500 mt-1">
          Upload an image or use the screenshot feature below. Required for new
          templates.
        </p>
        {previewImageUrl && (
          <img
            src={previewImageUrl}
            alt="Preview"
            className="mt-2  h-32 object-contain rounded border"
          />
        )}
      </div>

      {!isDetail && (
        <button
          type="submit"
          disabled={!name.trim() || submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 w-full flex justify-center items-center"
        >
          {submitting ? "Processing..." : submitLabel}
        </button>
      )}

      {htmlContent && (
        <CvPreview
          htmlContent={htmlContent}
          templateName={initialData?.name || name}
          isDetail={false}
          onScreenshot={handleScreenshot}
        />
      )}
    </form>
  );
}
