import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import './Grades.css';

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({ id: '', name: '' });
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

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/subjects/grades', {
        id: parseInt(newGrade.id),
        name: newGrade.name
      });
      setIsModalOpen(false);
      setNewGrade({ id: '', name: '' });
      fetchGrades();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add grade');
    }
  };

  return (
    <Layout title="Grades Management">
      <div className="page-header-actions">
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
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
            <h3>Add New Grade</h3>
            <form onSubmit={handleAddGrade}>
              <div className="form-group">
                <label>Grade ID (Numeric)</label>
                <input 
                  type="number" 
                  value={newGrade.id} 
                  onChange={(e) => setNewGrade({...newGrade, id: e.target.value})}
                  placeholder="e.g. 1" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Name</label>
                <input 
                  type="text" 
                  value={newGrade.name} 
                  onChange={(e) => setNewGrade({...newGrade, name: e.target.value})}
                  placeholder="e.g. Grade 1" 
                  required
                />
              </div>
              {error && <p className="form-error"><AlertCircle size={14} /> {error}</p>}
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn">Create Grade</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Grades;
