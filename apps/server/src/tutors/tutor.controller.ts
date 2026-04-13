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
   * Public: Check if username is available
   */
  @Post('check-username')
  async checkUsername(@Body() checkUsernameDto: CheckUsernameDto) {
    return this.tutorService.checkUsernameAvailability(
      checkUsernameDto.username,
    );
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

    return this.tutorService.approveTutorRegistration(id, req.user.id);
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
      req.user.id,
      body.rejectionReason,
    );
  }
}
