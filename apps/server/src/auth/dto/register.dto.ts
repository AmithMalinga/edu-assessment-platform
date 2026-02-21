import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, Min, Max, IsPhoneNumber, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name: string;

    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Invalid phone number format' })
    @MinLength(10, { message: 'Phone number must be at least 10 digits' })
    phone: string;

    @IsInt({ message: 'Age must be a valid number' })
    @Min(5, { message: 'Age must be at least 5 years' })
    @Max(100, { message: 'Age must not exceed 100 years' })
    age: number;

    @IsString()
    @IsNotEmpty({ message: 'Educational level is required' })
    @Matches(/^Grade (1[0-3]|[1-9])$/, { message: 'Educational level must be in format "Grade 1" to "Grade 13"' })
    educationalLevel: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    })
    password: string;
}
