/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (record: T) => string | number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (record: T, index: number) => void;
}

export const Table = <T,>({
  columns,
  data,
  keyExtractor,
  className = "",
  loading = false,
  emptyMessage = "Không có dữ liệu",
  onRowClick,
}: TableProps<T>) => {
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  if (loading) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/*<div className="w-8 h-8 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>*/}
          <div className="mx-auto loader"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <div className="scroll-x-only bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={` bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="overflow-x-auto scroll-x-only">
        <table className="min-w-full  whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      column.align === "center"
                        ? "justify-center"
                        : column.align === "right"
                          ? "justify-end"
                          : "justify-start"
                    }`}
                  >
                    {column.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((record, index) => (
              <tr
                key={keyExtractor(record)}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column, colIndex) => {
                  const value = getNestedValue(record, column.key as string);
                  const cellContent = column.render
                    ? column.render(value, record, index)
                    : value;

                  const isImage =
                    typeof cellContent === "object" &&
                    cellContent !== null &&
                    "type" in cellContent &&
                    (cellContent.type === "img" ||
                      cellContent.type === "Image");

                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.align === "center"
                          ? isImage
                            ? "" // bỏ text-center nếu là ảnh
                            : "text-center"
                          : column.align === "right"
                            ? "text-right"
                            : ""
                      }`}
                    >
                      {isImage ? (
                        <div className="flex justify-center">{cellContent}</div>
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
