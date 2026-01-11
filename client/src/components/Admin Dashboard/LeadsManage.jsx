import React, { useState, useEffect } from "react";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

const LeadsManage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("new");
  const [rms, setRms] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedRM, setSelectedRM] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleAssignLead = (lead) => {
    setSelectedLead(lead);
    setSelectedRM(lead.assignedTo?._id || "");
    setNewStatus(lead.leadStatus || "new");
    setIsAssignModalOpen(true);
  };

  const handleSubmitAssign = async () => {
    const payload = {};

    if (selectedRM) {
      payload.rmId = selectedRM;
    }

    if (newStatus) {
      payload.leadStatus = newStatus;
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
      setNewStatus("");
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.leadStatus === filterStatus);

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
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-6 gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-(--primary)"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No leads found</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="border border-gray-100 rounded-lg p-3 hover:border-gray-300 hover:bg-gray-50 transition duration-150"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {lead.clientName}
                    </h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      #{lead.leadID}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {lead.clientEmail}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {lead.clientPhone}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-xs text-gray-600 mr-1">Status:</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded text-center ${
                        lead.leadStatus === "new"
                          ? "bg-blue-100 text-blue-700"
                          : lead.leadStatus === "contacted"
                          ? "bg-yellow-100 text-yellow-700"
                          : lead.leadStatus === "converted"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {lead.leadStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-xs text-gray-600 mr-1">
                      Interested in:
                    </span>
                    <span className="text-xs">{lead.interestedService}</span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleAssignLead(lead)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap"
                  >
                    <FaEdit size={12} />
                    {lead.assignedTo?.fullName
                      ? "Assign to RM"
                      : "Assigned to RM"}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    {lead.assignedTo?.fullName || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign/Status Modal */}
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
                  htmlFor="status-select"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Change Status
                </label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary)"
                >
                  <option value="">Select status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedLead(null);
                  setSelectedRM("");
                  setNewStatus("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssign}
                disabled={isUpdating || (!selectedRM && !newStatus)}
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
