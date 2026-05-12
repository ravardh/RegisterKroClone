import React, { useState, useEffect } from "react";
import axios from "../../config/api";
import { toast } from "react-hot-toast";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";
import { MdStar } from "react-icons/md";

const FeedbackManage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    data: displayedFeedbacks,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    handleRowsPerPageChange,
    searchTerm,
    handleSearch,
    sortConfig,
    requestSort,
  } = useTable(feedbacks, ["fullName", "email", "serviceAvailed.serviceName", "message"], { key: "status", direction: "asc" });

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/admin/feedbacks");
      setFeedbacks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const approveFeedback = async (id) => {
    try {
      const res = await axios.patch(`/admin/feedbacks/${id}/approve`);
      const updated = res.data.data;
      setFeedbacks((prev) => prev.map((fb) => (fb._id === id ? updated : fb)));
      toast.success("Feedback approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve feedback");
    }
  };

  const rejectFeedback = async (id) => {
    try {
      await axios.delete(`/admin/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
      toast.success("Feedback rejected and removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject feedback");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedbacks</h1>
          <p className="text-gray-500 mt-1">Manage user reviews and service feedback</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search feedbacks..." 
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="User" sortKey="fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Email" sortKey="email" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Service" sortKey="serviceAvailed.serviceName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Rating" sortKey="starRating" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Message" sortKey="message" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading feedbacks...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500 italic">
                    {feedbacks.length === 0 ? "No feedbacks found." : "No feedbacks match your search."}
                  </td>
                </tr>
              ) : (
                displayedFeedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-50">
                      {fb.fullName}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 text-gray-600">
                      {fb.email}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                        {fb.serviceAvailed?.serviceName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold">
                        {fb.starRating} <MdStar className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 max-w-xs">
                      <p className="text-sm text-gray-700 line-clamp-2 italic" title={fb.message}>
                        "{fb.message}"
                      </p>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <span
                        className={clsx(
                          "px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border",
                          fb.status === "approved"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        )}
                      >
                        {fb.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approveFeedback(fb._id)}
                          className={clsx(
                            "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                            fb.status === "approved"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:scale-95"
                          )}
                          disabled={fb.status === "approved"}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectFeedback(fb._id)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && feedbacks.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedFeedbacks.length}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackManage;
