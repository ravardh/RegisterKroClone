import React from "react";
import { MdArrowUpward, MdArrowDownward, MdChevronLeft, MdChevronRight } from "react-icons/md";
import clsx from "clsx";

export const SortableHeader = ({ label, sortKey, currentSort, onSort, className }) => {
  const isActive = currentSort.key === sortKey;
  
  return (
    <th 
      className={clsx(
        "px-4 py-4 font-bold text-xs uppercase tracking-wider cursor-pointer select-none transition-all hover:bg-gray-100 border-b-2 border-gray-100",
        isActive ? "bg-blue-50/50 text-blue-700 border-blue-600" : "text-gray-500",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        <div className="flex flex-col text-[10px] shrink-0">
          <MdArrowUpward className={clsx(
            "transition-all duration-200",
            isActive && currentSort.direction === "asc" ? "text-blue-600 scale-125" : "text-gray-300 opacity-50"
          )} />
          <MdArrowDownward className={clsx(
            "transition-all duration-200",
            isActive && currentSort.direction === "desc" ? "text-blue-600 scale-125" : "text-gray-300 opacity-50"
          )} />
        </div>
      </div>
    </th>
  );
};

export const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  rowsPerPage, 
  onRowsPerPageChange,
  totalItems,
  showingCount 
}) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{showingCount}</span> of <span className="font-semibold text-gray-900">{totalItems}</span> results
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 border-l pl-4">
          <span>Rows per page:</span>
          <select 
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={clsx(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                  currentPage === pageNum 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all shadow-sm hover:shadow-md"
    />
  </div>
);
