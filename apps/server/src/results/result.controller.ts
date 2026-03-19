import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  findAll() {
    return this.resultService.findAll();
  }

  @Get('recent')
  getRecentAttempts(@Query('limit') limit?: string) {
    return this.resultService.getRecentAttempts(limit ? +limit : 20);
  }

  @Get('top-performers')
  getTopPerformers(@Query('limit') limit?: string) {
    return this.resultService.getTopPerformers(limit ? +limit : 10);
  }

  @Get('student/:userId')
  findByStudent(@Param('userId') userId: string) {
    return this.resultService.findByStudent(userId);
  }

  @Get('student/:userId/stats')
  getStudentStats(@Param('userId') userId: string) {
    return this.resultService.getStudentStats(userId);
  }

  @Get('exam/:examId')
  findByExam(@Param('examId') examId: string) {
    return this.resultService.findByExam(examId);
  }

  @Get('exam/:examId/stats')
  getExamStats(@Param('examId') examId: string) {
    return this.resultService.getExamStats(examId);
  }

  @Get('exam/:examId/leaderboard')
  getLeaderboard(@Param('examId') examId: string, @Query('limit') limit?: string) {
    return this.resultService.getLeaderboard(examId, limit ? +limit : 10);
  }

  @Get('exam/:examId/passed')
  getPassedAttempts(@Param('examId') examId: string) {
    return this.resultService.getPassedAttempts(examId);
  }

  @Get('exam/:examId/failed')
  getFailedAttempts(@Param('examId') examId: string) {
    return this.resultService.getFailedAttempts(examId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(id);
  }
}
