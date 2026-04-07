import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubmitExamDto } from './dto';

const EXAM_CONFIG_PREFIX = 'Exam Config: ';

type ExamTypeCategory = 'RANDOM_NEW' | 'LESSON_WISE' | 'PAST_PAPERS' | 'LIVE';

interface ExamConfigMetadata {
    subjectName?: string;
    examTypeCategory?: ExamTypeCategory;
}

@Injectable()
export class SubmissionService {
    constructor(private prisma: PrismaService) {}

    private parseExamConfig(description: string | null): ExamConfigMetadata | null {
        if (!description) return null;

        const markerIndex = description.indexOf(EXAM_CONFIG_PREFIX);
        if (markerIndex === -1) return null;

        try {
            return JSON.parse(description.slice(markerIndex + EXAM_CONFIG_PREFIX.length).trim()) as ExamConfigMetadata;
        } catch {
            return null;
        }
    }

    private examTypeLabel(category: ExamTypeCategory | undefined): string {
        switch (category) {
            case 'LESSON_WISE':
                return 'Lesson Wise';
            case 'PAST_PAPERS':
                return 'Past Papers';
            case 'LIVE':
                return 'Live';
            case 'RANDOM_NEW':
                return 'Random New';
            default:
                return 'General';
        }
    }

    private computeAttemptStats(
        examQuestions: Array<{ marks: number; questionId: string; question: { correctAnswer: string | null } }>,
        answers: Record<string, string>,
    ) {
        let totalMarks = 0;
        let earnedMarks = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let unansweredAnswers = 0;

        for (const eq of examQuestions) {
            totalMarks += eq.marks;
            const submitted = answers[eq.questionId];

            if (submitted === undefined || submitted === null || `${submitted}`.trim() === '') {
                unansweredAnswers += 1;
                continue;
            }

            if (eq.question.correctAnswer !== null && submitted === eq.question.correctAnswer) {
                earnedMarks += eq.marks;
                correctAnswers += 1;
            } else {
                wrongAnswers += 1;
            }
        }

        const score = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;

        return {
            totalMarks,
            earnedMarks,
            score,
            correctAnswers,
            wrongAnswers,
            unansweredAnswers,
        };
    }

    private toAnswersRecord(value: unknown): Record<string, string> {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
        return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>((acc, [key, item]) => {
            if (typeof item === 'string') acc[key] = item;
            return acc;
        }, {});
    }

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

        const stats = this.computeAttemptStats(exam.examQuestions, dto.answers);

        const attempt = await this.prisma.attempt.create({
            data: {
                userId,
                examId: dto.examId,
                score: stats.score,
                timeTaken: dto.timeTaken,
                answers: dto.answers,
            },
            include: { exam: true },
        });

        return {
            id: attempt.id,
            examId: attempt.examId,
            userId: attempt.userId,
            score: attempt.score,
            timeTaken: attempt.timeTaken,
            completedAt: attempt.completedAt,
            passed: attempt.score >= exam.passingScore,
            totalMarks: stats.totalMarks,
            earnedMarks: stats.earnedMarks,
            correctAnswers: stats.correctAnswers,
            wrongAnswers: stats.wrongAnswers,
            unansweredAnswers: stats.unansweredAnswers,
            passingScore: exam.passingScore,
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

    async getAttemptReview(userId: string, attemptId: string) {
        const attempt = await this.prisma.attempt.findFirst({
            where: { id: attemptId, userId },
            include: {
                exam: {
                    include: {
                        examQuestions: {
                            include: { question: true },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });

        if (!attempt) {
            throw new NotFoundException(`Submission with id ${attemptId} not found`);
        }

        const answers = this.toAnswersRecord(attempt.answers);
        const stats = this.computeAttemptStats(attempt.exam.examQuestions, answers);

        return {
            attemptId: attempt.id,
            examId: attempt.examId,
            examTitle: attempt.exam.title,
            completedAt: attempt.completedAt,
            timeTaken: attempt.timeTaken,
            passed: attempt.score >= attempt.exam.passingScore,
            scoreSummary: {
                score: attempt.score,
                passingScore: attempt.exam.passingScore,
                totalMarks: stats.totalMarks,
                earnedMarks: stats.earnedMarks,
                correctAnswers: stats.correctAnswers,
                wrongAnswers: stats.wrongAnswers,
                unansweredAnswers: stats.unansweredAnswers,
            },
            questions: attempt.exam.examQuestions.map((eq) => {
                const selectedAnswer = answers[eq.questionId] ?? null;
                const correctAnswer = eq.question.correctAnswer;
                const isAnswered = selectedAnswer !== null && `${selectedAnswer}`.trim() !== '';
                const isCorrect = isAnswered && correctAnswer !== null && selectedAnswer === correctAnswer;

                return {
                    questionId: eq.questionId,
                    order: eq.order,
                    marks: eq.marks,
                    lesson: eq.question.lesson,
                    questionType: eq.question.type,
                    content: eq.question.content,
                    choices: eq.question.choices,
                    selectedAnswer,
                    correctAnswer,
                    isAnswered,
                    isCorrect,
                };
            }),
        };
    }

    async getMyAnalytics(userId: string) {
        const attempts = await this.prisma.attempt.findMany({
            where: { userId },
            include: { exam: true },
            orderBy: { completedAt: 'asc' },
        });

        if (attempts.length === 0) {
            return {
                userId,
                overview: {
                    totalAttempts: 0,
                    averageScore: 0,
                    passRate: 0,
                    bestScore: 0,
                    latestScore: 0,
                    totalTimeTaken: 0,
                    averageTimeTaken: 0,
                },
                scoreTrend: [],
                byExamType: [],
                bySubject: [],
                recentAttempts: [],
            };
        }

        const totalAttempts = attempts.length;
        const totalScore = attempts.reduce((sum, item) => sum + item.score, 0);
        const totalTimeTaken = attempts.reduce((sum, item) => sum + item.timeTaken, 0);
        const bestScore = Math.max(...attempts.map((item) => item.score));
        const latestScore = attempts[attempts.length - 1]?.score ?? 0;
        const passedCount = attempts.filter((item) => item.score >= item.exam.passingScore).length;

        const byExamType = new Map<string, { count: number; scoreSum: number }>();
        const bySubject = new Map<string, { count: number; scoreSum: number }>();

        for (const attempt of attempts) {
            const metadata = this.parseExamConfig(attempt.exam.description ?? null);
            const examTypeKey = this.examTypeLabel(metadata?.examTypeCategory);
            const subjectKey = metadata?.subjectName || 'General';

            const examTypeEntry = byExamType.get(examTypeKey) ?? { count: 0, scoreSum: 0 };
            examTypeEntry.count += 1;
            examTypeEntry.scoreSum += attempt.score;
            byExamType.set(examTypeKey, examTypeEntry);

            const subjectEntry = bySubject.get(subjectKey) ?? { count: 0, scoreSum: 0 };
            subjectEntry.count += 1;
            subjectEntry.scoreSum += attempt.score;
            bySubject.set(subjectKey, subjectEntry);
        }

        return {
            userId,
            overview: {
                totalAttempts,
                averageScore: Math.round((totalScore / totalAttempts) * 100) / 100,
                passRate: Math.round((passedCount / totalAttempts) * 10000) / 100,
                bestScore,
                latestScore,
                totalTimeTaken,
                averageTimeTaken: Math.round(totalTimeTaken / totalAttempts),
            },
            scoreTrend: attempts.map((attempt) => ({
                attemptId: attempt.id,
                examId: attempt.examId,
                examTitle: attempt.exam.title,
                score: attempt.score,
                completedAt: attempt.completedAt,
            })),
            byExamType: Array.from(byExamType.entries()).map(([examType, values]) => ({
                examType,
                attempts: values.count,
                averageScore: Math.round((values.scoreSum / values.count) * 100) / 100,
            })),
            bySubject: Array.from(bySubject.entries()).map(([subject, values]) => ({
                subject,
                attempts: values.count,
                averageScore: Math.round((values.scoreSum / values.count) * 100) / 100,
            })),
            recentAttempts: [...attempts]
                .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
                .slice(0, 10)
                .map((attempt) => {
                    const metadata = this.parseExamConfig(attempt.exam.description ?? null);
                    return {
                        attemptId: attempt.id,
                        examId: attempt.examId,
                        examTitle: attempt.exam.title,
                        score: attempt.score,
                        completedAt: attempt.completedAt,
                        passed: attempt.score >= attempt.exam.passingScore,
                        examType: this.examTypeLabel(metadata?.examTypeCategory),
                        subjectName: metadata?.subjectName || 'General',
                    };
                }),
        };
    }
}
