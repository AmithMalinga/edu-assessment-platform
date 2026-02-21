import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';

@ApiTags('students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all students' })
    @ApiResponse({ status: 200, description: 'Return all students.' })
    async findAll() {
        return this.studentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a student by id' })
    @ApiResponse({ status: 200, description: 'Return the student.' })
    async findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }
}
