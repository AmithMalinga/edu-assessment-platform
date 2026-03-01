import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto, GetRandomQuestionsDto } from './dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('random-set')
  getRandomSet(@Query() query: GetRandomQuestionsDto) {
    const noOfQuestions = query.noOfQuestions ? parseInt(query.noOfQuestions, 10) : 10;
    return this.questionService.getRandomQuestions({
      grade: query.grade,
      subjectId: query.subjectId,
      questionType: query.questionType,
      noOfQuestions,
    });
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
