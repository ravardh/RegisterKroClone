import { useState, useMemo } from "react";

/**
 * Custom hook for handling table logic: sorting, searching, and pagination.
 * @param {Array} data - The raw data array.
 * @param {Array} searchFields - Fields to search in.
 * @param {Object} initialSort - Initial sort configuration { key, direction }.
 */
export const useTable = (data = [], searchFields = [], initialSort = { key: "", direction: "asc" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 1. Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const query = searchTerm.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return String(value || "").toLowerCase().includes(query);
      })
    );
  }, [data, searchTerm, searchFields]);

  // 2. Sort data
  const sortedData = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = key.split('.').reduce((obj, k) => obj?.[k], a);
      const bValue = key.split('.').reduce((obj, k) => obj?.[k], b);

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 3. Paginate data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleRowsPerPageChange = (count) => {
    setRowsPerPage(Number(count));
    setCurrentPage(1);
  };

  return {
    data: paginatedData,
    totalItems: sortedData.length,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    handleRowsPerPageChange,
    searchTerm,
    handleSearch,
    sortConfig,
    requestSort,
  };
};
