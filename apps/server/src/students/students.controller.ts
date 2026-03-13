import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Get()
    async findAll() {
        return this.studentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }
}
