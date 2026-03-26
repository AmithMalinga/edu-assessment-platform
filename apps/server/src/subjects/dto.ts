import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    name: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    gradeId: number;
}

export class CreateGradeDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id: number;

    @IsString()
    name: string;
}
