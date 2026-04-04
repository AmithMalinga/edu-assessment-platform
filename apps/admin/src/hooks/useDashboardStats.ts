import { useState, useEffect } from 'react';
import { adminService, DashboardStats } from '../services/admin.service';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    grades: 0,
    subjects: 0,
    questions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refresh: fetchStats };
};
