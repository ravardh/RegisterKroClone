import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaEdit, FaEye, FaFilter } from "react-icons/fa";
import ViewLeadModal from "./Modals/ViewLeadModal";

const dummyLeads = [
  {
    leadID: "LD001",
    clientName: "John Smith",
    clientEmail: "john.smith@example.com",
    clientPhone: "+1 234-567-8900",
    interestedService: "Company Registration",
    leadStatus: "new",
    createdAt: "2026-01-08T10:30:00Z",
  },
  {
    leadID: "LD002",
    clientName: "Sarah Johnson",
    clientEmail: "sarah.j@example.com",
    clientPhone: "+1 234-567-8901",
    interestedService: "GST Registration",
    leadStatus: "contacted",
    createdAt: "2026-01-07T14:20:00Z",
  },
  {
    leadID: "LD003",
    clientName: "Michael Brown",
    clientEmail: "m.brown@example.com",
    clientPhone: "+1 234-567-8902",
    interestedService: "Income Tax Filing",
    leadStatus: "qualified",
    createdAt: "2026-01-06T09:15:00Z",
  },
  {
    leadID: "LD004",
    clientName: "Emily Davis",
    clientEmail: "emily.davis@example.com",
    clientPhone: "+1 234-567-8903",
    interestedService: "Trademark Registration",
    leadStatus: "converted",
    createdAt: "2026-01-05T16:45:00Z",
  },
  {
    leadID: "LD005",
    clientName: "Robert Wilson",
    clientEmail: "r.wilson@example.com",
    clientPhone: "+1 234-567-8904",
    interestedService: "Accounting Services",
    leadStatus: "new",
    createdAt: "2026-01-09T11:00:00Z",
  },
  {
    leadID: "LD006",
    clientName: "Jessica Martinez",
    clientEmail: "jessica.m@example.com",
    clientPhone: "+1 234-567-8905",
    interestedService: "Business Consulting",
    leadStatus: "contacted",
    createdAt: "2026-01-04T13:30:00Z",
  },
  {
    leadID: "LD007",
    clientName: "David Anderson",
    clientEmail: "d.anderson@example.com",
    clientPhone: "+1 234-567-8906",
    interestedService: "FSSAI Registration",
    leadStatus: "unqualified",
    createdAt: "2026-01-03T10:20:00Z",
  },
];

const statuses = ["new", "contacted", "qualified", "converted", "unqualified"];

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-300",
  qualified: "bg-purple-100 text-purple-800 border-purple-300",
  converted: "bg-green-100 text-green-800 border-green-300",
  unqualified: "bg-red-100 text-red-800 border-red-300",
};

const LeadStatus = () => {
  const [leads, setLeads] = useState(dummyLeads);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.leadStatus === filterStatus);

  const handleStatusChange = (leadID, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.leadID === leadID ? { ...lead, leadStatus: newStatus } : lead
      )
    );
  };

  const viewLeadDetails = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lead Management</h1>
        <p className="text-gray-600">Track and manage your assigned leads</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">New</div>
          <div className="text-2xl font-bold text-blue-600">
            {leads.filter((l) => l.leadStatus === "new").length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Contacted</div>
          <div className="text-2xl font-bold text-yellow-600">
            {leads.filter((l) => l.leadStatus === "contacted").length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Qualified</div>
          <div className="text-2xl font-bold text-purple-600">
            {leads.filter((l) => l.leadStatus === "qualified").length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Converted</div>
          <div className="text-2xl font-bold text-green-600">
            {leads.filter((l) => l.leadStatus === "converted").length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Unqualified</div>
          <div className="text-2xl font-bold text-red-600">
            {leads.filter((l) => l.leadStatus === "unqualified").length}
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <FaFilter className="text-gray-600" />
          <span className="font-medium text-gray-700">Filter by Status:</span>
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({leads.length})
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} ({leads.filter((l) => l.leadStatus === status).length})
            </button>
          ))}
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lead ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.leadID}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.leadID}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.clientName}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <FaEnvelope className="mr-1" />
                        {lead.clientEmail}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaPhone className="mr-1" />
                        {lead.clientPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {lead.interestedService}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.leadStatus}
                      onChange={(e) =>
                        handleStatusChange(lead.leadID, e.target.value)
                      }
                      className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize cursor-pointer ${
                        statusColors[lead.leadStatus]
                      }`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => viewLeadDetails(lead)}
                      className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FaEye className="mr-2" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <ViewLeadModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedLead={selectedLead}
      />
    </div>
  );
};

export default LeadStatus;