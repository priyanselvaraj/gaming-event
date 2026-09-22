import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { Tags, PlusCircle, Gamepad2, Calendar } from 'lucide-react';

export const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await eventService.getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      error('Category name is required.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await eventService.createCategory(formData);
      if (res.success) {
        success('Category added successfully!');
        setIsModalOpen(false);
        setFormData({ name: '', description: '' });
        fetchCategories();
      }
    } catch (err) {
      error(err.message || 'Failed to create category.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Gaming Taxonomy & Categories</h1>
          <p className="text-xs text-slate-400">Curate gaming genres used to classify platform events and tournaments</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#121824] border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Tags className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{cat.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.description || 'General esports gaming genre.'}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
              Registered Genre ID #{cat.id}
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Gaming Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Category Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Battle Royale, FPS, Fighting Games"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Associated titles and competitive subgenres..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cyber-btn-secondary text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="cyber-btn-primary text-xs font-bold uppercase tracking-wider"
            >
              {actionLoading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
