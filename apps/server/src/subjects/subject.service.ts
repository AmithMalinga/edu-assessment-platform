import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.subject.findMany({
            include: { grade: true },
            orderBy: [{ gradeId: 'asc' }, { name: 'asc' }],
        });
    }

    async findByGrade(gradeId: number) {
        return this.prisma.subject.findMany({
            where: { gradeId },
            include: { grade: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllGrades() {
        return this.prisma.grade.findMany({
            include: { _count: { select: { subjects: true } } },
            orderBy: { id: 'asc' },
        });
    }
}
