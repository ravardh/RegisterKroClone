import React from "react";
import { MdClose, MdEmail, MdPhone, MdPerson, MdDelete } from "react-icons/md";

const ViewContactDetailsModal = ({ contact, onClose, onDelete }) => {
  if (!contact) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Contact Submission Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Full Name
            </label>
            <div className="flex items-center gap-2 text-gray-900">
              <MdPerson className="text-gray-400 text-xl" />
              <span className="text-lg">{contact.fullName}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <MdEmail className="text-gray-400 text-xl" />
              <a
                href={`mailto:${contact.email}`}
                className="text-lg text-blue-600 hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              <MdPhone className="text-gray-400 text-xl" />
              <a
                href={`tel:${contact.phone}`}
                className="text-lg text-blue-600 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Message
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed break-all">
                {contact.message}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Submitted At
            </label>
            <p className="text-gray-900">{formatDate(contact.createdAt)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onDelete(contact._id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <MdDelete /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewContactDetailsModal;