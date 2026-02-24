import React, { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import axios from '../../../config/api'
import toast from 'react-hot-toast'

const CategoryModal = ({ isOpen, onClose, onSave, editingCategory = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    headerOrder: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && editingCategory) {
      setFormData({
        name: editingCategory.name,
        shortDescription: editingCategory.shortDescription || '',
        headerOrder: editingCategory.headerOrder || ''
      })
    } else if (!isOpen) {
      setFormData({ name: '', shortDescription: '', headerOrder: '' })
      setError('')
    }
  }, [isOpen, editingCategory])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let res
      if (editingCategory) {
        res = await axios.put(`/services/categories/${editingCategory._id}`, formData)
      } else {
        res = await axios.post('/services/categories', formData)
      }

      if (res.data.data) {
        toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully!`);
        onSave(res.data.data)
        onClose()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save category'
      console.error('Error saving category:', error)
      toast.error(message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Brief description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Order <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="headerOrder"
                  value={formData.headerOrder}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter header order (1-5 for main, 6+ for Other Services)"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Orders 1-5 display in header, 6+ go under "Other Services"
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal
