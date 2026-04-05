import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useGrades } from '../hooks/useGrades';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle, X, GraduationCap } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

const Grades: React.FC = () => {
  const { grades, loading, error, createGrade, updateGrade, deleteGrade } = useGrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [gradeForm, setGradeForm] = useState({ id: '', name: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Confirm Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleOpenModal = (grade: any = null) => {
    if (grade) {
      setEditingGrade(grade);
      setGradeForm({ id: grade.id.toString(), name: grade.name });
    } else {
      setEditingGrade(null);
      setGradeForm({ id: '', name: '' });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editingGrade) {
        await updateGrade(editingGrade.id, { name: gradeForm.name });
      } else {
        await createGrade({ id: Number.parseInt(gradeForm.id, 10), name: gradeForm.name });
      }
      setIsModalOpen(false);
      setGradeForm({ id: '', name: '' });
      setEditingGrade(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save grade level');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteGrade(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete grade');
    }
  };

  const renderTableBody = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="animate-pulse">
          <td colSpan={4} className="px-8 py-6">
            <div className="h-4 bg-white/5 rounded w-full" />
          </td>
        </tr>
      ));
    }

    if (grades.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="px-8 py-10 text-center text-slate-500 italic">
            No grade levels found. Start by adding one.
          </td>
        </tr>
      );
    }

    return grades.map((grade) => (
      <motion.tr 
        key={grade.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hover:bg-white/5 transition-colors group"
      >
        <td className="px-8 py-5 text-slate-400 font-mono text-sm">{grade.id}</td>
        <td className="px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-white text-lg">{grade.name}</span>
          </div>
        </td>
        <td className="px-8 py-5">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-white/5">
            {grade._count?.subjects || 0} Subjects
          </span>
        </td>
        <td className="px-8 py-5 text-right">
          <div className="flex items-center justify-end gap-2 transition-opacity">
            <button 
              onClick={() => handleOpenModal(grade)}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors border border-white/5"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => setConfirmDeleteId(grade.id)}
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
    <Layout title="Grades Management">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-400 text-sm">Manage educational levels and their associated subjects.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Add Grade Level</span>
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
                  <th className="px-8 py-4 font-semibold">ID</th>
                  <th className="px-8 py-4 font-semibold">Grade Name</th>
                  <th className="px-8 py-4 font-semibold">Subjects</th>
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
        title="Delete Grade Level?"
        message="This action cannot be undone. All subjects and assessments associated with this grade level may be affected."
        confirmText="Delete Grade"
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
                  {editingGrade ? 'Edit Grade Level' : 'Add New Grade'}
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
                  <label htmlFor="grade-id" className="text-sm font-medium text-slate-400">Grade ID (Numeric)</label>
                  <input 
                    id="grade-id"
                    type="number" 
                    value={gradeForm.id} 
                    onChange={(e) => setGradeForm({...gradeForm, id: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all font-mono"
                    placeholder="e.g. 1" 
                    disabled={!!editingGrade}
                    required
                  />
                  {!editingGrade && <p className="text-[10px] text-slate-500">This will be the unique identifier for the grade level.</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="grade-name" className="text-sm font-medium text-slate-400">Grade Name</label>
                  <input 
                    id="grade-name"
                    type="text" 
                    value={gradeForm.name} 
                    onChange={(e) => setGradeForm({...gradeForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="e.g. Grade 1" 
                    required
                  />
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
                    {isSubmitting ? 'Saving...' : editingGrade ? 'Update Grade' : 'Create Grade'}
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

export default Grades;
