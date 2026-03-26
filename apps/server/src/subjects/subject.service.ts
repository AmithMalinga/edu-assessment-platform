import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGradeDto, CreateSubjectDto } from './dto';

@Injectable()
export class SubjectService {
    constructor(private prisma: PrismaService) {}

    async createGrade(userId: string, dto: CreateGradeDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can create grades');
        }

        const name = dto.name.trim();
        if (!name) {
            throw new BadRequestException('Grade name is required');
        }

        const existingGrade = await this.prisma.grade.findUnique({
            where: { id: dto.id },
            select: { id: true },
        });

        if (existingGrade) {
            throw new BadRequestException('Grade already exists');
        }

        return this.prisma.grade.create({
            data: {
                id: dto.id,
                name,
            },
        });
    }

    async create(userId: string, dto: CreateSubjectDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can create subjects');
        }

        const grade = await this.prisma.grade.findUnique({
            where: { id: dto.gradeId },
            select: { id: true },
        });

        if (!grade) {
            throw new NotFoundException('Grade not found');
        }

        const name = dto.name.trim();
        if (!name) {
            throw new BadRequestException('Subject name is required');
        }

        return this.prisma.subject.create({
            data: {
                name,
                gradeId: dto.gradeId,
            },
            include: { grade: true },
        });
    }

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
