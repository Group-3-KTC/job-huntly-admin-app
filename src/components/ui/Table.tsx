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
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>*/}
          <div className="loader mx-auto"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto bg-white rounded-lg shadow-sm ${className}`}
    >
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="text-left bg-gray-50 text-gray-600 uppercase text-xs font-medium">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-4 ${
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                      ? "text-right"
                      : ""
                }`}
                style={{ width: column.width }}
              >
                {column.title}
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

                return (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : ""
                    }`}
                  >
                    {cellContent}
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
