import { Controller, Get } from '@nestjs/common';

@Controller('subjects')
export class SubjectController {
  @Get()
  findAll() {
    // TODO: Return all subjects
    return [];
  }
}
