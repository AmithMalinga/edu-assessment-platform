import { IsString, IsInt, IsObject, Min } from 'class-validator';

export class SubmitExamDto {
    @IsString()
    examId: string;

    @IsObject()
    answers: Record<string, string>; // { questionId: selectedAnswer }

    @IsInt()
    @Min(0)
    timeTaken: number; // seconds
}
