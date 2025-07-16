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
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          {/*<div className="w-8 h-8 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>*/}
          <div className="mx-auto loader"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto bg-white rounded-lg shadow-sm ${className}`}
    >
      <table className="min-w-full whitespace-nowrap">
        <thead>
          <tr className="text-xs font-medium text-gray-600 uppercase bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-4"
                style={{ width: column.width }}
              >
                <div
                  className={`flex items-center ${
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
              className={`hover:bg-gray-50 ${
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
                  (cellContent.type === "img" || cellContent.type === "Image");

                return (
                  <td
                    key={colIndex}
                    className={`px-4 py-4 ${
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
  );
};
