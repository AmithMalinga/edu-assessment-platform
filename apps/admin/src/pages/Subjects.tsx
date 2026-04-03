import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle, Book } from 'lucide-react';
import './Subjects.css';

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [subjectForm, setSubjectForm] = useState({ name: '', gradeId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, gradesRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/subjects/grades')
      ]);
      setSubjects(subjectsRes.data);
      setGrades(gradesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject: any = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({ name: subject.name, gradeId: subject.gradeId.toString() });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', gradeId: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject.id}`, {
          name: subjectForm.name,
          gradeId: parseInt(subjectForm.gradeId)
        });
      } else {
        await api.post('/subjects', {
          name: subjectForm.name,
          gradeId: parseInt(subjectForm.gradeId)
        });
      }
      setIsModalOpen(false);
      setSubjectForm({ name: '', gradeId: '' });
      setEditingSubject(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save subject');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject? This may affect associated questions.')) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  return (
    <Layout title="Subjects Management">
      <div className="page-header-actions">
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Subject
        </button>
      </div>

      <div className="subjects-list glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Grade Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan={3} className="text-center">Loading...</td></tr>
            ) : subjects.map((subject) => (
              <tr key={subject.id}>
                <td className="font-bold">
                  <div className="flex-center gap-2">
                    <Book size={16} color="var(--primary)" />
                    {subject.name}
                  </div>
                </td>
                <td>{subject.grade?.name}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn edit" onClick={() => handleOpenModal(subject)}><Edit2 size={16} /></button>
                    <button className="icon-btn delete" onClick={() => handleDeleteSubject(subject.id)}><Trash2 size={16} /></button>
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
            <h3>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Name</label>
                <input 
                  type="text" 
                  value={subjectForm.name} 
                  onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                  placeholder="e.g. Mathematics" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select 
                  value={subjectForm.gradeId} 
                  onChange={(e) => setSubjectForm({...subjectForm, gradeId: e.target.value})}
                  required
                >
                  <option value="">Select Grade</option>
                  {grades.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              {error && <p className="form-error"><AlertCircle size={14} /> {error}</p>}
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn">
                   {editingSubject ? 'Update Subject' : 'Create Subject'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Subjects;
