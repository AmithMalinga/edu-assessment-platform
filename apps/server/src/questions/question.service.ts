import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.question.findMany();
  }

  async findOne(id: string) {
    return this.prisma.question.findUnique({ where: { id } });
  }

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        ...dto,
        subjectId: dto.subjectId,
        // examId: dto.examId // Uncomment if examId is required and present in DTO
      }
    });
  }

  async update(id: string, dto: UpdateQuestionDto) {
    return this.prisma.question.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }
}
