import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Hardcoded user for testing
const HARDCODED_USER = {
    id: '1',
    email: 'admin@test.com',
    password: 'password123',
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
};

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any | null> {
        // Check against hardcoded credentials
        if (email === HARDCODED_USER.email && pass === HARDCODED_USER.password) {
            const { password, ...result } = HARDCODED_USER;
            return HARDCODED_USER;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }

    async register(registerDto: RegisterDto) {
        // For now, just reject registration attempts
        throw new ConflictException('Registration disabled - using hardcoded credentials');
    }
}
