import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { LoginDto } from './dto/login.dto';
import { RequestRegisterOtpDto } from './dto/request-register-otp.dto';
import { VerifyRegisterOtpDto } from './dto/verify-register-otp.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { createHash, randomInt, randomUUID } from 'crypto';

type SanitizedUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    educationalLevel: string;
    role: string;
    username?: string;
    requiresPasswordChange?: boolean;
};

type GoogleAuthUser = {
    email: string;
    name: string;
    googleId: string;
};

type PendingEmailVerification = {
    otpHash: string;
    expiresAt: number;
    sentAt: number;
    attempts: number;
    verifiedAt?: number;
    verificationToken?: string;
};

type RegisterOtpResponse = {
    message: string;
    expiresInSeconds: number;
};

type VerifyOtpResponse = {
    message: string;
    emailVerificationToken: string;
};

@Injectable()
export class AuthService {
    private readonly OTP_EXPIRY_MS = 10 * 60 * 1000;
    private readonly OTP_RESEND_COOLDOWN_MS = 60 * 1000;
    private readonly OTP_MAX_ATTEMPTS = 5;
    private readonly VERIFICATION_TOKEN_EXPIRY_MS = 20 * 60 * 1000;
    private readonly emailVerificationStore = new Map<string, PendingEmailVerification>();
    private mailTransporter: nodemailer.Transporter | null = null;

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    private hashOtp(otp: string) {
        return createHash('sha256').update(otp).digest('hex');
    }

    private generateOtp() {
        return randomInt(100000, 1000000).toString();
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

    private async sendRegistrationOtpEmail(email: string, otp: string) {
        const transporter = this.getTransporter();
        const from = this.configService.get<string>('SMTP_FROM') || 'ExamMaster <no-reply@exammaster.local>';

        if (!transporter) {
            console.log(`Email OTP for ${email}: ${otp}`);
            return;
        }

        await transporter.sendMail({
            from,
            to: email,
            subject: 'Your ExamMaster verification code',
            text: `Your verification code is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`,
        });
    }

    private getVerificationRecord(email: string) {
        const normalizedEmail = this.normalizeEmail(email);
        const record = this.emailVerificationStore.get(normalizedEmail);

        if (!record) {
            throw new BadRequestException('No OTP request found for this email');
        }

        if (Date.now() > record.expiresAt) {
            this.emailVerificationStore.delete(normalizedEmail);
            throw new BadRequestException('OTP has expired. Request a new code');
        }

        return { normalizedEmail, record };
    }

    private toAuthResponse(user: SanitizedUser) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    private sanitizeUser(user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        age: number;
        educationalLevel: string;
        role: string;
        username?: string;
        requiresPasswordChange?: boolean;
    }): SanitizedUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            age: user.age,
            educationalLevel: user.educationalLevel,
            role: user.role,
            ...(user.username && { username: user.username }),
            ...(user.requiresPasswordChange !== undefined && { requiresPasswordChange: user.requiresPasswordChange }),
        };
    }

    async validateUser(email: string, pass: string): Promise<any | null> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            return null;
        }

        const { password, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.toAuthResponse(this.sanitizeUser(user));
    }

    private async ensureUserCanRegister(registerDto: RegisterDto) {
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUserByEmail) {
            throw new ConflictException('Email already registered');
        }

        const existingUserByPhone = await this.prisma.user.findUnique({
            where: { phone: registerDto.phone },
        });

        if (existingUserByPhone) {
            throw new ConflictException('Phone number already registered');
        }
    }

    private async createUser(registerDto: RegisterDto, role: 'STUDENT' | 'ADMIN') {
        await this.ensureUserCanRegister(registerDto);

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: registerDto.name,
                email: registerDto.email,
                phone: registerDto.phone,
                age: registerDto.age,
                educationalLevel: registerDto.educationalLevel,
                password: hashedPassword,
                role,
            },
        });

        const { password, ...result } = user;
        return this.toAuthResponse(this.sanitizeUser(result));
    }

    async requestRegisterOtp(requestOtpDto: RequestRegisterOtpDto): Promise<RegisterOtpResponse> {
        const email = this.normalizeEmail(requestOtpDto.email);
        const existingUserByEmail = await this.prisma.user.findUnique({ where: { email } });
        if (existingUserByEmail) {
            throw new ConflictException('Email already registered');
        }

        const existingRecord = this.emailVerificationStore.get(email);
        if (existingRecord && Date.now() < existingRecord.expiresAt && Date.now() - existingRecord.sentAt < this.OTP_RESEND_COOLDOWN_MS) {
            throw new HttpException('Please wait before requesting another OTP', HttpStatus.TOO_MANY_REQUESTS);
        }

        const otp = this.generateOtp();
        this.emailVerificationStore.set(email, {
            otpHash: this.hashOtp(otp),
            expiresAt: Date.now() + this.OTP_EXPIRY_MS,
            sentAt: Date.now(),
            attempts: 0,
        });

        await this.sendRegistrationOtpEmail(email, otp);

        return {
            message: 'OTP sent to your email address',
            expiresInSeconds: Math.floor(this.OTP_EXPIRY_MS / 1000),
        };
    }

    async verifyRegisterOtp(verifyOtpDto: VerifyRegisterOtpDto): Promise<VerifyOtpResponse> {
        const { normalizedEmail, record } = this.getVerificationRecord(verifyOtpDto.email);

        if (record.attempts >= this.OTP_MAX_ATTEMPTS) {
            this.emailVerificationStore.delete(normalizedEmail);
            throw new HttpException('Too many failed attempts. Request a new OTP', HttpStatus.TOO_MANY_REQUESTS);
        }

        if (record.otpHash !== this.hashOtp(verifyOtpDto.otp)) {
            record.attempts += 1;
            this.emailVerificationStore.set(normalizedEmail, record);
            throw new BadRequestException('Invalid OTP');
        }

        const emailVerificationToken = randomUUID();
        record.verifiedAt = Date.now();
        record.verificationToken = emailVerificationToken;
        this.emailVerificationStore.set(normalizedEmail, record);

        return {
            message: 'Email verified successfully',
            emailVerificationToken,
        };
    }

    async register(registerDto: CompleteRegistrationDto) {
        const email = this.normalizeEmail(registerDto.email);
        const { record } = this.getVerificationRecord(email);

        if (!record.verifiedAt || !record.verificationToken) {
            throw new BadRequestException('Email verification is required before registration');
        }

        const tokenAge = Date.now() - record.verifiedAt;
        if (tokenAge > this.VERIFICATION_TOKEN_EXPIRY_MS) {
            this.emailVerificationStore.delete(email);
            throw new BadRequestException('Email verification expired. Verify your email again');
        }

        if (registerDto.emailVerificationToken !== record.verificationToken) {
            throw new BadRequestException('Invalid email verification token');
        }

        const registerPayload: RegisterDto = {
            name: registerDto.name,
            email,
            phone: registerDto.phone,
            age: registerDto.age,
            educationalLevel: registerDto.educationalLevel,
            password: registerDto.password,
        };

        const response = await this.createUser(registerPayload, 'STUDENT');
        this.emailVerificationStore.delete(email);
        return response;
    }

    async registerAdmin(registerDto: RegisterDto, providedSecret?: string) {
        const configuredSecret = this.configService.get<string>('ADMIN_REGISTRATION_SECRET');
        if (!configuredSecret || providedSecret !== configuredSecret) {
            throw new UnauthorizedException('Invalid admin registration secret');
        }

        return this.createUser(registerDto, 'ADMIN');
    }

    async validateOrCreateGoogleUser(data: GoogleAuthUser) {
        const existingByEmail = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingByEmail) {
            const { password, ...result } = existingByEmail;
            return this.sanitizeUser(result);
        }

        const generatedPassword = await bcrypt.hash(`google-${data.googleId}-${Date.now()}`, 10);
        const generatedPhone = `google-${data.googleId}`;

        const created = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: generatedPhone,
                age: 16,
                educationalLevel: 'Grade 11',
                password: generatedPassword,
                role: 'STUDENT',
            },
        });

        const { password, ...result } = created;
        return this.sanitizeUser(result);
    }

    async googleLogin(googleUser: GoogleAuthUser) {
        const user = await this.validateOrCreateGoogleUser(googleUser);
        return this.toAuthResponse(user);
    }

    buildFrontendAuthCallbackUrl(token: string) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const callbackUrl = new URL('/auth/callback', frontendUrl);
        callbackUrl.searchParams.set('token', token);
        return callbackUrl.toString();
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                educationalLevel: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Validate new password (at least 8 characters)
        if (!newPassword || newPassword.length < 8) {
            throw new BadRequestException('New password must be at least 8 characters');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                requiresPasswordChange: false,
            },
        });

        return { message: 'Password changed successfully' };
    }
}
