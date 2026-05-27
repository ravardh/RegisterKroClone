import React, { useState, useEffect } from 'react'
import { MdAdd, MdDelete, MdEmail, MdPhone, MdEdit } from 'react-icons/md'
import AddEmployeeModal from './Modals/AddEmployeeModal'
import EditEmployeeModal from './Modals/EditEmployeeModal'
import axios from '../../config/api'
import toast from 'react-hot-toast'
import { confirmDialog } from '../../utils/confirmDialog'
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";

const roleLabels = {
  rm: "RM",
  admin: "Admin",
  bloger: "Blogger",
};

const roleBadgeColors = {
  rm: "bg-blue-100 text-blue-800",
  admin: "bg-purple-100 text-purple-800",
  bloger: "bg-green-100 text-green-800",
};

const EmpManage = () => {
  const [employees, setEmployees] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    data: displayedEmployees,
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
  } = useTable(employees, ["fullName", "email", "phone", "role"], { key: "createdAt", direction: "desc" });

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/admin/employees')
      if (res.data.data) {
        setEmployees(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleAddEmployee = () => {
    fetchEmployees()
    setIsModalOpen(false)
  }

  const handleUpdateEmployee = () => {
    fetchEmployees()
    setIsEditModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this employee? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/admin/delete-employee/${id}`)
          setEmployees(prev => prev.filter(emp => emp._id !== id))
          toast.success('Employee deleted successfully!')
        } catch (error) {
          console.error('Error deleting employee:', error)
          toast.error(error.response?.data?.message || 'Failed to delete employee')
        }
      },
      () => {}
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-500 mt-1">Manage your team - RMs, Admins, and Bloggers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search employees..." 
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <MdAdd className="w-5 h-5" /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Name" sortKey="fullName" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Email" sortKey="email" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Phone" sortKey="phone" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Role" sortKey="role" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Added Date" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {employees.length === 0 ? "No employees found." : "No employees match your search."}
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                          {employee.fullName.charAt(0).toUpperCase()}
                        </div>
                        {employee.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdEmail className="w-4 h-4 text-blue-500" />
                        <a href={`mailto:${employee.email}`} className="hover:text-blue-600 transition-colors">
                          {employee.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdPhone className="w-4 h-4 text-indigo-500" />
                        <a href={`tel:${employee.phone}`} className="hover:text-blue-600 transition-colors">
                          {employee.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColors[employee.role] || "bg-gray-100 text-gray-800"}`}>
                        {roleLabels[employee.role] || employee.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 text-gray-500 font-medium">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Employee"
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
        {!loading && employees.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedEmployees.length}
          />
        )}
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <EditEmployeeModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedEmployee(null)
        }}
        onUpdateEmployee={handleUpdateEmployee}
        employee={selectedEmployee}
      />
    </div>
  )
}

export default EmpManage
