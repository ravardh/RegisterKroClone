import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaEdit, FaCheckCircle } from "react-icons/fa";
import axios from "../../config/api";
import toast from "react-hot-toast";

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
  new: "bg-gray-100 text-gray-800 border-gray-300",
  contacted: "bg-blue-100 text-blue-800 border-blue-300",
  "proposal sent": "bg-purple-100 text-purple-800 border-purple-300",
  negotiation: "bg-orange-100 text-orange-800 border-orange-300",
  "document collected": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Application done": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "In Progress": "bg-cyan-100 text-cyan-800 border-cyan-300",
  Completed: "bg-green-100 text-green-800 border-green-300",
};

const LeadStatus = () => {
  const [leads, setLeads] = useState([]);
  const [filterStage, setFilterStage] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/rm/leads`);
      const data = res?.data?.data;
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast.error("Failed to load assigned leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStage = (lead) => {
    if (lead.leadStages && lead.leadStages.length > 0) {
      return lead.leadStages[lead.leadStages.length - 1].stageName;
    }
    return null;
  };

  const filteredLeads = leads.filter((lead) => {
    if (filterStage === "all") return true;
    return getCurrentStage(lead) === filterStage;
  });

  const handleStageChange = async (leadId, newStage) => {
    try {
      const payload = { stageName: newStage };
      await axios.put(`/rm/update-stage/${leadId}`, payload);
      toast.success("Lead stage updated successfully");
      setEditingLead(null);
      setSelectedStage("");
      fetchLeads();
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error(error.response?.data?.message || "Failed to update stage");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading your leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Lead Management</h1>
        <p className="text-sm text-gray-500">Track and update your assigned leads</p>
      </div>

      
      <div className="border border-gray-100 rounded-lg p-4 mb-6 bg-gray-50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-700 text-sm">Filter:</span>
          <button
            onClick={() => setFilterStage("all")}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              filterStage === "all"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            All ({leads.length})
          </button>
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filterStage === stage
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {stage} ({leads.filter((l) => getCurrentStage(l) === stage).length})
            </button>
          ))}
        </div>
      </div>

      
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 border border-gray-100 rounded-lg">
          <p className="text-gray-500 text-sm">No leads found in this stage</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const currentStage = getCurrentStage(lead);
            return (
              <div
                key={lead._id}
                className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition"
              >
                <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
                  {/* Lead Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {lead.clientName}
                      </h3>
                      <span className="text-xs text-gray-400">#{lead.leadID}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <FaEnvelope className="text-gray-400" />
                        <a href={`mailto:${lead.clientEmail}`} className="hover:text-blue-600">
                          {lead.clientEmail}
                        </a>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <FaPhone className="text-gray-400" />
                        <a href={`tel:${lead.clientPhone}`} className="hover:text-blue-600">
                          {lead.clientPhone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {lead.interestedService}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Stage and Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap md:flex-nowrap">
                    {editingLead === lead._id ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={selectedStage}
                          onChange={(e) => setSelectedStage(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Select stage</option>
                          {stages.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleStageChange(lead._id, selectedStage)}
                          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingLead(null);
                            setSelectedStage("");
                          }}
                          className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded border ${
                            stageColors[currentStage] || "bg-gray-100 text-gray-800 border-gray-300"
                          }`}
                        >
                          {currentStage || "No Stage"}
                        </span>
                        <button
                          onClick={() => {
                            setEditingLead(lead._id);
                            setSelectedStage(currentStage || "");
                          }}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stage History */}
                {lead.leadStages && lead.leadStages.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-2">Stage History:</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {lead.leadStages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <FaCheckCircle size={12} className="text-green-600" />
                          <span className="text-xs text-gray-600">{stage.stageName}</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(stage.updatedAt)}
                          </span>
                          {idx < lead.leadStages.length - 1 && (
                            <span className="text-gray-300 ml-1">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeadStatus;