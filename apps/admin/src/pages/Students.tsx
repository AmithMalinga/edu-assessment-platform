import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Search } from 'lucide-react';
import './Students.css';

const Students: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Students Management">
      <div className="page-header-actions">
        <div className="search-bar glass">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="students-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="student-card skeleton"></div>
          ))
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student, idx) => (
            <motion.div 
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="student-card glass"
            >
              <div className="student-card-header">
                <div className="student-avatar">
                  <User size={24} />
                </div>
                <div className="student-main-info">
                  <h3>{student.name}</h3>
                  <p>{student.educationalLevel}</p>
                </div>
              </div>
              
              <div className="student-details">
                <div className="detail-item">
                  <Mail size={14} />
                  <span>{student.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={14} />
                  <span>{student.phone}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={14} />
                  <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-state">No students found matching your search.</div>
        )}
      </div>
    </Layout>
  );
};

export default Students;
