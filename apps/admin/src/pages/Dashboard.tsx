import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, BookOpen, Clock, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    students: 0,
    grades: 0,
    subjects: 0,
    questions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, grades, subjects, questions] = await Promise.all([
          api.get('/students'),
          api.get('/subjects/grades'),
          api.get('/subjects'),
          api.get('/questions')
        ]);
        
        setStats({
          students: students.data.length,
          grades: grades.data.length,
          subjects: subjects.data.length,
          questions: questions.data.length
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: <Users size={24} />, color: '#6366f1' },
    { label: 'Grade Levels', value: stats.grades, icon: <LayoutGrid size={24} />, color: '#10b981' },
    { label: 'Subjects', value: stats.subjects, icon: <BookOpen size={24} />, color: '#f59e0b' },
    { label: 'Question Bank', value: stats.questions, icon: <AlertCircle size={24} />, color: '#ef4444' }
  ];

  return (
    <Layout title="Dashboard Overview">
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card glass"
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p>{stat.label}</p>
              <h3>{loading ? '...' : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-card glass">
          <h3>Welcome back, Admin</h3>
          <p>You have full control over the educational platform. Use the sidebar to navigate through different management sections.</p>
          <div className="recent-activity">
            {/* Activity log could go here */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
