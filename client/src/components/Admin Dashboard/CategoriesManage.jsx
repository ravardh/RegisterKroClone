import React, { useState, useEffect } from 'react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import axios from '../../config/api'
import CategoryModal from './Modals/CategoryModal'
import SubCategoryModal from './Modals/SubCategoryModal'

const Categories = () => {
  const [activeTab, setActiveTab] = useState('categories')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)

  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubCategory, setEditingSubCategory] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchSubCategories()])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/admin/categories-list')
      setCategories(res.data.data || [])
    } catch (err) {
      console.error('fetchCategories', err)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get('/admin/subcategories-list')
      setSubCategories(res.data.data || [])
    } catch (err) {
      console.error('fetchSubCategories', err)
    }
  }

  // Category handlers
  const handleSaveCategory = (saved) => {
    if (editingCategory) {
      setCategories(prev => prev.map(c => c._id === saved._id ? saved : c))
    } else {
      setCategories(prev => [...prev, saved])
    }
    setEditingCategory(null)
  }

  const handleEditCategory = (cat) => {
    setEditingCategory(cat)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return
    try {
      await axios.delete(`/admin/categories/${id}`)
      setCategories(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category')
      console.error(err)
    }
  }

  // Sub-category handlers
  const handleSaveSubCategory = (saved) => {
    if (editingSubCategory) {
      setSubCategories(prev => prev.map(s => s._id === saved._id ? saved : s))
    } else {
      setSubCategories(prev => [...prev, saved])
    }
    setEditingSubCategory(null)
  }

  const handleEditSubCategory = (sc) => {
    setEditingSubCategory(sc)
    setIsSubCategoryModalOpen(true)
  }

  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm('Delete sub-category?')) return
    try {
      await axios.delete(`/admin/subcategories/${id}`)
      setSubCategories(prev => prev.filter(s => s._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete sub-category')
      console.error(err)
    }
  }

  const getFilteredSubCategories = (categoryId) => {
    if (!categoryId || categoryId === 'all') return subCategories
    return subCategories.filter(sc => sc.category?._id === categoryId)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        <p className="text-gray-600 mt-1">Manage Categories and Sub-Categories</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('subcategories')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'subcategories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
          Sub-Categories ({subCategories.length})
        </button>
      </div>

      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
            <button
              onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true) }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
            >
              <MdAdd className="w-5 h-5" /> Add Category
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {categories.length === 0 ? (
              <div className="text-center py-12">No categories</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map(cat => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-gray-900">{cat.name}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-600">{cat.shortDescription || '-'}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditCategory(cat)} className="text-blue-600 hover:text-blue-900 mr-3"><MdEdit className="w-5 h-5 inline" /></button>
                        <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-600 hover:text-red-900"><MdDelete className="w-5 h-5 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'subcategories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sub-Categories</h2>
            <button
              onClick={() => { setEditingSubCategory(null); setIsSubCategoryModalOpen(true) }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
            >
              <MdAdd className="w-5 h-5" /> Add Sub-Category
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {subCategories.length === 0 ? (
              <div className="text-center py-12">No sub-categories</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subCategories.map(sc => (
                    <tr key={sc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-gray-900">{sc.name}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{sc.category?.name}</span></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-600">{sc.shortDescription || '-'}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{sc.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sc.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditSubCategory(sc)} className="text-blue-600 hover:text-blue-900 mr-3"><MdEdit className="w-5 h-5 inline" /></button>
                        <button onClick={() => handleDeleteSubCategory(sc._id)} className="text-red-600 hover:text-red-900"><MdDelete className="w-5 h-5 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null) }} onSave={handleSaveCategory} editingCategory={editingCategory} />
      <SubCategoryModal isOpen={isSubCategoryModalOpen} onClose={() => { setIsSubCategoryModalOpen(false); setEditingSubCategory(null) }} onSave={handleSaveSubCategory} editingSubCategory={editingSubCategory} />
    </div>
  )
}

export default Categories