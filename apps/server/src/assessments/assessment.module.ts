import { Module } from '@nestjs/common';
import { AssessmentController } from './assessment.controller';

@Module({
  controllers: [AssessmentController],
  providers: [],
})
export class AssessmentModule {}
