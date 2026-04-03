import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGradeDto, CreateSubjectDto, UpdateGradeDto, UpdateSubjectDto } from './dto';

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

    async updateGrade(userId: string, id: number, dto: UpdateGradeDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can update grades');
        }

        const grade = await this.prisma.grade.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!grade) {
            throw new NotFoundException('Grade not found');
        }

        const name = dto.name.trim();
        if (!name) {
            throw new BadRequestException('Grade name is required');
        }

        return this.prisma.grade.update({
            where: { id },
            data: { name },
            include: { _count: { select: { subjects: true } } },
        });
    }

    async deleteGrade(userId: string, id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can delete grades');
        }

        const grade = await this.prisma.grade.findUnique({
            where: { id },
            include: { subjects: true },
        });

        if (!grade) {
            throw new NotFoundException('Grade not found');
        }

        if (grade.subjects.length > 0) {
            throw new BadRequestException('Cannot delete grade with existing subjects. Please delete all subjects first.');
        }

        return this.prisma.grade.delete({
            where: { id },
        });
    }

    async updateSubject(userId: string, id: string, dto: UpdateSubjectDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can update subjects');
        }

        const subject = await this.prisma.subject.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        const name = dto.name.trim();
        if (!name) {
            throw new BadRequestException('Subject name is required');
        }

        return this.prisma.subject.update({
            where: { id },
            data: { name },
            include: { grade: true },
        });
    }

    async deleteSubject(userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can delete subjects');
        }

        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: { questions: true },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        if (subject.questions.length > 0) {
            throw new BadRequestException('Cannot delete subject with existing questions. Please delete all questions first.');
        }

        return this.prisma.subject.delete({
            where: { id },
        });
    }
}
