import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto, CreateAdminQuestionDto, UpdateQuestionDto } from './dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async getRandomQuestions(params: {
    grade: string;
    subjectId: string;
    questionType: import('./dto').QuestionType;
    noOfQuestions: number;
  }) {
    const { grade, subjectId, questionType, noOfQuestions } = params;
    const questions = await this.prisma.question.findMany({
      where: {
        subject: {
          id: subjectId,
          grade: {
            name: grade,
          },
        },
        type: questionType,
      },
    });
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = randomInt(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, noOfQuestions);
  }

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
        lesson: dto.lesson ?? 'General',
        subjectId: dto.subjectId,
        // examId: dto.examId // Uncomment if examId is required and present in DTO
      }
    });
  }

  async createForAdmin(userId: string, dto: CreateAdminQuestionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can add exam questions');
    }

    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
      select: { id: true, gradeId: true, name: true, grade: { select: { name: true } } },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (subject.gradeId !== dto.gradeId) {
      throw new BadRequestException('Subject does not belong to the selected grade');
    }

    const images = dto.imageLink
      ? [dto.imageLink]
      : dto.images ?? [];

    if (dto.type === 'MCQ') {
      if (!dto.choices || dto.choices.length < 2) {
        throw new BadRequestException('MCQ questions require at least 2 choices');
      }

      if (!dto.correctAnswer) {
        throw new BadRequestException('MCQ questions require a correct answer');
      }

      if (!dto.choices.includes(dto.correctAnswer)) {
        throw new BadRequestException('Correct answer must be one of the provided choices');
      }
    }

    return this.prisma.question.create({
      data: {
        content: dto.content,
        type: dto.type,
        lesson: dto.lesson,
        choices: dto.choices ?? [],
        correctAnswer: dto.correctAnswer,
        images,
        subjectId: dto.subjectId,
      },
      include: {
        subject: {
          include: {
            grade: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateQuestionDto) {
    return this.prisma.question.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const linkedExams = await this.prisma.examQuestion.count({
      where: { questionId: id }
    });

    if (linkedExams > 0) {
      throw new BadRequestException('Cannot delete question because it is used in one or more exams. Remove it from the exams first.');
    }

    try {
      return await this.prisma.question.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }
      throw error;
    }
  }
}
