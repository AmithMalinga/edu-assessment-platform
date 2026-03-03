import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';

@Module({
  controllers: [SubjectController],
  providers: [],
})
export class SubjectModule {}
