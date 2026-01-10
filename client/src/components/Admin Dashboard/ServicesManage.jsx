import React, { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
import axios from "../../config/api";
import AddServiceModal from "./Modals/AddServiceModal";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/services/services");
      setServices(res.data.data || []);
    } catch (err) {
      console.error("fetchServices", err);
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
    if (!window.confirm("Delete this service?")) return;
    try {
      await axios.delete(`/services/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("deleteService", err);
      alert(err.response?.data?.message || "Failed to delete service");
    }
  };

  const filtered = services.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (s.serviceName || "").toLowerCase().includes(q) ||
      (s.shortDescription || "").toLowerCase().includes(q) ||
      (s.category || "").toLowerCase().includes(q) ||
      (s.subCategory || "").toLowerCase().includes(q)
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
                  <td className="px-4 py-3 align-top">{svc.category}</td>
                  <td className="px-4 py-3 align-top">{svc.subCategory}</td>
                  <td className="px-4 py-3 align-top">
                    <button
                      onClick={() => handleEdit(svc)}
                      className="text-blue-600 mr-3"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(svc._id)}
                      className="text-red-600"
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
    </div>
  );
};

export default Services;
