import React, { useEffect, useState, useRef } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "../../config/api";
import { confirmDialog } from "../../utils/confirmDialog";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const assetUrl = (p) => (p ? `${backendBase}${p.startsWith("/") ? p : `/${p}`}` : "");

const emptyForm = {
  fullName: "",
  designation: "",
  bio: "",
  order: "",
  isActive: true,
};

const TeamManage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const {
    data: displayed,
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
  } = useTable(members, ["fullName", "designation", "order"], {
    key: "order",
    direction: "asc",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/team");
      setMembers(res.data.data || []);
    } catch (err) {
      console.error("fetchMembers", err);
      toast.error(err.response?.data?.message || "Failed to load team");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const clearImageSelection = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const leaveForm = () => {
    clearImageSelection();
    setSelected(null);
    setForm(emptyForm);
    setMode("list");
  };

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setImageFile(null);
    setMode("form");
  };

  const openEdit = (m) => {
    setSelected(m);
    setForm({
      fullName: m.fullName || "",
      designation: m.designation || "",
      bio: m.bio || "",
      order: m.order ?? "",
      isActive: !!m.isActive,
    });
    setImageFile(null);
    setMode("form");
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("fullName", form.fullName.trim());
    fd.append("designation", form.designation.trim());
    fd.append("bio", form.bio.trim());
    if (form.order !== "" && Number.isFinite(Number(form.order))) {
      fd.append("order", String(form.order));
    }
    fd.append("isActive", form.isActive ? "true" : "false");
    if (imageFile) {
      fd.append("image", imageFile);
    }
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.designation.trim()) {
      toast.error("Name and designation are required");
      return;
    }
    try {
      const fd = buildFormData();
      if (selected) {
        await axios.put(`/admin/team/${selected._id}`, fd);
        toast.success("Team member updated");
      } else {
        await axios.post("/admin/team", fd);
        toast.success("Team member added");
      }
      leaveForm();
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = (m) => {
    confirmDialog(
      `Delete ${m.fullName} from the team?`,
      async () => {
        try {
          await axios.delete(`/admin/team/${m._id}`);
          setMembers((prev) => prev.filter((x) => x._id !== m._id));
          toast.success("Removed");
        } catch (err) {
          toast.error(err.response?.data?.message || "Delete failed");
        }
      },
      () => {}
    );
  };

  if (mode === "form") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {selected ? "Edit team member" : "Add team member"}
          </h1>
          <button
            type="button"
            onClick={leaveForm}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Back to list
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Designation / role *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={form.designation}
              onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Short bio</label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[100px]"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Optional — shown on the home page"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Display order</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                placeholder="Auto if empty"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <span className="text-sm font-semibold text-gray-700">Visible on website</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {imagePreviewUrl || (selected?.image && !imageFile) ? (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {imagePreviewUrl ? "Preview (new photo)" : "Current photo"}
                  </p>
                  <img
                    src={imagePreviewUrl || assetUrl(selected.image)}
                    alt={imagePreviewUrl ? "New photo preview" : "Current team photo"}
                    className="w-32 h-32 object-cover rounded-xl border-2 border-indigo-100 shadow-md bg-gray-50"
                  />
                </div>
                {imagePreviewUrl && (
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 self-start sm:self-center"
                  >
                    Remove selected file
                  </button>
                )}
              </div>
            ) : null}
            {selected?.image && !imageFile && (
              <p className="text-xs text-gray-500 mt-2">Upload a new file above to replace this photo.</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-(--success) text-white font-semibold hover:bg-(--success-hover) transition shadow-md"
            >
              {selected ? "Save changes" : "Add member"}
            </button>
            <button
              type="button"
              onClick={leaveForm}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Team</h1>
          <p className="text-gray-500 mt-1">Manage people shown on the home page after client reviews</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
          <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Search team..." />
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md whitespace-nowrap"
          >
            <MdAdd className="w-5 h-5" />
            Add member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 border-b-2 border-gray-100">
                  Photo
                </th>
                <SortableHeader label="Name" sortKey="fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader
                  label="Designation"
                  sortKey="designation"
                  currentSort={sortConfig}
                  onSort={requestSort}
                />
                <SortableHeader label="Order" sortKey="order" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Visible" sortKey="isActive" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-500 font-medium">Loading team...</span>
                    </div>
                  </td>
                </tr>
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {members.length === 0 ? "No team members yet." : "No results match your search."}
                  </td>
                </tr>
              ) : (
                displayed.map((m) => (
                  <tr key={m._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 border-r border-gray-50">
                      {m.image ? (
                        <img
                          src={assetUrl(m.image)}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                          {m.fullName?.charAt(0) || "?"}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold border-r border-gray-50">{m.fullName}</td>
                    <td className="px-4 py-3 border-r border-gray-50">{m.designation}</td>
                    <td className="px-4 py-3 border-r border-gray-50">{m.order}</td>
                    <td className="px-4 py-3 border-r border-gray-50">
                      <span
                        className={clsx(
                          "px-3 py-1 inline-flex text-xs font-bold rounded-full border",
                          m.isActive
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        )}
                      >
                        {m.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          aria-label="Edit"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          aria-label="Delete"
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
        {!loading && members.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayed.length}
          />
        )}
      </div>
    </div>
  );
};

export default TeamManage;
