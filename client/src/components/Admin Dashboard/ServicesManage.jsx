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
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const {
    data: displayedServices,
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
  } = useTable(services, ["serviceName", "shortDescription", "category.name", "subCategory.name"], { key: "serviceName", direction: "asc" });

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


  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1">Manage your platform services, categories, and visibility</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search services..." 
          />
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <MdAdd className="w-5 h-5" /> Add Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Service Name" sortKey="serviceName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Category" sortKey="category.name" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Sub-Category" sortKey="subCategory.name" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Visibility" sortKey="isVisible" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Featured" sortKey="Featured.isFeatured" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading services...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {services.length === 0 ? "No services found." : "No services match your search."}
                  </td>
                </tr>
              ) : (
                displayedServices.map((svc) => (
                  <tr key={svc._id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-50">
                      {svc.serviceName}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                        {getDisplayName(svc.category)}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                        {getDisplayName(svc.subCategory)}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVisibilityToggle(svc)}
                          className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                            svc.isVisible ? "bg-green-500" : "bg-gray-300"
                          )}
                          title={svc.isVisible ? "Set to Hidden" : "Set to Visible"}
                        >
                          <span className="sr-only">Toggle visibility</span>
                          <span
                            className={clsx(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              svc.isVisible ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                        <span className={clsx(
                          "font-medium text-xs",
                          svc.isVisible ? "text-green-700" : "text-gray-500"
                        )}>
                          {svc.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      {svc.Featured?.isFeatured ? (
                        <span className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-3 py-1 rounded-full text-xs border border-yellow-100">
                          <MdStar className="w-4 h-4" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedService(svc)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <MdVisibility className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(svc)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && services.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedServices.length}
          />
        )}
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onAddService={handleSave}
        editingService={editingService}
        allServices={services}
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
