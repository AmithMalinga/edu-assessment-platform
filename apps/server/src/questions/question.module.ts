import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { PrismaService } from '../prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [QuestionController],
  providers: [QuestionService, PrismaService],
})
export class QuestionModule {}
