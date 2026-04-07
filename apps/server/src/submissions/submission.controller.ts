import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmitExamDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService) {}

    @Post()
    submit(@Request() req, @Body() dto: SubmitExamDto) {
        return this.submissionService.submit(req.user.userId, dto);
    }

    @Get('me')
    findMine(@Request() req) {
        return this.submissionService.findByStudent(req.user.userId);
    }

    @Get('me/analytics')
    getMyAnalytics(@Request() req) {
        return this.submissionService.getMyAnalytics(req.user.userId);
    }

    @Get(':id/review')
    getAttemptReview(@Request() req, @Param('id') id: string) {
        return this.submissionService.getAttemptReview(req.user.userId, id);
    }

    @Get()
    findAll() {
        return this.submissionService.findAll();
    }

    @Get('student/:userId')
    findByStudent(@Param('userId') userId: string) {
        return this.submissionService.findByStudent(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.submissionService.findOne(id);
    }
}
