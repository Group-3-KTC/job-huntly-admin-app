// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";

// export interface FilterField {
//   key: string;
//   label: string;
//   type: "select" | "multiselect" | "date" | "text";
//   options?: string[];
//   placeholder?: string;
//   prefixLabel?: string;
// }

// interface FilterBarProps {
//   filters: FilterField[];
//   onFilterChange: (filters: Record<string, any>) => void;
//   initialValues?: Record<string, any>;
//   onReset?: () => void;
// }

// export const FilterBar = ({
//   filters,
//   onFilterChange,
//   initialValues = {},
//   onReset,
// }: FilterBarProps) => {
//   const [values, setValues] = useState<Record<string, any>>(initialValues);

//   const handleChange = (key: string, value: any) => {
//     const newValues = { ...values, [key]: value };
//     setValues(newValues);
//     onFilterChange(newValues);
//   };

//   const handleReset = () => {
//     setValues({});
//     onFilterChange({});
//     onReset?.();
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-between">
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {filters.map((field) => {
//           const value = values[field.key] ?? "";
//           const placeholder = field.placeholder || field.label;

//           return (
//             <div key={field.key} className="flex flex-col min-w-[200px]">
//               {/* Optional prefix label */}
//               {field.prefixLabel && (
//                 <span className="text-sm font-medium text-gray-700">
//                   {field.prefixLabel}
//                 </span>
//               )}

//               {/* Render input based on type */}
//               {field.type === "text" && (
//                 <input
//                   type="text"
//                   className="border px-3 py-2 rounded min-h-[40px]"
//                   placeholder={placeholder}
//                   value={value}
//                   onChange={(e) => handleChange(field.key, e.target.value)}
//                 />
//               )}

//               {field.type === "date" && (
//                 <input
//                   type="date"
//                   className="border px-3 py-2 rounded min-h-[40px]"
//                   placeholder={placeholder}
//                   value={value}
//                   onChange={(e) => handleChange(field.key, e.target.value)}
//                 />
//               )}

//               {field.type === "select" && (
//                 <select
//                   className="border px-3 py-2 rounded min-h-[40px]"
//                   value={value}
//                   onChange={(e) => handleChange(field.key, e.target.value)}
//                 >
//                   <option value="">{placeholder}</option>
//                   {field.options?.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {field.type === "multiselect" && (
//                 <div className="border px-3 py-2 rounded min-h-[40px] flex flex-wrap gap-2">
//                   {Array.isArray(value) &&
//                     value.map((val: string) => (
//                       <span
//                         key={val}
//                         className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center"
//                       >
//                         {val}
//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleChange(
//                               field.key,
//                               value.filter((v: string) => v !== val)
//                             )
//                           }
//                           className="ml-2 text-red-500 hover:text-red-700"
//                         >
//                           &times;
//                         </button>
//                       </span>
//                     ))}

//                   <select
//                     className="bg-transparent outline-none"
//                     onChange={(e) => {
//                       const selectedValue = e.target.value;
//                       if (selectedValue && !value.includes(selectedValue)) {
//                         handleChange(field.key, [...value, selectedValue]);
//                       }
//                       e.target.selectedIndex = 0; // reset select
//                     }}
//                   >
//                     <option value="">+ Add...</option>
//                     {field.options
//                       ?.filter((opt) => !value.includes(opt))
//                       .map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {onReset && (
//         <button
//           onClick={handleReset}
//           className="mt-4 px-4 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors self-end"
//         >
//           Đặt lại
//         </button>
//       )}
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Calendar,
  MagnifyingGlass,
  List as ListIcon,
  Plus,
  XCircle,
} from "@phosphor-icons/react";

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
                <div className="relative">
                  <ListIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                </div>
              )}

              {/* MULTISELECT */}
              {field.type === "multiselect" && (
                <div className="flex flex-wrap items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg bg-white min-h-[40px]">
                  {Array.isArray(value) &&
                    value.map((val: string) => (
                      <span
                        key={val}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center"
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
                          className="ml-1"
                        >
                          <XCircle
                            size={16}
                            className="text-red-500 hover:text-red-700"
                          />
                        </button>
                      </span>
                    ))}

                  <select
                    className="bg-transparent text-sm text-gray-500 outline-none"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (
                        selectedValue &&
                        !value.includes(selectedValue)
                      ) {
                        handleChange(field.key, [...value, selectedValue]);
                      }
                      e.target.selectedIndex = 0;
                    }}
                  >
                    <option value="">+ Thêm</option>
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
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};
