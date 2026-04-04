import api from '../api/client';

export interface DashboardStats {
  students: number;
  grades: number;
  subjects: number;
  questions: number;
}

export const adminService = {
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
  }
};
