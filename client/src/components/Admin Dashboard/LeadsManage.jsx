import React, { useState, useEffect } from "react";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { FaEdit, FaCheckCircle } from "react-icons/fa";

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

  const filteredLeads =
    filterStage === "all"
      ? leads
      : leads.filter((lead) => getCurrentStage(lead) === filterStage);

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
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-(--primary)"
        >
          <option value="all">All</option>
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No leads found</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const currentStage = getCurrentStage(lead);
            return (
              <div
                key={lead._id}
                className="border border-gray-100 rounded-lg p-3 hover:border-gray-300 hover:bg-gray-50 transition duration-150"
              >
                <div className="flex justify-between items-start gap-3 flex-wrap md:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {lead.clientName}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0">
                        #{lead.serviceID || lead.leadID}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {lead.clientEmail}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {lead.clientPhone}
                    </p>
                  </div>
                  <div className="space-y-2 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-xs text-gray-600">Current Stage:</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded text-center ${
                          stageColors[currentStage] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {currentStage || "No Stage"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-xs text-gray-600">Service:</span>
                      <span className="text-xs">{lead.interestedService}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-xs text-gray-600">State:</span>
                      <span className="text-xs font-semibold text-blue-600">{lead.state || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <button
                      onClick={() => handleAssignLead(lead)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap"
                    >
                      <FaEdit size={12} />
                      Manage
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      {lead.assignedTo?.fullName || "Not assigned"}
                    </p>
                  </div>
                </div>

                {/* Stage History */}
                {lead.leadStages && lead.leadStages.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Stage History:
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {lead.leadStages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-0.5">
                          <FaCheckCircle size={10} className="text-green-600" />
                          <span className="text-xs text-gray-600">
                            {stage.stageName}
                          </span>
                          {idx < lead.leadStages.length - 1 && (
                            <span className="text-gray-300 mx-0.5">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

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
