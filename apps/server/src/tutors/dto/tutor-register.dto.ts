import { IsString, IsEmail, IsPhoneNumber, IsEnum, IsBoolean, MinLength } from 'class-validator';

enum StudentCountRange {
  ZERO_FIFTY = 'ZERO_FIFTY',
  FIFTY_FIVE_HUNDRED = 'FIFTY_FIVE_HUNDRED',
  FIVE_HUNDRED_PLUS = 'FIVE_HUNDRED_PLUS',
}

export class TutorRegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('LK')
  phone: string;

  @IsString()
  subject: string;

  @IsEnum(StudentCountRange)
  studentCount: StudentCountRange;

  @IsString()
  @MinLength(3)
  username: string;

  @IsBoolean()
  agreedToTerms: boolean;
}
