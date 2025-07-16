import React, { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Reports } from "../mockApi/mockReport";
import { mockReport } from "../mockApi/mockReport";

const ReportTable = () => {
  const [searchField, setSearchField] = useState("reportType");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = mockReport.filter((report) => {
    const fieldValue = String(
      report[searchField as keyof Reports]
    ).toLowerCase();
    return fieldValue.includes(searchQuery.toLowerCase());
  });

  const columns: TableColumn<Reports>[] = [
    {
      key: "id",
      title: "ID",
      width: "80px",
      align: "center",
    },
    {
      key: "reportType",
      title: "Report Type",
      align: "center",
    },
    {
      key: "description",
      title: "Description",
      align: "left",
    },
    {
      key: "userId",
      title: "User ID",
      align: "center",
    },
    {
      key: "reportedContentId",
      title: "Content Report ID",
      align: "center",
    },
    {
      key: "createAt",
      title: "Created At",
      align: "center",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: (value: string) => {
        const isChecked = value === "True";
        return (
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className="w-5 h-5 accent-blue-500 cursor-default"
          />
        );
      },
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center w-full">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="id">ID</option>
          <option value="reportType">Report Type</option>
          <option value="description">Description</option>
          <option value="userId">User ID</option>
          <option value="reportedContentId">Content Report ID</option>
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[200px]"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </div>
      <Table
        columns={columns}
        data={filteredData}
        keyExtractor={(report) => report.id}
        emptyMessage="Không có báo cáo nào"
      />
    </div>
  );
};

export default ReportTable;
