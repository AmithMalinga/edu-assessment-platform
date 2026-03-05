import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('submissions')
export class SubmissionController {
  @Get()
  findAll() {
    // TODO: Return all submissions
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Return submission by id
    return {};
  }

  @Post()
  create(@Body() dto: any) {
    // TODO: Create new submission
    return {};
  }
}
