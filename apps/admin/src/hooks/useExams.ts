import { useEffect, useState } from 'react';
import {
  adminService,
  type CreateAdminExamPayload,
  type ExamSummary,
  type RelevantQuestionsParams,
  type RelevantQuestionsResponse,
} from '../services/admin.service';

export const useExams = () => {
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await adminService.getExams();
      setExams(data);
      setError(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const getRelevantQuestions = async (params: RelevantQuestionsParams): Promise<RelevantQuestionsResponse> => {
    return adminService.getRelevantQuestions(params);
  };

  const createExam = async (payload: CreateAdminExamPayload) => {
    const created = await adminService.createExam(payload);
    await fetchExams();
    return created;
  };

  return {
    exams,
    loading,
    error,
    refresh: fetchExams,
    getRelevantQuestions,
    createExam,
  };
};
