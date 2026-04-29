import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService, ContactEmailDto } from '../email/email.service';

export interface LandingStatsResponse {
    activeStudents: number;
    totalQuestions: number;
    totalExams: number;
    passRate: number;
    recentStudents: { name: string }[];
}

@Injectable()
export class LandingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService
    ) {}

    async getStats(): Promise<LandingStatsResponse> {
        const [activeStudents, totalQuestions, totalExams, attempts, recentStudents] = await Promise.all([
            this.prisma.user.count({ where: { role: 'STUDENT' } }),
            this.prisma.question.count(),
            this.prisma.exam.count(),
            this.prisma.attempt.findMany({
                select: {
                    score: true,
                    exam: {
                        select: {
                            passingScore: true,
                        },
                    },
                },
            }),
            this.prisma.user.findMany({
                where: { role: 'STUDENT' },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { name: true }
            })
        ]);

        const passRate =
            attempts.length === 0
                ? 0
                : Math.round(
                      (attempts.filter((attempt) => attempt.score >= attempt.exam.passingScore).length / attempts.length) * 100,
                  );

        return {
            activeStudents,
            totalQuestions,
            totalExams,
            passRate,
            recentStudents
        };
    }

    async sendContactEmail(dto: ContactEmailDto) {
        return this.emailService.sendContactEmail(dto);
    }
}
