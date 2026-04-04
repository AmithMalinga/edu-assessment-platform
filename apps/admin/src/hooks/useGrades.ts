import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

export const useGrades = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGrades();
      setGrades(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const createGrade = async (data: { id: number; name: string }) => {
    await adminService.createGrade(data);
    await fetchGrades();
  };

  const updateGrade = async (id: number, data: { name: string }) => {
    await adminService.updateGrade(id, data);
    await fetchGrades();
  };

  const deleteGrade = async (id: number) => {
    await adminService.deleteGrade(id);
    await fetchGrades();
  };

  return { grades, loading, error, refresh: fetchGrades, createGrade, updateGrade, deleteGrade };
};
