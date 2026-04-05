import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import {
    AddQuestionDto,
    CreateAdminExamDto,
    CreateExamDto,
    GetRelevantQuestionsForExamDto,
    UpdateExamDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('assessments')
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) {}

    @UseGuards(JwtAuthGuard)
    @Get('admin/relevant-questions')
    getRelevantQuestions(@Req() req: any, @Query() query: GetRelevantQuestionsForExamDto) {
        return this.assessmentService.getRelevantQuestionsForAdmin(req.user.userId, query);
    }

    @UseGuards(JwtAuthGuard)
    @Post('admin/create-exam')
    createExamForAdmin(@Req() req: any, @Body() dto: CreateAdminExamDto) {
        return this.assessmentService.createExamForAdmin(req.user.userId, dto);
    }

    @Get()
    findAll() {
        return this.assessmentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.assessmentService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateExamDto) {
        return this.assessmentService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateExamDto) {
        return this.assessmentService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assessmentService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/questions')
    addQuestion(@Param('id') examId: string, @Body() dto: AddQuestionDto) {
        return this.assessmentService.addQuestion(examId, dto.questionId, dto.marks);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/questions/:questionId')
    removeQuestion(@Param('id') examId: string, @Param('questionId') questionId: string) {
        return this.assessmentService.removeQuestion(examId, questionId);
    }
}
