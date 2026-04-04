import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import './Grades.css';

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [gradeForm, setGradeForm] = useState({ id: '', name: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get('/subjects/grades');
      setGrades(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (grade: any = null) => {
    if (grade) {
      setEditingGrade(grade);
      setGradeForm({ id: grade.id.toString(), name: grade.name });
    } else {
      setEditingGrade(null);
      setGradeForm({ id: '', name: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingGrade) {
        await api.put(`/subjects/grades/${editingGrade.id}`, {
          name: gradeForm.name
        });
      } else {
        await api.post('/subjects/grades', {
          id: parseInt(gradeForm.id),
          name: gradeForm.name
        });
      }
      setIsModalOpen(false);
      setGradeForm({ id: '', name: '' });
      setEditingGrade(null);
      fetchGrades();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save grade');
    }
  };

  const handleDeleteGrade = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this grade level? This may affect associated subjects.')) return;
    try {
      await api.delete(`/subjects/grades/${id}`);
      fetchGrades();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete grade');
    }
  };

  return (
    <Layout title="Grades Management">
      <div className="page-header-actions">
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Grade Level
        </button>
      </div>

      <div className="grades-list glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Grade Name</th>
              <th>Subjects Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan={4} className="text-center">Loading...</td></tr>
            ) : grades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.id}</td>
                <td className="font-bold">{grade.name}</td>
                <td>{grade._count?.subjects || 0}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn edit" onClick={() => handleOpenModal(grade)}><Edit2 size={16} /></button>
                    <button className="icon-btn delete" onClick={() => handleDeleteGrade(grade.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content glass"
          >
            <h3>{editingGrade ? 'Edit Grade Level' : 'Add New Grade'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Grade ID (Numeric)</label>
                <input 
                  type="number" 
                  value={gradeForm.id} 
                  onChange={(e) => setGradeForm({...gradeForm, id: e.target.value})}
                  placeholder="e.g. 1" 
                  disabled={!!editingGrade}
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Name</label>
                <input 
                  type="text" 
                  value={gradeForm.name} 
                  onChange={(e) => setGradeForm({...gradeForm, name: e.target.value})}
                  placeholder="e.g. Grade 1" 
                  required
                />
              </div>
              {error && <p className="form-error"><AlertCircle size={14} /> {error}</p>}
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn">
                  {editingGrade ? 'Update Grade' : 'Create Grade'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Grades;
