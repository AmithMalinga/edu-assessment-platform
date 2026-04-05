import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';

export enum QuestionType {
    MCQ = 'MCQ',
    STRUCTURED = 'STRUCTURED',
    ESSAY = 'ESSAY',
}

export enum ExamTypeCategory {
    RANDOM_NEW = 'RANDOM_NEW',
    LESSON_WISE = 'LESSON_WISE',
    PAST_PAPERS = 'PAST_PAPERS',
    LIVE = 'LIVE',
}

export class CreateExamDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsInt()
    @Min(1)
    duration: number;

    @IsInt()
    @Min(0)
    @Max(100)
    passingScore: number;
}

export class UpdateExamDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    passingScore?: number;
}

export class AddQuestionDto {
    @IsString()
    questionId: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    marks?: number;
}

export class GetRelevantQuestionsForExamDto {
    @Type(() => Number)
    @IsInt()
    gradeId: number;

    @IsUUID()
    subjectId: string;

    @IsEnum(QuestionType)
    examQuestionType: QuestionType;

    @IsOptional()
    @IsEnum(ExamTypeCategory)
    examTypeCategory?: ExamTypeCategory;

    @IsOptional()
    @IsString()
    lesson?: string;
}

export class SelectedQuestionDto {
    @IsUUID()
    questionId: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    marks?: number;
}

export class CreateAdminExamDto {
    @Type(() => Number)
    @IsInt()
    gradeId: number;

    @IsUUID()
    subjectId: string;

    @IsEnum(QuestionType)
    examQuestionType: QuestionType;

    @IsEnum(ExamTypeCategory)
    examTypeCategory: ExamTypeCategory;

    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    timeAllocationMinutes: number;

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    rules: string[];

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SelectedQuestionDto)
    selectedQuestions: SelectedQuestionDto[];

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    passingScorePercent?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    totalMarks?: number;

    @IsOptional()
    @IsString()
    lesson?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    shuffleQuestions?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    allowReviewBeforeSubmit?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    negativeMarkingPerWrongAnswer?: number;

    @IsOptional()
    @IsDateString()
    startsAt?: string;

    @IsOptional()
    @IsDateString()
    endsAt?: string;
}
