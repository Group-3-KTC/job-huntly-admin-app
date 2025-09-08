import React, { useState, useMemo } from "react";
import { ArrowFatLeft, ArrowFatRight, CaretDown } from "@phosphor-icons/react";
import { Listbox } from "@headlessui/react";
import type { JSX } from "react/jsx-runtime";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
}

const itemsPerPageOptions = [
  { value: 10 },
  { value: 20 },
  { value: 50 },
  { value: 100 },
];

export default function Pagination({
  currentPage,
  totalPages: propsTotalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
}: PaginationProps) {
  const [jumpToPage, setJumpToPage] = useState<string>("");
  
  // Tính toán totalPages nếu không được cung cấp
  const totalPages = useMemo(() => {
    return propsTotalPages || Math.ceil(totalItems / itemsPerPage);
  }, [propsTotalPages, totalItems, itemsPerPage]);

  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(jumpToPage);
      if (pageNumber >= 1 && pageNumber <= totalPages && !isNaN(pageNumber)) {
        onPageChange(pageNumber);
        setJumpToPage("");
      } else {
        setJumpToPage(currentPage.toString());
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpToPage(e.target.value);
  };

  const renderPageButton = (page: number) => (
    <button
      key={`page-${page}`}
      onClick={() => onPageChange(page)}
      disabled={currentPage === page}
      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
        currentPage === page
          ? "bg-blue-500 text-white cursor-default"
          : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
      }`}
      aria-label={`Go to page ${page}`}
    >
      {page}
    </button>
  );

  const getPageNumbers = () => {
    const pages: JSX.Element[] = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.push(renderPageButton(i));
    } else {
      pages.push(renderPageButton(1));
      if (currentPage > 3) {
        pages.push(
          <span
            key="dots-left"
            className="w-9 h-9 flex items-center justify-center text-gray-500"
          >
            ...
          </span>,
        );
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (i !== 1 && i !== totalPages) pages.push(renderPageButton(i));
      }
      if (currentPage < totalPages - 2) {
        pages.push(
          <span
            key="dots-right"
            className="w-9 h-9 flex items-center justify-center text-gray-500"
          >
            ...
          </span>,
        );
      }
      pages.push(renderPageButton(totalPages));
    }
    return pages;
  };

  return (
    <div className="min-w-full flex items-center justify-center gap-4 py-4 bg-white border-t border-gray-200 mt-6 rounded-xl shadow-lg max-w-lg mx-auto mb-8">
      {showItemsPerPage && (
        <Listbox
          value={itemsPerPageOptions.find((opt) => opt.value === itemsPerPage)}
          onChange={(opt) => onItemsPerPageChange(opt.value)}
        >
          <div className="relative">
            <Listbox.Button className="h-9 w-20 pl-3 pr-6 text-sm font-medium bg-white border border-gray-200 rounded-lg text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200">
              <span className="block truncate">{itemsPerPage}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <CaretDown
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute bottom-10 w-20 rounded-lg bg-white text-sm font-medium shadow-lg ring-1 ring-gray-200 focus:outline-none z-10">
              {itemsPerPageOptions.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-1.5 pl-3 pr-4 ${
                      active ? "bg-blue-50 text-blue-800" : "text-gray-700"
                    }`
                  }
                  value={opt}
                >
                  {opt.value}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      )}

      <div className="flex min-w-[300px] items-center gap-1.5 rounded-full px-2 py-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous page"
        >
          <ArrowFatLeft size={18} weight="bold" />
        </button>

        {getPageNumbers()}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next page"
        >
          <ArrowFatRight size={18} weight="bold" />
        </button>

        <div className="flex w-auto items-center gap-1.5">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage || currentPage}
            onChange={handleInputChange}
            onKeyDown={handleJumpToPage}
            onFocus={() => setJumpToPage("")}
            className="w-12 h-8 text-sm text-center text-gray-700 bg-transparent border border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            aria-label="Jump to page"
          />
          <span className="text-sm text-gray-600 leading-9">
            / {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}