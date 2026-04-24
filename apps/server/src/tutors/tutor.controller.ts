import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorRegisterDto } from './dto/tutor-register.dto';
import { ApproveRejectTutorDto, CheckUsernameDto } from './dto/tutor-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tutors')
export class TutorController {
  constructor(private tutorService: TutorService) {}

  /**
   * Public: Register as a tutor
   */
  @Post('register')
  async registerTutor(@Body() registerDto: TutorRegisterDto) {
    return this.tutorService.registerTutor(registerDto);
  }

  /**
   * Tutor: Get or generate tutor code
   */
  @UseGuards(JwtAuthGuard)
  @Get('code')
  async getTutorCode(@Request() req) {
    if (req.user.role !== 'TUTOR') {
      throw new ForbiddenException('Only tutors can access their code');
    }
    return this.tutorService.getTutorCode(req.user.userId);
  }

  /**
   * Student: Assign themselves to a tutor
   */
  @UseGuards(JwtAuthGuard)
  @Post('assign')
  async assignToTutor(
    @Request() req,
    @Body() body: { tutorCode: string; consentGiven: boolean },
  ) {
    if (req.user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can assign themselves to tutors');
    }
    return this.tutorService.assignStudentToTutor(
      req.user.userId,
      body.tutorCode,
      body.consentGiven,
    );
  }

  /**
   * Tutor: Get all their assigned students
   */
  @UseGuards(JwtAuthGuard)
  @Get('students')
  async getTutorStudents(@Request() req) {
    if (req.user.role !== 'TUTOR') {
      throw new ForbiddenException('Only tutors can view their students');
    }
    return this.tutorService.getTutorStudents(req.user.userId);
  }

  /**
   * Student: Get their assigned tutors
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-tutors')
  async getMyTutors(@Request() req) {
    if (req.user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can view their tutors');
    }
    return this.tutorService.getStudentTutors(req.user.userId);
  }

  /**
   * Student: Remove a tutor assignment
   */
  @UseGuards(JwtAuthGuard)
  @Post(':tutorId/remove')
  async removeMyTutor(
    @Request() req,
    @Param('tutorId') tutorId: string,
  ) {
    if (req.user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can remove tutors');
    }
    return this.tutorService.removeStudentTutor(req.user.userId, tutorId);
  }

  /**
   * Admin: Get all student-tutor associations
   */
  @UseGuards(JwtAuthGuard)
  @Get('associations')
  async getAllAssociations(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view student-tutor associations');
    }
    return this.tutorService.getAllStudentTutorAssociations();
  }

  /**
   * Public: Check if username is available
   */
  @Post('check-username')
  async checkUsername(@Body() checkUsernameDto: CheckUsernameDto) {
    return this.tutorService.checkUsernameAvailability(
      checkUsernameDto.username,
    );
  }

  /**
   * Admin: Get tutor registration statistics
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view tutor stats');
    }

    return this.tutorService.getTutorStats();
  }

  /**
   * Admin: Get all tutor registrations (with optional status filter)
   */
  @UseGuards(JwtAuthGuard)
  @Get('registrations')
  async getRegistrations(
    @Request() req,
    @Query('status') status?: string,
  ) {
    // Verify admin role
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view tutor registrations');
    }

    return this.tutorService.getPendingRegistrations(status);
  }

  /**
   * Admin: Get single registration
   */
  @UseGuards(JwtAuthGuard)
  @Get('registrations/:id')
  async getRegistration(
    @Request() req,
    @Param('id') id: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view tutor registrations');
    }

    return this.tutorService.getRegistrationById(id);
  }

  /**
   * Admin: Approve tutor registration
   */
  @UseGuards(JwtAuthGuard)
  @Patch('registrations/:id/approve')
  async approveTutor(
    @Request() req,
    @Param('id') id: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can approve tutor registrations');
    }

    return this.tutorService.approveTutorRegistration(id, req.user.userId);
  }

  /**
   * Admin: Reject tutor registration
   */
  @UseGuards(JwtAuthGuard)
  @Patch('registrations/:id/reject')
  async rejectTutor(
    @Request() req,
    @Param('id') id: string,
    @Body() body: ApproveRejectTutorDto,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can reject tutor registrations');
    }

    return this.tutorService.rejectTutorRegistration(
      id,
      req.user.userId,
      body.rejectionReason,
    );
  }
}
