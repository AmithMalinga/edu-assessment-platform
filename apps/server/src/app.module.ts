import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';


import { StudentsModule } from './students/students.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './questions/question.module';
import { AssessmentModule } from './assessments/assessment.module';
import { SubmissionModule } from './submissions/submission.module';
import { ResultModule } from './results/result.module';
import { SubjectModule } from './subjects/subject.module';
import { LandingModule } from './landing/landing.module';
import { TutorModule } from './tutors/tutor.module';
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        StudentsModule,
        TestimonialsModule,
        QuestionModule,
        AssessmentModule,
        SubmissionModule,
        ResultModule,
        SubjectModule,
        LandingModule,
        TutorModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
