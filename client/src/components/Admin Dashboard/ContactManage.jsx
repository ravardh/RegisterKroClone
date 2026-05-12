import React, { useEffect, useState } from "react";
import { MdDelete, MdSearch, MdEmail, MdPhone, MdPerson, MdVisibility } from "react-icons/md";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { confirmDialog } from "../../utils/confirmDialog";
import ViewContactDetailsModal from "./Modals/ViewContactDetailsModal";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
const ContactManage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const {
    data: displayedContacts,
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
  } = useTable(contacts, ["fullName", "email", "phone", "message"], { key: "createdAt", direction: "desc" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/contacts");
      setContacts(res.data.data || []);
    } catch (err) {
      console.error("fetchContacts", err);
      toast.error("Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this contact submission? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/admin/contacts/${id}`);
          setContacts((prev) => prev.filter((c) => c._id !== id));
          toast.success("Contact deleted successfully!");
        } catch (err) {
          console.error("deleteContact", err);
          toast.error(err.response?.data?.message || "Failed to delete contact");
        }
      },
      () => {
        // Cancelled
      }
    );
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-500 mt-1">View and manage contact form submissions</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search contacts..." 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Name" sortKey="fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Email" sortKey="email" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Phone" sortKey="phone" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Message" sortKey="message" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Submitted At" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading submissions...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {contacts.length === 0 ? "No submissions found." : "No submissions match your search."}
                  </td>
                </tr>
              ) : (
                displayedContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-blue-500" />
                        {contact.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MdEmail className="text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MdPhone className="text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-gray-700 line-clamp-2" title={contact.message}>
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-medium">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && contacts.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedContacts.length}
          />
        )}
      </div>

      <ViewContactDetailsModal 
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ContactManage;