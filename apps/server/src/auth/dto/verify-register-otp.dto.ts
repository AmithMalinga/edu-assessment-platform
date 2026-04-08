import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class VerifyRegisterOtpDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'OTP is required' })
    @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit code' })
    otp: string;
}