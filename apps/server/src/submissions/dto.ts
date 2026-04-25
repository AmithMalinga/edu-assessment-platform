import { IsString, IsInt, IsObject, Min, IsOptional } from 'class-validator';

export class SubmitExamDto {
    @IsString()
    examId: string;

    @IsObject()
    answers: Record<string, string>; // { questionId: selectedAnswer }

    @IsOptional()
    @IsObject()
    questionTimes?: Record<string, number>; // { questionId: timeSpentInSeconds }

    @IsInt()
    @Min(0)
    timeTaken: number; // seconds
}
