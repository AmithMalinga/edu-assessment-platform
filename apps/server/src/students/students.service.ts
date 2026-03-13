import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    private readonly safeSelect = {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        educationalLevel: true,
        role: true,
        createdAt: true,
    };

    async findAll() {
        return this.prisma.user.findMany({
            where: { role: 'STUDENT' },
            select: this.safeSelect,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: this.safeSelect,
        });
    }
}
