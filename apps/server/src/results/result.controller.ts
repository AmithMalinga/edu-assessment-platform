import { Controller, Get, Param } from '@nestjs/common';

@Controller('results')
export class ResultController {
  @Get()
  findAll() {
    // TODO: Return all results
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Return result by id
    return {};
  }
}
