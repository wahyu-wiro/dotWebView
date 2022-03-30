// ./src/signup/dto/signup.dto.ts
import { IsEmail, IsNotEmpty, IsNumberString, IsNumber, IsAlpha, isPhoneNumber  } from 'class-validator';
export class SignupDTO
 {
    @IsNotEmpty()
    fullname: string;
    @IsNotEmpty()
    phone: string;
    @IsEmail()
    email: string
}   