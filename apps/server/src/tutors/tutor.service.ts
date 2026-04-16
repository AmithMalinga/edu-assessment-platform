import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { TutorRegisterDto } from './dto/tutor-register.dto';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TutorService {
  private mailTransporter: nodemailer.Transporter | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private getTransporter() {
    if (this.mailTransporter) return this.mailTransporter;

    const host = this.configService.get<string>('SMTP_HOST');
    const portValue = this.configService.get<string>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

    if (!host || !portValue || !user || !pass) {
      return null;
    }

    this.mailTransporter = nodemailer.createTransport({
      host,
      port: Number(portValue),
      secure,
      auth: {
        user,
        pass,
      },
    });

    return this.mailTransporter;
  }

  private generateTemporaryPassword(): string {
    return randomBytes(8).toString('hex');
  }

  /**
   * Register a new tutor
   */
  async registerTutor(
    registerDto: TutorRegisterDto,
  ): Promise<{
    message: string;
    registration: any;
  }> {
    // Check if email already exists (registered user or pending registration)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: this.normalizeEmail(registerDto.email) },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const existingRegistration =
      await this.prisma.tutorRegistration.findUnique({
        where: { email: this.normalizeEmail(registerDto.email) },
      });

    if (existingRegistration) {
      throw new ConflictException(
        'Tutor registration with this email already exists',
      );
    }

    // Check if username is available
    await this.checkUsernameAvailability(registerDto.username);

    // Must agree to terms
    if (!registerDto.agreedToTerms) {
      throw new BadRequestException('You must agree to terms and conditions');
    }

    // Create tutor registration request
    const tutorRegistration = await this.prisma.tutorRegistration.create({
      data: {
        name: registerDto.name,
        email: this.normalizeEmail(registerDto.email),
        phone: registerDto.phone,
        subject: registerDto.subject,
        studentCount: registerDto.studentCount,
        username: registerDto.username.toLowerCase(),
        agreedToTerms: true,
      },
    });

    return {
      message:
        'Registration submitted successfully. You will receive an email with the decision.',
      registration: {
        id: tutorRegistration.id,
        email: tutorRegistration.email,
        status: tutorRegistration.status,
      },
    };
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const normalized = username.toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { username: normalized },
    });

    const existingRegistration = await this.prisma.tutorRegistration.findUnique({
      where: { username: normalized },
    });

    if (existingUser || existingRegistration) {
      throw new ConflictException('Username is already taken');
    }

    return { available: true };
  }

  /**
   * Get all tutor registration requests (admin only)
   */
  async getPendingRegistrations(status?: string) {
    return this.prisma.tutorRegistration.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin: Get tutor registration statistics
   */
  async getTutorStats() {
    const [pendingCount, approvedTodayCount, recentRejectionsCount] =
      await Promise.all([
        this.prisma.tutorRegistration.count({
          where: { status: 'PENDING' },
        }),
        this.prisma.tutorRegistration.count({
          where: {
            status: 'APPROVED',
            reviewedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        this.prisma.tutorRegistration.count({
          where: {
            status: 'REJECTED',
            reviewedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    return {
      pendingCount,
      approvedTodayCount,
      recentRejectionsCount,
    };
  }

  /**
   * Get single tutor registration (admin only)
   */
  async getRegistrationById(id: string) {
    const registration = await this.prisma.tutorRegistration.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Tutor registration not found');
    }

    return registration;
  }

  /**
   * Approve tutor registration and create user account
   */
  async approveTutorRegistration(
    registrationId: string,
    adminId: string,
  ): Promise<{
    message: string;
    tutor: any;
    credentials: { username: string; temporaryPassword: string };
  }> {
    const registration = await this.getRegistrationById(registrationId);

    if (registration.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending registrations can be approved',
      );
    }

    // Pre-check duplicate fields to return a clear, field-level error to admin UI.
    const [existingByEmail, existingByPhone, existingByUsername] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: registration.email }, select: { id: true } }),
      this.prisma.user.findUnique({ where: { phone: registration.phone }, select: { id: true } }),
      this.prisma.user.findUnique({ where: { username: registration.username }, select: { id: true } }),
    ]);

    const conflicts: string[] = [];
    if (existingByEmail) conflicts.push('email');
    if (existingByPhone) conflicts.push('phone');
    if (existingByUsername) conflicts.push('username');

    if (conflicts.length > 0) {
      throw new ConflictException({
        message: 'Cannot approve tutor registration because some fields are already used.',
        conflicts,
        details: conflicts.map((field) => `Duplicate ${field} found in existing users.`),
      });
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    let tutor: {
      id: string;
      email: string;
      username: string | null;
      name: string;
    };

    try {
      // Create tutor user
      tutor = await this.prisma.user.create({
        data: {
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          username: registration.username,
          password: hashedPassword,
          role: 'TUTOR',
          subject: registration.subject,
          studentCount: registration.studentCount,
          requiresPasswordChange: true,
          age: 0, // Required field, but not applicable for tutors
          educationalLevel: 'N/A', // Required field
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
        },
      });

      // Update tutor registration
      await this.prisma.tutorRegistration.update({
        where: { id: registrationId },
        data: {
          status: 'APPROVED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          userId: tutor.id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = Array.isArray(error.meta?.target)
            ? (error.meta?.target as string[])
            : [];
          const mapped = target
            .map((item) => item.toString().replace(/.*\./, '').toLowerCase())
            .filter((item) => ['email', 'phone', 'username'].includes(item));

          throw new ConflictException(
            mapped.length
              ? {
                  message: 'Cannot approve tutor registration because some fields are already used.',
                  conflicts: mapped,
                  details: mapped.map((field) => `Duplicate ${field} found in existing users.`),
                }
              : 'Cannot approve tutor because email, phone, or username is already used by another account.',
          );
        }

        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid relationship data while approving tutor.');
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Tutor registration record was not found during approval.');
        }
      }

      throw new InternalServerErrorException('Failed to approve tutor registration.');
    }

    // Send approval email
    await this.sendApprovalEmail(
      tutor.email,
      tutor.username ?? registration.username,
      temporaryPassword,
    );

    return {
      message: 'Tutor approved successfully. Credentials sent via email.',
      tutor: {
        id: tutor.id,
        email: tutor.email,
        username: tutor.username,
        name: tutor.name,
      },
      credentials: {
        username: tutor.username,
        temporaryPassword,
      },
    };
  }

  /**
   * Reject tutor registration
   */
  async rejectTutorRegistration(
    registrationId: string,
    adminId: string,
    rejectionReason?: string,
  ): Promise<{ message: string }> {
    const registration = await this.getRegistrationById(registrationId);

    if (registration.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending registrations can be rejected',
      );
    }

    await this.prisma.tutorRegistration.update({
      where: { id: registrationId },
      data: {
        status: 'REJECTED',
        rejectionReason,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    // Send rejection email
    await this.sendRejectionEmail(registration.email, rejectionReason);

    return { message: 'Tutor registration rejected' };
  }

  /**
   * Send approval email with credentials
   */
  private async sendApprovalEmail(
    email: string,
    username: string,
    temporaryPassword: string,
  ): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) return;

    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    const htmlContent = `
      <h2>Welcome to Our Tutoring Platform!</h2>
      <p>Dear ${username},</p>
      <p>Congratulations! Your tutor registration has been <strong>approved</strong>.</p>
      <p>Here are your login credentials:</p>
      <ul>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
      </ul>
      <p><a href="${appUrl}/auth/tutor-login">Click here to login</a></p>
      <p><strong>Important:</strong> You must change your password on your first login.</p>
      <p>Best regards,<br/>The Admin Team</p>
    `;

    try {
      await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: email,
        subject: 'Tutor Registration Approved - Your Credentials',
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending approval email:', error);
    }
  }

  /**
   * Send rejection email
   */
  private async sendRejectionEmail(
    email: string,
    reason?: string,
  ): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) return;

    const htmlContent = `
      <h2>Tutor Registration Status</h2>
      <p>Dear Applicant,</p>
      <p>Unfortunately, your tutor registration has been <strong>rejected</strong>.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br/>The Admin Team</p>
    `;

    try {
      await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: email,
        subject: 'Tutor Registration Decision',
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending rejection email:', error);
    }
  }
}
