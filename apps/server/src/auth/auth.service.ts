import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

type SanitizedUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    educationalLevel: string;
    role: string;
};

type GoogleAuthUser = {
    email: string;
    name: string;
    googleId: string;
};

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

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
    }): SanitizedUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            age: user.age,
            educationalLevel: user.educationalLevel,
            role: user.role,
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

    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email: registerDto.email }
        });

        if (existingUserByEmail) {
            throw new ConflictException('Email already registered');
        }

        const existingUserByPhone = await this.prisma.user.findUnique({
            where: { phone: registerDto.phone }
        });

        if (existingUserByPhone) {
            throw new ConflictException('Phone number already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                name: registerDto.name,
                email: registerDto.email,
                phone: registerDto.phone,
                age: registerDto.age,
                educationalLevel: registerDto.educationalLevel,
                password: hashedPassword,
                role: 'STUDENT'
            }
        });

        // Remove password from response
        const { password, ...result } = user;

        return this.toAuthResponse(this.sanitizeUser(result));
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
}
