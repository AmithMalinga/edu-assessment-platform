import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService, ContactEmailDto } from '../email/email.service';

export interface LandingStatsResponse {
    activeStudents: number;
    totalQuestions: number;
    totalExams: number;
    passRate: number;
}

@Injectable()
export class LandingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService
    ) {}

    async getStats(): Promise<LandingStatsResponse> {
        const [activeStudents, totalQuestions, totalExams, attempts] = await Promise.all([
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
        };
    }

    async sendContactEmail(dto: ContactEmailDto) {
        return this.emailService.sendContactEmail(dto);
    }
}
