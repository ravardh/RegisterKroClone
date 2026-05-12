import React, { useState, useEffect } from 'react'
import { MdAdd, MdDelete, MdEmail, MdPhone, MdBadge, MdPeople, MdEdit } from 'react-icons/md'
import AddRmModal from './Modals/AddRmModal'
import EditRmModal from './Modals/EditRmModel'
import axios from '../../config/api'
import toast from 'react-hot-toast'
import { confirmDialog } from '../../utils/confirmDialog'
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";

const RelationshipManagers = () => {
  const [managers, setManagers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    data: displayedManagers,
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
  } = useTable(managers, ["fullName", "email", "phone"], { key: "createdAt", direction: "desc" });

  const fetchRm = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/admin/rm')
      if (res.data.data) {
        setManagers(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching RMs:', error)
      toast.error('Failed to load relationship managers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRm()
  }, [])

  const handleAddManager = () => {
    fetchRm()
    setIsModalOpen(false)
  }

  const handleUpdateManager = () => {
    fetchRm()
    setIsEditModalOpen(false)
    setSelectedManager(null)
  }

  const handleEdit = (manager) => {
    setSelectedManager(manager)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this relationship manager? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/admin/delete-rm/${id}`)
          setManagers(prev => prev.filter(manager => manager._id !== id))
          toast.success('Relationship Manager deleted successfully!')
        } catch (error) {
          console.error('Error deleting RM:', error)
          toast.error(error.response?.data?.message || 'Failed to delete relationship manager')
        }
      },
      () => {
        // Cancelled
      }
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relationship Managers</h1>
          <p className="text-gray-500 mt-1">Manage your team of relationship managers and their access</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search managers..." 
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <MdAdd className="w-5 h-5" /> Add Manager
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Manager Name" sortKey="fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Email Address" sortKey="email" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Phone Number" sortKey="phone" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Added Date" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading managers...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedManagers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 italic">
                    {managers.length === 0 ? "No relationship managers found." : "No managers match your search."}
                  </td>
                </tr>
              ) : (
                displayedManagers.map((manager) => (
                  <tr key={manager._id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                          {manager.fullName.charAt(0).toUpperCase()}
                        </div>
                        {manager.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdEmail className="w-4 h-4 text-blue-500" />
                        <a href={`mailto:${manager.email}`} className="hover:text-blue-600 transition-colors">
                          {manager.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdPhone className="w-4 h-4 text-indigo-500" />
                        <a href={`tel:${manager.phone}`} className="hover:text-blue-600 transition-colors">
                          {manager.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 text-gray-500 font-medium">
                      {new Date(manager.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(manager)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Manager"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(manager._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Manager"
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
        {!loading && managers.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedManagers.length}
          />
        )}
      </div>

      <AddRmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddManager={handleAddManager}
      />

      <EditRmModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedManager(null)
        }}
        onUpdateManager={handleUpdateManager}
        manager={selectedManager}
      />
    </div>
  )
}

export default RelationshipManagers