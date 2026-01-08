import React, { useState, useEffect } from 'react'
import { MdAdd, MdDelete, MdEmail, MdPhone, MdBadge, MdPeople } from 'react-icons/md'
import AddRmModal from './Modals/AddRmModal'
import axios from '../../config/api'

const RelationshipManagers = () => {
  const [managers, setManagers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchRm = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/admin/rm')
      if (res.data.data) {
        setManagers(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching RMs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRm()
  }, [])

  const handleAddManager = (newManager) => {
    fetchRm()
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/delete-rm/${id}`)
      setManagers(prev => prev.filter(manager => manager._id !== id))
    } catch (error) {
      console.error('Error deleting RM:', error)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Relationship Managers</h1>
        <p className="text-gray-600">Manage your team of relationship managers</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className=" bg-(--primary) hover:bg-(--primary-hover) text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-200 flex items-center gap-2"
        >
          <MdAdd className="w-5 h-5" />
          Add Relationship Manager
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : managers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MdPeople className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Relationship Managers Yet</h3>
            <p className="text-gray-500">Click the "Add Relationship Manager" button to get started</p>
          </div>
        ) : (
          managers.map((manager) => (
            <div key={manager._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {manager.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{manager.fullName}</h3>
                      <p className="text-sm text-gray-500">Added on {new Date(manager.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MdEmail className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">{manager.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MdPhone className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">{manager.phone}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(manager._id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition duration-200"
                  title="Delete Manager"
                >
                  <MdDelete className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddRmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddManager={handleAddManager}
      />
    </div>
  )
}

export default RelationshipManagers