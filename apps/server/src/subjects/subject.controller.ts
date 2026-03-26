import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGradeDto, CreateSubjectDto } from './dto';

@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @UseGuards(JwtAuthGuard)
    @Post('grades')
    createGrade(@Req() req: any, @Body() dto: CreateGradeDto) {
        return this.subjectService.createGrade(req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req: any, @Body() dto: CreateSubjectDto) {
        return this.subjectService.create(req.user.userId, dto);
    }

    @Get('grades')
    findAllGrades() {
        return this.subjectService.findAllGrades();
    }

    @Get()
    findAll() {
        return this.subjectService.findAll();
    }

    @Get('grade/:gradeId')
    findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number) {
        return this.subjectService.findByGrade(gradeId);
    }
}
