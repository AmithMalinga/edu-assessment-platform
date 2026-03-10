import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

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

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                age: user.age,
                educationalLevel: user.educationalLevel,
                role: user.role
            }
        };
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

        // Generate token
        const payload = { email: user.email, sub: user.id, role: user.role };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: result
        };
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
