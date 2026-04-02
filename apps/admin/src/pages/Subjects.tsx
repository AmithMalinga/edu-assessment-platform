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
  const [newSubject, setNewSubject] = useState({ name: '', gradeId: '' });
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

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/subjects', {
        name: newSubject.name,
        gradeId: parseInt(newSubject.gradeId)
      });
      setIsModalOpen(false);
      setNewSubject({ name: '', gradeId: '' });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add subject');
    }
  };

  return (
    <Layout title="Subjects Management">
      <div className="page-header-actions">
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
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
                    <button className="icon-btn edit"><Edit2 size={16} /></button>
                    <button className="icon-btn delete"><Trash2 size={16} /></button>
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
            <h3>Add New Subject</h3>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Name</label>
                <input 
                  type="text" 
                  value={newSubject.name} 
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="e.g. Mathematics" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select 
                  value={newSubject.gradeId} 
                  onChange={(e) => setNewSubject({...newSubject, gradeId: e.target.value})}
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
                <button type="submit" className="confirm-btn">Create Subject</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Subjects;
