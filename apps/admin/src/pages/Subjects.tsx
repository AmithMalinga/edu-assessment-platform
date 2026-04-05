import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useSubjects } from '../hooks/useSubjects';
import { useGrades } from '../hooks/useGrades';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle, Book, X } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

const Subjects: React.FC = () => {
  const { subjects, loading: subjectsLoading, error: subjectsError, createSubject, updateSubject, deleteSubject } = useSubjects();
  const { grades, loading: gradesLoading } = useGrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [subjectForm, setSubjectForm] = useState({ name: '', gradeId: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Confirm Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleOpenModal = (subject: any = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({ name: subject.name, gradeId: subject.gradeId.toString() });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', gradeId: '' });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          name: subjectForm.name,
          gradeId: Number.parseInt(subjectForm.gradeId, 10)
        });
      } else {
        await createSubject({
          name: subjectForm.name,
          gradeId: Number.parseInt(subjectForm.gradeId, 10)
        });
      }
      setIsModalOpen(false);
      setSubjectForm({ name: '', gradeId: '' });
      setEditingSubject(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteSubject(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  const loading = subjectsLoading || gradesLoading;
  const error = subjectsError;

  // Fix for lint nested ternary
  const renderTableBody = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="animate-pulse">
          <td colSpan={3} className="px-8 py-6">
            <div className="h-4 bg-white/5 rounded w-full" />
          </td>
        </tr>
      ));
    }

    if (subjects.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="px-8 py-10 text-center text-slate-500 italic">
            No subjects found. Add your first subject to get started.
          </td>
        </tr>
      );
    }

    return subjects.map((subject) => (
      <motion.tr 
        key={subject.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hover:bg-white/5 transition-colors group"
      >
        <td className="px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Book size={18} />
            </div>
            <span className="font-bold text-white text-lg">{subject.name}</span>
          </div>
        </td>
        <td className="px-8 py-5">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-white/5">
            {subject.grade?.name || 'Unassigned'}
          </span>
        </td>
        <td className="px-8 py-5 text-right">
          <div className="flex items-center justify-end gap-2 transition-opacity">
            <button 
              onClick={() => handleOpenModal(subject)}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors border border-white/5"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => setConfirmDeleteId(subject.id)}
              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors border border-red-500/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </motion.tr>
    ));
  };

  return (
    <Layout title="Subjects Management">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-400 text-sm">Define and organize subjects across different grade levels.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      {error ? (
        <div className="glass-card border-red-500/20 p-8 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <p className="text-white font-medium">{error}</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden !p-0 border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-semibold">Subject Name</th>
                  <th className="px-8 py-4 font-semibold">Grade Level</th>
                  <th className="px-8 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {renderTableBody()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subject?"
        message="This will permanently delete the subject. Any questions or content associated with this subject will be unassigned."
        confirmText="Delete Subject"
      />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-card border-white/10 relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="subject-name" className="text-sm font-medium text-slate-400">Subject Name</label>
                  <input 
                    id="subject-name"
                    type="text" 
                    value={subjectForm.name} 
                    onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="e.g. Mathematics" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject-grade" className="text-sm font-medium text-slate-400">Grade Level</label>
                  <select 
                    id="subject-grade"
                    value={subjectForm.gradeId} 
                    onChange={(e) => setSubjectForm({...subjectForm, gradeId: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    required
                  >
                    <option value="">Select Grade</option>
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> 
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    {isSubmitting ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Subjects;
