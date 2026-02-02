import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.student.findMany();
    }

    async findOne(id: number) {
        return this.prisma.student.findUnique({
            where: { id },
        });
    }
}
