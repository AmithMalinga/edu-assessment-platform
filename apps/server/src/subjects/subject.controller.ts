import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @Get()
    findAll() {
        return this.subjectService.findAll();
    }

    @Get('grade/:gradeId')
    findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number) {
        return this.subjectService.findByGrade(gradeId);
    }
}
