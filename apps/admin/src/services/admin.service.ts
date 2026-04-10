import api from '../api/client';

export interface DashboardStats {
  students: number;
  grades: number;
  subjects: number;
  questions: number;
  recentStudents: any[];
}

export type ExamQuestionType = 'MCQ' | 'STRUCTURED' | 'ESSAY';
export type ExamTypeCategory = 'RANDOM_NEW' | 'LESSON_WISE' | 'PAST_PAPERS' | 'LIVE';

export interface RelevantQuestionsParams {
  gradeId: number;
  subjectId: string;
  examQuestionType: ExamQuestionType;
  examTypeCategory?: ExamTypeCategory;
  lesson?: string;
}

export interface RelevantQuestion {
  id: string;
  content: string;
  type: ExamQuestionType;
  lesson: string;
  choices: string[];
  correctAnswer: string;
  createdAt: string;
}

export interface RelevantQuestionsResponse {
  totalQuestions: number;
  questions: RelevantQuestion[];
}

export interface SelectedExamQuestion {
  questionId: string;
  marks?: number;
}

export interface CreateAdminExamPayload {
  gradeId: number;
  subjectId: string;
  examQuestionType: ExamQuestionType;
  examTypeCategory: ExamTypeCategory;
  title: string;
  description?: string;
  timeAllocationMinutes: number;
  rules: string[];
  selectedQuestions: SelectedExamQuestion[];
  passingScorePercent?: number;
  totalMarks?: number;
  lesson?: string;
  shuffleQuestions?: boolean;
  allowReviewBeforeSubmit?: boolean;
  negativeMarkingPerWrongAnswer?: number;
  startsAt?: string;
  endsAt?: string;
}

export interface ExamSummary {
  id: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  createdAt: string;
  _count: {
    examQuestions: number;
    attempts: number;
  };
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
      questions: questions.data.length,
      recentStudents: students.data.slice(-5).reverse()
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
  },

  // Exams
  getRelevantQuestions: async (params: RelevantQuestionsParams): Promise<RelevantQuestionsResponse> => {
    const response = await api.get('/assessments/admin/relevant-questions', { params });
    return response.data;
  },
  createExam: async (payload: CreateAdminExamPayload) => {
    const response = await api.post('/assessments/admin/create-exam', payload);
    return response.data;
  },
  getExams: async (): Promise<ExamSummary[]> => {
    const response = await api.get('/assessments');
    return response.data;
   },
  findOne: async (id: string): Promise<any> => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  }
};
