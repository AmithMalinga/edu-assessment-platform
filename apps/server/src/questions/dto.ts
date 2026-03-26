import { Type } from 'class-transformer';
import { IsString, IsEnum, IsOptional, IsArray, IsInt, IsUrl } from 'class-validator';

export enum QuestionType {
  MCQ = 'MCQ',
  STRUCTURED = 'STRUCTURED',
  ESSAY = 'ESSAY'
}

export class GetRandomQuestionsDto {
  @IsString()
  grade: string;

  @IsString()
  subjectId: string;

  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  excludeIds?: string;

  @IsOptional()
  @IsString()
  includeIds?: string;

  @IsOptional()
  @IsString()
  seed?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  examId?: string;

  @IsOptional()
  @IsString()
  attemptId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  customFilter?: string;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  pageSize?: string;

  @IsOptional()
  @IsString()
  offset?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  noOfQuestions?: string;
}

export class CreateQuestionDto {
  @IsString()
  content: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  choices?: string[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsString()
  subjectId: string;

  @IsOptional()
  @IsString()
  lesson?: string;
}

export class CreateAdminQuestionDto {
  @Type(() => Number)
  @IsInt()
  gradeId: number;

  @IsString()
  subjectId: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  lesson: string;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  choices?: string[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsOptional()
  @IsUrl()
  imageLink?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  choices?: string[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsString()
  @IsOptional()
  lesson?: string;
}
