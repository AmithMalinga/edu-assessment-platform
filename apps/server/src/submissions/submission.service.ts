import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubmitExamDto } from './dto';

@Injectable()
export class SubmissionService {
    constructor(private prisma: PrismaService) {}

    async submit(userId: string, dto: SubmitExamDto) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: dto.examId },
            include: {
                examQuestions: {
                    include: { question: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!exam) throw new NotFoundException(`Exam with id ${dto.examId} not found`);

        // Auto-grade MCQ questions; ESSAY/STRUCTURED questions default to 0 until manually graded
        let totalMarks = 0;
        let earnedMarks = 0;
        for (const eq of exam.examQuestions) {
            totalMarks += eq.marks;
            const submitted = dto.answers[eq.questionId];
            if (
                submitted !== undefined &&
                eq.question.correctAnswer !== null &&
                submitted === eq.question.correctAnswer
            ) {
                earnedMarks += eq.marks;
            }
        }

        const score = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;

        const attempt = await this.prisma.attempt.create({
            data: {
                userId,
                examId: dto.examId,
                score,
                timeTaken: dto.timeTaken,
                answers: dto.answers,
            },
            include: { exam: true },
        });

        return {
            ...attempt,
            passed: score >= exam.passingScore,
            totalMarks,
            earnedMarks,
        };
    }

    async findAll() {
        return this.prisma.attempt.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                exam: true,
            },
            orderBy: { completedAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const attempt = await this.prisma.attempt.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                exam: true,
            },
        });
        if (!attempt) throw new NotFoundException(`Submission with id ${id} not found`);
        return attempt;
    }

    async findByStudent(userId: string) {
        return this.prisma.attempt.findMany({
            where: { userId },
            include: { exam: true },
            orderBy: { completedAt: 'desc' },
        });
    }
}
