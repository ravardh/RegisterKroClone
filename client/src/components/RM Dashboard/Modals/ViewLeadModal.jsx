import React from "react";
import { FaPhone, FaEnvelope, FaEdit } from "react-icons/fa";

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-300",
  qualified: "bg-purple-100 text-purple-800 border-purple-300",
  converted: "bg-green-100 text-green-800 border-green-300",
  unqualified: "bg-red-100 text-red-800 border-red-300",
};

const ViewLeadModal = ({ showModal, setShowModal, selectedLead }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!showModal || !selectedLead) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Lead Details</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Service ID
              </label>
              <div className="text-lg font-medium text-gray-900">
                {selectedLead.serviceID || selectedLead.leadID}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Status
              </label>
              <div
                className={`inline-block px-3 mx-3 py-1 text-sm font-semibold rounded-full capitalize ${
                  statusColors[selectedLead.leadStatus]
                }`}
              >
                {selectedLead.leadStatus}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Client Name
            </label>
            <div className="text-lg font-medium text-gray-900">
              {selectedLead.clientName}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Interested Service
            </label>
            <div className="text-lg font-medium text-gray-900">
              {selectedLead.interestedService}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              State
            </label>
            <div className="text-lg font-semibold text-blue-600">
              {selectedLead.state || "N/A"}
            </div>
          </div>

                    <div>
            <label className="text-sm font-semibold text-gray-600">
              Email
            </label>
            <div className="text-gray-900 flex items-center">
              <FaEnvelope className="mr-2 text-indigo-600" />
              {selectedLead.clientEmail}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Phone
            </label>
            <div className="text-gray-900 flex items-center">
              <FaPhone className="mr-2 text-indigo-600" />
              {selectedLead.clientPhone}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Created Date
            </label>
            <div className="text-gray-900">
              {formatDate(selectedLead.createdAt)}
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary-hover) transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadModal;
