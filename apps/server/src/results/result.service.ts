import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.attempt.findMany({
      include: { user: true, exam: true },
      orderBy: { completedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id },
      include: { user: true, exam: true },
    });
    if (!attempt) throw new NotFoundException(`Result with id ${id} not found`);
    return attempt;
  }

  async findByStudent(userId: string) {
    return this.prisma.attempt.findMany({
      where: { userId },
      include: { exam: true },
      orderBy: { completedAt: 'desc' },
    });
  }

  async findByExam(examId: string) {
    return this.prisma.attempt.findMany({
      where: { examId },
      include: { user: true },
      orderBy: { completedAt: 'desc' },
    });
  }

  async getStudentStats(userId: string) {
    const attempts = await this.prisma.attempt.findMany({
      where: { userId },
      include: { exam: true },
    });

    if (!attempts.length) return { userId, totalAttempts: 0 };

    const totalAttempts = attempts.length;
    const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts;
    const avgTimeTaken = attempts.reduce((sum, a) => sum + a.timeTaken, 0) / totalAttempts;
    const passed = attempts.filter((a) => a.score >= a.exam.passingScore).length;
    const passRate = (passed / totalAttempts) * 100;
    const highestScore = Math.max(...attempts.map((a) => a.score));
    const lowestScore = Math.min(...attempts.map((a) => a.score));

    return {
      userId,
      totalAttempts,
      avgScore: Math.round(avgScore * 100) / 100,
      avgTimeTaken: Math.round(avgTimeTaken),
      passRate: Math.round(passRate * 100) / 100,
      highestScore,
      lowestScore,
    };
  }

  async getExamStats(examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException(`Exam with id ${examId} not found`);

    const attempts = await this.prisma.attempt.findMany({ where: { examId } });

    if (!attempts.length) return { examId, totalAttempts: 0 };

    const totalAttempts = attempts.length;
    const scores = attempts.map((a) => a.score);
    const avgScore = scores.reduce((s, v) => s + v, 0) / totalAttempts;
    const passed = attempts.filter((a) => a.score >= exam.passingScore).length;

    return {
      examId,
      title: exam.title,
      passingScore: exam.passingScore,
      totalAttempts,
      avgScore: Math.round(avgScore * 100) / 100,
      maxScore: Math.max(...scores),
      minScore: Math.min(...scores),
      passRate: Math.round((passed / totalAttempts) * 10000) / 100,
      passCount: passed,
      failCount: totalAttempts - passed,
    };
  }

  async getLeaderboard(examId: string, limit = 10) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException(`Exam with id ${examId} not found`);

    const attempts = await this.prisma.attempt.findMany({
      where: { examId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }],
      take: limit,
    });

    return attempts.map((a, index) => ({
      rank: index + 1,
      userId: a.userId,
      name: a.user.name,
      email: a.user.email,
      score: a.score,
      timeTaken: a.timeTaken,
      completedAt: a.completedAt,
    }));
  }

  async getTopPerformers(limit = 10) {
    const attempts = await this.prisma.attempt.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, exam: true },
    });

    const byStudent = new Map<string, { name: string; email: string; scores: number[] }>();
    for (const a of attempts) {
      if (!byStudent.has(a.userId)) {
        byStudent.set(a.userId, { name: a.user.name, email: a.user.email, scores: [] });
      }
      byStudent.get(a.userId)!.scores.push(a.score);
    }

    return Array.from(byStudent.entries())
      .map(([userId, data]) => ({
        userId,
        name: data.name,
        email: data.email,
        avgScore: Math.round((data.scores.reduce((s, v) => s + v, 0) / data.scores.length) * 100) / 100,
        totalAttempts: data.scores.length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, limit);
  }

  async getPassedAttempts(examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException(`Exam with id ${examId} not found`);

    return this.prisma.attempt.findMany({
      where: { examId, score: { gte: exam.passingScore } },
      include: { user: true },
      orderBy: { score: 'desc' },
    });
  }

  async getFailedAttempts(examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException(`Exam with id ${examId} not found`);

    return this.prisma.attempt.findMany({
      where: { examId, score: { lt: exam.passingScore } },
      include: { user: true },
      orderBy: { score: 'desc' },
    });
  }

  async getRecentAttempts(limit = 20) {
    return this.prisma.attempt.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, exam: true },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.attempt.delete({ where: { id } });
  }
}
