import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

export const useQuestions = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await adminService.getQuestions();
            setQuestions(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const createQuestion = async (data: any) => {
        await adminService.createQuestion(data);
        await fetchQuestions();
    };

    const deleteQuestion = async (id: string) => {
        await adminService.deleteQuestion(id);
        await fetchQuestions();
    };

    return { questions, loading, error, refresh: fetchQuestions, createQuestion, deleteQuestion };
};
