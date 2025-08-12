/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Calendar,
  MagnifyingGlass,
  List as ListIcon,
  XCircle,
  CaretDown,
  Check,
} from "@phosphor-icons/react";
import { Listbox } from "@headlessui/react";
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
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filters.map((field) => {
          const value = values[field.key] ?? "";
          const placeholder = field.placeholder || field.label;

          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-800">
                {field.prefixLabel || field.label}
              </label>

              {/* TEXT INPUT */}
              {field.type === "text" && (
                <div className="relative">
                  <MagnifyingGlass
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              )}

              {/* DATE INPUT */}
              {field.type === "date" && (
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="date"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              )}

              {/* SELECT INPUT */}
              {field.type === "select" && (
                <Listbox
                  value={field.options?.find((opt) => opt === value) || ""}
                  onChange={(val) => handleChange(field.key, val)}
                >
                  <div className="relative">
                    <Listbox.Button className="h-10 w-full pl-10 pr-8text-sm bg-white border border-gray-300 rounded-lg text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200">
                      <ListIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <span className="block truncate">
                        {value || placeholder}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <CaretDown
                          className="h-4 w-4 text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    {/* Danh sách Options */}
                    <Listbox.Options className="absolute mt-1 w-full p-2 rounded-lg bg-white text-sm shadow-lg ring-1 ring-gray-200 focus:outline-none z-10">
                      {field.options?.map((opt) => (
                        <Listbox.Option
                          key={opt}
                          value={opt}
                          className={({ active }) =>
                            `relative cursor-pointer font-semibold rounded-sm select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-50 text-blue-800"
                                : "text-gray-700"
                            }`
                          }
                        >
                          {opt}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              )}

              {/* MULTISELECT */}
              {field.type === "multiselect" && (
                <div className="flex flex-wrap items-center gap-2 border border-gray-300 px-3 rounded-lg bg-white min-h-[40px] w-full">
                  {/* Hiển thị tag */}
                  {Array.isArray(value) &&
                    value.map((val: string) => (
                      <span
                        key={val}
                        className="bg-blue-100 text-blue-700 px-2 mt-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              field.key,
                              value.filter((v: string) => v !== val),
                            )
                          }
                          className="ml-1"
                        >
                          <XCircle
                            size={16}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          />
                        </button>
                      </span>
                    ))}

                  {/* Listbox cho multiselect */}
                  <Listbox
                    value={null}
                    onChange={(selectedValue) => {
                      if (selectedValue && !value.includes(selectedValue)) {
                        handleChange(field.key, [...value, selectedValue]);
                      }
                    }}
                  >
                    <div className="relative w-full">
                      <Listbox.Button className="flex items-center  justify-between h-8 bg-transparent text-sm text-gray-500 outline-none w-full">
                        + Add
                        <CaretDown className="h-4 w-4 text-gray-500" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 p-2 mt-1 font-semibold w-full bg-white border border-gray-200 rounded-lg shadow-lg text-sm max-h-40 overflow-auto">
                        {field.options
                          ?.filter((opt) => !value.includes(opt))
                          .map((opt) => (
                            <Listbox.Option
                              key={opt}
                              value={opt}
                              className={({ active }) =>
                                `cursor-pointer select-none rounded-sm  py-1.5 px-3 ${
                                  active
                                    ? "bg-blue-50 text-blue-800"
                                    : "text-gray-700"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <div className="flex items-center justify-between">
                                  <span>{opt}</span>
                                  {selected && (
                                    <Check className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onReset && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};
