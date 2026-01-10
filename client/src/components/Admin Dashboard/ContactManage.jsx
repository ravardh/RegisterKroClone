import React, { useEffect, useState } from "react";
import { MdDelete, MdSearch, MdEmail, MdPhone, MdPerson, MdClose } from "react-icons/md";
import axios from "../../config/api";

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
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact submission?")) return;
    try {
      await axios.delete(`/admin/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("deleteContact", err);
      alert(err.response?.data?.message || "Failed to delete contact");
    }
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
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contact._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <MdDelete size={20} />
                      </button>
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

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Contact Submission Details
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Full Name
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <MdPerson className="text-gray-400 text-xl" />
                  <span className="text-lg">{selectedContact.fullName}</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-gray-400 text-xl" />
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-lg text-blue-600 hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <MdPhone className="text-gray-400 text-xl" />
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="text-lg text-blue-600 hover:underline"
                  >
                    {selectedContact.phone}
                  </a>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Message
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed break-words">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Submission Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Submitted At
                </label>
                <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedContact._id);
                  setSelectedContact(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManage;