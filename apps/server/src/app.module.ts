import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        StudentsModule,
        TestimonialsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
