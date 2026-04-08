import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class CompleteRegistrationDto extends RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'Email verification token is required' })
    emailVerificationToken: string;
}