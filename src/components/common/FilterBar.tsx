/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "text";
  options?: string[];
  placeholder?: string;
  prefixLabel?: string;
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-between">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filters.map((field) => {
          const value = values[field.key] ?? "";
          const placeholder = field.placeholder || field.label;

          return (
            <div key={field.key} className="flex flex-col min-w-[200px]">
              {/* Optional prefix label */}
              {field.prefixLabel && (
                <span className="text-sm font-medium text-gray-700">
                  {field.prefixLabel}
                </span>
              )}

              {/* Render input based on type */}
              {field.type === "text" && (
                <input
                  type="text"
                  className="border px-3 py-2 rounded min-h-[40px]"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  className="border px-3 py-2 rounded min-h-[40px]"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}

              {field.type === "select" && (
                <select
                  className="border px-3 py-2 rounded min-h-[40px]"
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">{placeholder}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "multiselect" && (
                <div className="border px-3 py-2 rounded min-h-[40px] flex flex-wrap gap-2">
                  {Array.isArray(value) &&
                    value.map((val: string) => (
                      <span
                        key={val}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              field.key,
                              value.filter((v: string) => v !== val)
                            )
                          }
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}

                  <select
                    className="bg-transparent outline-none"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue && !value.includes(selectedValue)) {
                        handleChange(field.key, [...value, selectedValue]);
                      }
                      e.target.selectedIndex = 0; // reset select
                    }}
                  >
                    <option value="">+ Add...</option>
                    {field.options
                      ?.filter((opt) => !value.includes(opt))
                      .map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onReset && (
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors self-end"
        >
          Đặt lại
        </button>
      )}
    </div>
  );
};
