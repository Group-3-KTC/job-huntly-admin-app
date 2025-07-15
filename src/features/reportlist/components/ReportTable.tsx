import React from 'react'
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Reports } from '../mockApi/mockReport';
import { mockReport } from '../mockApi/mockReport';

const columns: TableColumn<Reports>[] = [
  {
    key: "id",
    title: "ID",
    width: "80px",
    align: "center",
  },
  {
    key: "reportType",
    title: "Type",
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
    title: "Content ID",
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
    render: (value) => (
      <span className={value === "True" ? "text-green-600" : "text-red-500"}>
        {value}
      </span>
    ),
  },
];

const ReportTable = () => {
  return (
    <div className="p-4">
      <Table
        columns={columns}
        data={mockReport}
        keyExtractor={(report) => report.id}
        emptyMessage="Không có báo cáo nào"
      />
    </div>
  );
};

export default ReportTable;