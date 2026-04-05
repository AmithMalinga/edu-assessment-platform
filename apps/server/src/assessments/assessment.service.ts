import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
    CreateAdminExamDto,
    CreateExamDto,
    GetRelevantQuestionsForExamDto,
    UpdateExamDto,
} from './dto';

@Injectable()
export class AssessmentService {
    constructor(private prisma: PrismaService) {}

    private async assertAdmin(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can create and manage exams');
        }
    }

    async getRelevantQuestionsForAdmin(userId: string, query: GetRelevantQuestionsForExamDto) {
        await this.assertAdmin(userId);

        const subject = await this.prisma.subject.findUnique({
            where: { id: query.subjectId },
            select: {
                id: true,
                name: true,
                gradeId: true,
                grade: { select: { id: true, name: true } },
            },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        if (subject.gradeId !== query.gradeId) {
            throw new BadRequestException('Subject does not belong to the selected grade');
        }

        const questions = await this.prisma.question.findMany({
            where: {
                subjectId: query.subjectId,
                type: query.examQuestionType,
                ...(query.lesson ? { lesson: query.lesson } : {}),
            },
            select: {
                id: true,
                content: true,
                type: true,
                lesson: true,
                choices: true,
                correctAnswer: true,
                createdAt: true,
            },
            orderBy: [{ lesson: 'asc' }, { createdAt: 'desc' }],
        });

        return {
            filters: {
                gradeId: query.gradeId,
                subjectId: query.subjectId,
                examQuestionType: query.examQuestionType,
                examTypeCategory: query.examTypeCategory ?? null,
                lesson: query.lesson ?? null,
            },
            totalQuestions: questions.length,
            subject,
            questions,
        };
    }

    async createExamForAdmin(userId: string, dto: CreateAdminExamDto) {
        await this.assertAdmin(userId);

        const subject = await this.prisma.subject.findUnique({
            where: { id: dto.subjectId },
            select: {
                id: true,
                name: true,
                gradeId: true,
                grade: { select: { id: true, name: true } },
            },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        if (subject.gradeId !== dto.gradeId) {
            throw new BadRequestException('Subject does not belong to the selected grade');
        }

        const questionIds = dto.selectedQuestions.map((q) => q.questionId);
        const uniqueQuestionIds = new Set(questionIds);
        if (uniqueQuestionIds.size !== questionIds.length) {
            throw new BadRequestException('Duplicate questionId values found in selectedQuestions');
        }

        const matchingQuestions = await this.prisma.question.findMany({
            where: {
                id: { in: questionIds },
                subjectId: dto.subjectId,
                type: dto.examQuestionType,
                ...(dto.lesson ? { lesson: dto.lesson } : {}),
            },
            select: { id: true, lesson: true, type: true },
        });

        if (matchingQuestions.length !== questionIds.length) {
            const matchedIds = new Set(matchingQuestions.map((q) => q.id));
            const invalidIds = questionIds.filter((id) => !matchedIds.has(id));
            throw new BadRequestException(
                `Some questions do not match selected grade/subject/question type filters: ${invalidIds.join(', ')}`,
            );
        }

        const derivedTotalMarks = dto.selectedQuestions.reduce(
            (sum, question) => sum + (question.marks ?? 1),
            0,
        );

        const resolvedTotalMarks = dto.totalMarks ?? derivedTotalMarks;

        const examNotes = [
            dto.description?.trim() || '',
            `Exam Config: ${JSON.stringify({
                gradeId: dto.gradeId,
                gradeName: subject.grade.name,
                subjectId: dto.subjectId,
                subjectName: subject.name,
                examQuestionType: dto.examQuestionType,
                examTypeCategory: dto.examTypeCategory,
                lesson: dto.lesson ?? null,
                totalMarks: resolvedTotalMarks,
                rules: dto.rules,
                shuffleQuestions: dto.shuffleQuestions ?? false,
                allowReviewBeforeSubmit: dto.allowReviewBeforeSubmit ?? true,
                negativeMarkingPerWrongAnswer: dto.negativeMarkingPerWrongAnswer ?? 0,
                startsAt: dto.startsAt ?? null,
                endsAt: dto.endsAt ?? null,
            })}`,
        ]
            .filter(Boolean)
            .join('\n\n');

        const exam = await this.prisma.$transaction(async (tx) => {
            const createdExam = await tx.exam.create({
                data: {
                    title: dto.title,
                    description: examNotes,
                    duration: dto.timeAllocationMinutes,
                    passingScore: dto.passingScorePercent ?? 60,
                },
            });

            await tx.examQuestion.createMany({
                data: dto.selectedQuestions.map((question, index) => ({
                    examId: createdExam.id,
                    questionId: question.questionId,
                    order: index + 1,
                    marks: question.marks ?? 1,
                })),
            });

            return tx.exam.findUnique({
                where: { id: createdExam.id },
                include: {
                    examQuestions: {
                        include: {
                            question: {
                                select: {
                                    id: true,
                                    content: true,
                                    lesson: true,
                                    type: true,
                                },
                            },
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            });
        });

        return {
            message: 'Exam created successfully',
            exam,
            metadata: {
                gradeId: dto.gradeId,
                subjectId: dto.subjectId,
                examQuestionType: dto.examQuestionType,
                examTypeCategory: dto.examTypeCategory,
                totalMarks: resolvedTotalMarks,
                timeAllocationMinutes: dto.timeAllocationMinutes,
                rules: dto.rules,
                optionalSettings: {
                    shuffleQuestions: dto.shuffleQuestions ?? false,
                    allowReviewBeforeSubmit: dto.allowReviewBeforeSubmit ?? true,
                    negativeMarkingPerWrongAnswer: dto.negativeMarkingPerWrongAnswer ?? 0,
                    startsAt: dto.startsAt ?? null,
                    endsAt: dto.endsAt ?? null,
                },
            },
        };
    }

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
