import React, { useEffect, useState } from "react";
import { MdDelete, MdDownload, MdPerson, MdPhone, MdWork } from "react-icons/md";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { confirmDialog } from "../../utils/confirmDialog";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const CareersManage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    data: displayedApplications,
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
  } = useTable(applications, ["fullName", "mobile", "designation", "status"], {
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/careers");
      setApplications(res.data.data || []);
    } catch (err) {
      console.error("fetchApplications", err);
      toast.error("Failed to load career applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.patch(`/admin/careers/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? res.data.data : app))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error("updateCareerStatus", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this application? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/admin/careers/${id}`);
          setApplications((prev) => prev.filter((app) => app._id !== id));
          toast.success("Application deleted successfully");
        } catch (err) {
          console.error("deleteCareer", err);
          toast.error(err.response?.data?.message || "Failed to delete application");
        }
      },
      () => {}
    );
  };

  const getResumeUrl = (filename) => {
    if (!filename) return "#";
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    return `${base}/uploads/resumes/${filename}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Applications</h1>
          <p className="text-gray-500 mt-1">View and manage job applications from the careers page</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search candidates..."
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Candidate" sortKey="fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Mobile" sortKey="mobile" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Designation" sortKey="designation" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Applied At" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {applications.length === 0
                      ? "No applications found."
                      : "No applications match your search."}
                  </td>
                </tr>
              ) : (
                displayedApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-blue-500" />
                        {application.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MdPhone className="text-gray-400" />
                        <a href={`tel:${application.mobile}`} className="text-blue-600 hover:underline">
                          {application.mobile}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MdWork className="text-gray-400" />
                        {application.designation}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                        className={clsx(
                          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-0 outline-none cursor-pointer",
                          statusStyles[application.status] || "bg-gray-100 text-gray-800"
                        )}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-medium">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={getResumeUrl(application.resume)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <MdDownload size={20} />
                        </a>
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && applications.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedApplications.length}
          />
        )}
      </div>
    </div>
  );
};

export default CareersManage;
