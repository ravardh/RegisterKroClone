import React from "react";
import { MdClose, MdEdit, MdDelete } from "react-icons/md";

const ViewServiceModal = ({ service, onClose, onEdit, onDelete }) => {
  if (!service) return null;

  const getDisplayName = (entity) => {
    if (!entity) return "";
    if (typeof entity === "string") return entity;
    return entity.name || "";
  };

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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Service Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Service Name
            </label>
            <p className="text-lg text-gray-900">{service.serviceName}</p>
          </div>

          {/* Category and Sub-Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Category
              </label>
              <p className="text-gray-900">
                {getDisplayName(service.category)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Sub-Category
              </label>
              <p className="text-gray-900">
                {getDisplayName(service.subCategory)}
              </p>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Short Description
            </label>
            <p className="text-gray-900">{service.shortDescription}</p>
          </div>

          {/* Is Featured */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Featured Status
            </label>
            <p className="text-gray-900">
              {service.isFeatured ? (
                <span className="text-yellow-600 font-semibold">✓ Featured</span>
              ) : (
                <span className="text-gray-500">Not Featured</span>
              )}
            </p>
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Description
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-48 overflow-y-auto">
              <div
                className="text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.description || "" }}
              />
            </div>
          </div>

          {/* Image */}
          {service.image && (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Service Image
              </label>
              <img
                src={service.image}
                alt={service.serviceName}
                className="max-w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Created At */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Created At
            </label>
            <p className="text-gray-900">{formatDate(service.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(service);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <MdEdit /> Edit
          </button>
          <button
            onClick={() => {
              onDelete(service._id);
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

export default ViewServiceModal;