import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGradeDto, CreateSubjectDto, UpdateGradeDto, UpdateSubjectDto } from './dto';

@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @UseGuards(JwtAuthGuard)
    @Post('grades')
    createGrade(@Req() req: any, @Body() dto: CreateGradeDto) {
        return this.subjectService.createGrade(req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('grades/:id')
    updateGrade(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGradeDto) {
        return this.subjectService.updateGrade(req.user.userId, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('grades/:id')
    deleteGrade(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.subjectService.deleteGrade(req.user.userId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req: any, @Body() dto: CreateSubjectDto) {
        return this.subjectService.create(req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateSubject(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSubjectDto) {
        return this.subjectService.updateSubject(req.user.userId, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteSubject(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
        return this.subjectService.deleteSubject(req.user.userId, id);
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
