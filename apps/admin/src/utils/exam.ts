import { ExamQuestionType, ExamTypeCategory } from '../services/admin.service';

export interface ExamConfig {
  gradeId?: number;
  gradeName?: string;
  subjectId?: string;
  subjectName?: string;
  examQuestionType?: ExamQuestionType;
  examTypeCategory?: ExamTypeCategory;
  lesson?: string | null;
  totalMarks?: number;
  rules?: string[];
  shuffleQuestions?: boolean;
  allowReviewBeforeSubmit?: boolean;
  negativeMarkingPerWrongAnswer?: number;
  startsAt?: string | null;
  endsAt?: string | null;
}

export const parseExamConfig = (description: string): ExamConfig | null => {
  if (!description) return null;
  
  try {
    // Look for the "Exam Config: { ... }" pattern
    const match = description.match(/Exam Config: (\{.*\})/);
    if (match && match[1]) {
      return JSON.parse(match[1]) as ExamConfig;
    }
  } catch (error) {
    console.error('Failed to parse exam config from description:', error);
  }
  
  return null;
};
