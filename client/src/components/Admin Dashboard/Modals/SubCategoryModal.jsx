import React, { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import axios from '../../../config/api'
import toast from 'react-hot-toast'

const SubCategoryModal = ({ isOpen, onClose, onSave, editingSubCategory = null }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    shortDescription: '',
    sequence: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      if (editingSubCategory) {
        setFormData({
          name: editingSubCategory.name,
          categoryId: editingSubCategory.category?._id || '',
          shortDescription: editingSubCategory.shortDescription || '',
          sequence: editingSubCategory.sequence || ''
        })
      }
    } else {
      setFormData({ name: '', categoryId: '', shortDescription: '', sequence: '' })
      setError('')
    }
  }, [isOpen, editingSubCategory])

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/services/categories-list')
      setCategories(res.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

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
      if (editingSubCategory) {
        res = await axios.put(`/services/subcategories/${editingSubCategory._id}`, formData)
      } else {
        res = await axios.post('/services/subcategories', formData)
      }

      if (res.data.data) {
        toast.success(`Sub-category ${editingSubCategory ? 'updated' : 'created'} successfully!`)
        onSave(res.data.data)
        onClose()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save sub-category'
      console.error('Error saving sub-category:', error)
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
            {editingSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
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
                Parent Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter sub-category name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sequence
              </label>
              <input
                type="number"
                name="sequence"
                value={formData.sequence}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Display sequence (optional)"
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
              className="flex-1 px-6 py-2.5 bg-(--success) text-white rounded-lg hover:bg-(--success-hover) transition font-medium disabled:bg-(--success)/50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingSubCategory ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubCategoryModal
