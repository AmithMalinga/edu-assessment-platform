import { Controller, Request, Post, UseGuards, Body, Get, Req, Res, Headers, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { LoginDto } from './dto/login.dto';
import { RequestRegisterOtpDto } from './dto/request-register-otp.dto';
import { VerifyRegisterOtpDto } from './dto/verify-register-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: CompleteRegistrationDto) {
        return this.authService.register(registerDto);
    }

    @Post('register/request-otp')
    async requestRegisterOtp(@Body() requestOtpDto: RequestRegisterOtpDto) {
        return this.authService.requestRegisterOtp(requestOtpDto);
    }

    @Post('register/verify-otp')
    async verifyRegisterOtp(@Body() verifyOtpDto: VerifyRegisterOtpDto) {
        return this.authService.verifyRegisterOtp(verifyOtpDto);
    }

    @Post('register-admin')
    async registerAdmin(
        @Body() registerDto: RegisterDto,
        @Headers('x-admin-registration-secret') adminRegistrationSecret?: string,
    ) {
        return this.authService.registerAdmin(registerDto, adminRegistrationSecret);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.authService.getProfile(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    async changePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
        return this.authService.changePassword(req.user.userId, body.currentPassword, body.newPassword);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleAuth() {
        return;
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        const auth = await this.authService.googleLogin(req.user);
        const callbackUrl = this.authService.buildFrontendAuthCallbackUrl(auth.access_token);
        return res.redirect(callbackUrl);
    }
}
