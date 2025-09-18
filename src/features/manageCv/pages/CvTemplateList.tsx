"use client";
import CvTemplateTable from "../components/CvTemplateTable";
import { useNavigate } from "react-router-dom";

export default function CvTemplateList() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Manage CV Templates
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
          onClick={() => navigate("/admin/manageCv/create")}
        >
          + Create
        </button>
      </div>

      <CvTemplateTable />
    </div>
  );
}
