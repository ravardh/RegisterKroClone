import React, { useEffect, useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdStar,
} from "react-icons/md";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { confirmDialog } from "../../utils/confirmDialog";
import AddServiceModal from "./Modals/AddServiceModal";
import ViewServiceModal from "./Modals/ViewServiceModal";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const getDisplayName = (entity) => {
    if (!entity) return "";
    if (typeof entity === "string") return entity;
    return entity.name || "";
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/services");
      setServices(res.data.data || []);
    } catch (err) {
      console.error("fetchServices", err);
      toast.error("Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };
  const handleEdit = (svc) => {
    setEditingService(svc);
    setIsModalOpen(true);
  };

  const handleSave = (svc) => {
    if (!svc) return;
    if (editingService) {
      setServices((prev) => prev.map((s) => (s._id === svc._id ? svc : s)));
    } else {
      setServices((prev) => [svc, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this service? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/services/${id}`);
          setServices((prev) => prev.filter((s) => s._id !== id));
          toast.success("Service deleted successfully!");
        } catch (err) {
          console.error("deleteService", err);
          toast.error(
            err.response?.data?.message || "Failed to delete service",
          );
        }
      },
      () => {
        // Cancelled
      },
    );
  };

  const handleVisibilityToggle = async (svc) => {
    try {
      const res = await axios.put(`/services/${svc._id}`, {
        isVisible: !svc.isVisible,
      });

      if (res.data?.data) {
        setServices((prev) =>
          prev.map((s) => (s._id === svc._id ? res.data.data : s)),
        );
      }
      toast.success(
        `Service is now ${!svc.isVisible ? "Visible" : "Not Visible"}`,
      );
    } catch (err) {
      console.error("toggleVisibility", err);
      toast.error(err.response?.data?.message || "Failed to update visibility");
    }
  };

  const filtered = services.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (s.serviceName || "").toLowerCase().includes(q) ||
      (s.shortDescription || "").toLowerCase().includes(q) ||
      getDisplayName(s.category).toLowerCase().includes(q) ||
      getDisplayName(s.subCategory).toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-gray-500">
            Create, edit and delete services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="pl-8 pr-3 py-2 border rounded w-64"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
          >
            <MdAdd /> Add Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sub-Category</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            ) : (
              filtered.map((svc) => (
                <tr key={svc._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 align-top">{svc.serviceName}</td>
                  <td className="px-4 py-3 align-top">
                    {getDisplayName(svc.category)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {getDisplayName(svc.subCategory)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {svc.isVisible ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}{" "}
                    | {" "}
                    <button
                      onClick={() => handleVisibilityToggle(svc)}
                      className="text-indigo-600 mr-3"
                      title={
                        svc.isVisible ? "Mark Not Visible" : "Mark Visible"
                      }
                    >
                      {svc.isVisible ? "Hide" : "Show"}
                    </button>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {svc.Featured?.isFeatured ? (
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                        <MdStar className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <button
                      onClick={() => setSelectedService(svc)}
                      className="text-blue-600 mr-3"
                      title="View Details"
                    >
                      <MdVisibility />
                    </button>
                    <button
                      onClick={() => handleEdit(svc)}
                      className="text-blue-600 mr-3"
                      title="Edit Service"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(svc._id)}
                      className="text-red-600"
                      title="Delete Service"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onAddService={handleSave}
        editingService={editingService}
      />

      <ViewServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onEdit={(service) => {
          setEditingService(service);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Services;
