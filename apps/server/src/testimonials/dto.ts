import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
