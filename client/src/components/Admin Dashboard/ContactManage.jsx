import React, { useEffect, useState } from "react";
import { MdDelete, MdSearch, MdEmail, MdPhone, MdPerson, MdVisibility } from "react-icons/md";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { confirmDialog } from "../../utils/confirmDialog";
import ViewContactDetailsModal from "./Modals/ViewContactDetailsModal";
const ContactManage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

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

  const filtered = contacts.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (c.fullName || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.message || "").toLowerCase().includes(q)
    );
  });

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Contact Submissions</h1>
          <p className="text-sm text-gray-500">
            View and manage contact form submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts..."
              className="pl-8 pr-3 py-2 border rounded w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No contact submissions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr 
                    key={contact._id} 
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-gray-400" />
                        {contact.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <MdEmail className="text-gray-400" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {contact.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <MdPhone className="text-gray-400" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top max-w-xs">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-600">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filtered.length} of {contacts.length} contact submissions
        </div>
      )}

      <ViewContactDetailsModal 
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ContactManage;