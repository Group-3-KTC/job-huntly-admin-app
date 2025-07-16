/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "text";
  options?: string[];
}

interface FilterBarProps {
  filters: FilterField[];
  onFilterChange: (filters: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  onReset?: () => void;
}

export const FilterBar = ({
  filters,
  onFilterChange,
  initialValues = {},
  onReset,
}: FilterBarProps) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onFilterChange(newValues);
  };

  const handleReset = () => {
    setValues({});
    onFilterChange({});
    onReset?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {filters.map((field) => {
          const value = values[field.key] || "";

          switch (field.type) {
            case "select":
              return (
                <div key={field.key} className="relative">
                  <select
                    key={field.key}
                    className="border px-3 py-2 rounded"
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  >
                    <option value="">{field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );

            case "multiselect":
              return (
                <div key={field.key} className="relative">
                  <select
                    key={field.key}
                    multiple
                    className="border px-3 py-2 rounded"
                    value={Array.isArray(value) ? value : []}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      handleChange(field.key, selected);
                    }}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );

            case "date":
              return (
                <div key={field.key} className="relative">
                  <input
                    key={field.key}
                    type="date"
                    className="border px-3 py-2 rounded"
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.label}
                  />
                </div>
              );

            case "text":
            default:
              return (
                <div key={field.key} className="relative">
                  <input
                    key={field.key}
                    type="text"
                    className="border px-3 py-2 rounded"
                    placeholder={field.label}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              );
          }
        })}
      </div>

      {onReset && (
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          Đặt lại
        </button>
      )}
    </div>
  );
};
