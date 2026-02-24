import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { QuestionType } from '@prisma/client';

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
}
