import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useTestimonials } from '../hooks/useTestimonials';
import { testimonialService } from '../services/testimonial.service';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Star, 
  X, 
  User, 
  Quote,
  Loader2,
  AlertCircle
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';
import { toast } from 'react-hot-toast';

const Testimonials: React.FC = () => {
  const { testimonials, loading, error, refresh, deleteTestimonial } = useTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    avatar: ''
  });

  const handleOpenModal = (testimonial?: any) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.avatar || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', content: '', rating: 5, avatar: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await testimonialService.update(editingId, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        await testimonialService.create(formData);
        toast.success('Testimonial added successfully!');
      }
      await refresh();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const success = await deleteTestimonial(confirmDeleteId);
      if (success) {
        toast.success('Testimonial deleted successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <Layout title="Testimonials Management">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <p className="text-slate-400 text-sm">Manage student and teacher testimonials displayed on the landing page.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {error && (
        <div className="glass-card border-red-500/20 p-6 flex items-center gap-4 mb-8 bg-red-500/5">
          <AlertCircle className="text-red-400" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-64 animate-pulse bg-white/5 border-white/5 rounded-3xl" />
          ))
        ) : testimonials.length > 0 ? (
          testimonials.map((t, idx) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 flex flex-col group relative"
            >
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(t)}
                  className="p-2 bg-white/5 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(t.id)}
                  className="p-2 bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                ))}
              </div>

              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-indigo-500/10 fill-current" />
                <p className="text-slate-300 italic line-clamp-4 relative z-10 pl-4 border-l-2 border-indigo-500/20 font-medium">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-auto flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {t.avatar || t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
            <MessageSquare size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium italic">No testimonials found. Add your first success story!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Author Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="admin-input"
                      placeholder="e.g. Kavindi Perera"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Role / Subtitle</label>
                    <input 
                      type="text" 
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="admin-input"
                      placeholder="e.g. A/L Student, Colombo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Rating (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({...formData, rating: num})}
                        className={`p-2 rounded-lg transition-all ${
                          formData.rating >= num ? 'text-amber-400' : 'text-slate-700'
                        }`}
                      >
                        <Star className={formData.rating >= num ? 'fill-current' : ''} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Testimonial Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="admin-input resize-none"
                    placeholder="Write the testimonial content here..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingId ? 'Update Testimonial' : 'Publish Testimonial'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial?"
        message="This will permanently remove this testimonial from the landing page. Are you sure you want to proceed?"
        confirmText="Delete Now"
      />
    </Layout>
  );
};

export default Testimonials;
