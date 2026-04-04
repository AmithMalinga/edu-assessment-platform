import api from '../api/client';

export interface DashboardStats {
  students: number;
  grades: number;
  subjects: number;
  questions: number;
}

export const adminService = {
  // Stats
  getStats: async (): Promise<DashboardStats> => {
    const [students, grades, subjects, questions] = await Promise.all([
      api.get('/students'),
      api.get('/subjects/grades'),
      api.get('/subjects'),
      api.get('/questions')
    ]);

    return {
      students: students.data.length,
      grades: grades.data.length,
      subjects: subjects.data.length,
      questions: questions.data.length
    };
  },

  // Students
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  // Grades
  getGrades: async () => {
    const response = await api.get('/subjects/grades');
    return response.data;
  },
  createGrade: async (data: { id: number; name: string }) => {
    const response = await api.post('/subjects/grades', data);
    return response.data;
  },
  updateGrade: async (id: number, data: { name: string }) => {
    const response = await api.put(`/subjects/grades/${id}`, data);
    return response.data;
  },
  deleteGrade: async (id: number) => {
    const response = await api.delete(`/subjects/grades/${id}`);
    return response.data;
  },

  // Subjects
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },
  createSubject: async (data: { name: string; gradeId: number }) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },
  updateSubject: async (id: string, data: { name: string; gradeId: number }) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },
  deleteSubject: async (id: string) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  // Questions
  getQuestions: async () => {
    const response = await api.get('/questions');
    return response.data;
  },
  createQuestion: async (data: any) => {
    const response = await api.post('/questions/admin', data);
    return response.data;
  },
  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};
