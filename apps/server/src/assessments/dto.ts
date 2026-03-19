import { IsString, IsInt, IsOptional, Min, Max, MinLength } from 'class-validator';

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
