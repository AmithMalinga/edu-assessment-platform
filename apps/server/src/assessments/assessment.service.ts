import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExamDto, UpdateExamDto } from './dto';

@Injectable()
export class AssessmentService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.exam.findMany({
            include: {
                _count: { select: { examQuestions: true, attempts: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: {
                examQuestions: {
                    include: { question: true },
                    orderBy: { order: 'asc' },
                },
                _count: { select: { attempts: true } },
            },
        });
        if (!exam) throw new NotFoundException(`Exam with id ${id} not found`);
        return exam;
    }

    async create(dto: CreateExamDto) {
        return this.prisma.exam.create({ data: dto });
    }

    async update(id: string, dto: UpdateExamDto) {
        await this.findOne(id);
        return this.prisma.exam.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.exam.delete({ where: { id } });
    }

    async addQuestion(examId: string, questionId: string, marks = 1) {
        await this.findOne(examId);
        const count = await this.prisma.examQuestion.count({ where: { examId } });
        return this.prisma.examQuestion.create({
            data: { examId, questionId, order: count + 1, marks },
            include: { question: true },
        });
    }

    async removeQuestion(examId: string, questionId: string) {
        await this.findOne(examId);
        return this.prisma.examQuestion.delete({
            where: { examId_questionId: { examId, questionId } },
        });
    }
}
