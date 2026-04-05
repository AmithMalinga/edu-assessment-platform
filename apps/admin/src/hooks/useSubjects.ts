import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

export const useSubjects = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await adminService.getSubjects();
            setSubjects(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const createSubject = async (data: { name: string; gradeId: number }) => {
        await adminService.createSubject(data);
        await fetchSubjects();
    };

    const updateSubject = async (id: string, data: { name: string; gradeId: number }) => {
        await adminService.updateSubject(id, data);
        await fetchSubjects();
    };

    const deleteSubject = async (id: string) => {
        await adminService.deleteSubject(id);
        await fetchSubjects();
    };

    return { subjects, loading, error, refresh: fetchSubjects, createSubject, updateSubject, deleteSubject };
};
