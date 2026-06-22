import React, { useState, useEffect } from "react";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { FaEdit, FaCheckCircle, FaDownload } from "react-icons/fa";
import writeExcelFile from "write-excel-file/browser";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";

const stages = [
  "new",
  "contacted",
  "proposal sent",
  "negotiation",
  "document collected",
  "Application done",
  "In Progress",
  "Completed",
];

const stageColors = {
  new: "bg-gray-100 text-gray-800",
  contacted: "bg-blue-100 text-blue-800",
  "proposal sent": "bg-purple-100 text-purple-800",
  negotiation: "bg-orange-100 text-orange-800",
  "document collected": "bg-yellow-100 text-yellow-800",
  "Application done": "bg-indigo-100 text-indigo-800",
  "In Progress": "bg-cyan-100 text-cyan-800",
  Completed: "bg-green-100 text-green-800",
};

const LeadsManage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState("all");
  const [rms, setRms] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedRM, setSelectedRM] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportStage, setExportStage] = useState("all");

  const {
    data: displayedLeads,
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
  } = useTable(leads, ["clientName", "clientEmail", "clientPhone", "interestedService", "state"], { key: "createdAt", direction: "desc" });

  useEffect(() => {
    fetchLeads();
    fetchRMs();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/leads");
      setLeads(response.data.data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchRMs = async () => {
    try {
      const response = await axios.get("/admin/rm");
      setRms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching RMs:", error);
      toast.error("Failed to load RMs");
    }
  };

  const getCurrentStage = (lead) => {
    if (lead.leadStages && lead.leadStages.length > 0) {
      return lead.leadStages[lead.leadStages.length - 1].stageName;
    }
    return null;
  };

  const handleAssignLead = (lead) => {
    setSelectedLead(lead);
    setSelectedRM(lead.assignedTo?._id || "");
    setSelectedStage(getCurrentStage(lead) || "");
    setIsAssignModalOpen(true);
  };

  const handleSubmitAssign = async () => {
    const payload = {};

    if (selectedRM) {
      payload.rmId = selectedRM;
    }

    if (selectedStage) {
      payload.stageName = selectedStage;
    }

    if (Object.keys(payload).length === 0) {
      toast.error("Please make a selection");
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(`/admin/leads/${selectedLead._id}/assign`, payload);
      toast.success("Lead updated successfully");
      setIsAssignModalOpen(false);
      setSelectedLead(null);
      setSelectedRM("");
      setSelectedStage("");
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    } finally {
      setIsUpdating(false);
    }
  };

  const finalFilteredLeads = displayedLeads.filter(
    (lead) => filterStage === "all" || getCurrentStage(lead) === filterStage
  );

  const handleDownloadExcel = async () => {
    const exportLeads = leads.filter((lead) => {
      if (exportStage !== "all" && getCurrentStage(lead) !== exportStage) return false;
      if (exportStartDate || exportEndDate) {
        const created = new Date(lead.createdAt);
        const start = exportStartDate ? new Date(exportStartDate) : null;
        const end = exportEndDate ? new Date(exportEndDate) : null;
        if (end) end.setHours(23, 59, 59, 999);
        if (start && created < start) return false;
        if (end && created > end) return false;
      }
      return true;
    });

    if (exportLeads.length === 0) {
      toast.error("No leads found for the selected date range");
      return;
    }
    const rows = exportLeads.map((lead) => ({
      "Service ID": lead.serviceID || lead.leadID || "",
      "Client Name": lead.clientName || "",
      "Email": lead.clientEmail || "",
      "Phone": lead.clientPhone || "",
      "Interested Service": lead.interestedService || "",
      "Selected Package": lead.selectedPackage || "",
      "State": lead.state || "",
      "Assigned RM": lead.assignedTo?.fullName || "Not Assigned",
      "Current Stage": getCurrentStage(lead) || "No Stage",
      "Stage History": (lead.leadStages || []).map((s) => s.stageName).join(" → "),
      "Close Remarks": lead.closeRemarks || "",
      "Created At": lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "",
    }));
    const headers = Object.keys(rows[0]);
    const sheetData = [
      headers,
      ...rows.map((row) => headers.map((key) => row[key] ?? "")),
    ];
    const fileName = `Leads_${exportStartDate || "all"}_to_${exportEndDate || "all"}.xlsx`;
    await writeExcelFile(sheetData, { sheet: "Leads" }).toFile(fileName);
    toast.success(`Exported ${exportLeads.length} lead(s)`);
    setIsExportModalOpen(false);
    setExportStartDate("");
    setExportEndDate("");
    setExportStage("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary) mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-500 mt-1">Track client interest, assign RMs, and monitor conversion stages</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search leads..." 
          />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          >
            <option value="all">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <FaDownload size={12} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Client Details" sortKey="clientName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Service & State" sortKey="interestedService" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Current Stage" sortKey="leadStages.length" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Assigned To" sortKey="assignedTo.fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Created At" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : finalFilteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {leads.length === 0 ? "No leads found." : "No leads match your criteria."}
                  </td>
                </tr>
              ) : (
                finalFilteredLeads.map((lead) => {
                  const currentStage = getCurrentStage(lead);
                  return (
                    <tr key={lead._id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-4 py-4 border-r border-gray-50">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{lead.clientName}</span>
                          <span className="text-xs text-blue-600 font-medium">#{lead.serviceID || lead.leadID}</span>
                          <div className="flex flex-col mt-1 text-[11px] text-gray-500">
                            <span>{lead.clientEmail}</span>
                            <span>{lead.clientPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-50">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-bold border border-indigo-100 self-start">
                            {lead.interestedService}
                          </span>
                          <span className="text-xs font-semibold text-gray-600">
                            State: <span className="text-blue-600">{lead.state || "N/A"}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-50 text-center">
                        <span
                          className={clsx(
                            "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                            stageColors[currentStage] || "bg-gray-100 text-gray-700 border border-gray-200"
                          )}
                        >
                          {currentStage || "No Stage"}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-50 text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {lead.assignedTo?.fullName || (
                            <span className="text-gray-400 italic">Not Assigned</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-50 text-gray-500 font-medium">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleAssignLead(lead)}
                          className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-1 mx-auto"
                        >
                          <FaEdit size={12} /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && leads.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={finalFilteredLeads.length}
          />
        )}
      </div>

      {/* Export Excel Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Export Leads to Excel</h3>
            <p className="text-xs text-gray-500 mb-5">
              Leave fields empty to export all leads.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={exportStage}
                  onChange={(e) => setExportStage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Stages</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={exportEndDate}
                  min={exportStartDate || undefined}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsExportModalOpen(false);
                  setExportStartDate("");
                  setExportEndDate("");
                  setExportStage("all");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
              >
                <FaDownload size={12} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign/Stage Modal */}
      {isAssignModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Manage Lead
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Lead: {selectedLead.clientName}
                </label>
              </div>

              <div>
                <label
                  htmlFor="rm-select"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Assign to RM
                </label>
                <select
                  id="rm-select"
                  value={selectedRM}
                  onChange={(e) => setSelectedRM(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary)"
                >
                  <option value="">Select an RM</option>
                  {rms.map((rm) => (
                    <option key={rm._id} value={rm._id}>
                      {rm.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="stage-select"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Update Stage
                </label>
                <select
                  id="stage-select"
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary)"
                >
                  <option value="">Select stage</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedLead(null);
                  setSelectedRM("");
                  setSelectedStage("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssign}
                disabled={isUpdating || (!selectedRM && !selectedStage)}
                className="flex-1 px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary-hover) transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isUpdating ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManage;
