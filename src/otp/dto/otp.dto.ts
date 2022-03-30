// ./src/customer/dto/create-page.dto.ts
import { IsNotEmpty } from 'class-validator';
export class otpDTO
 {
    readonly pin: string;
    readonly txt1: string;
    readonly txt2: string;
    readonly txt3: string;
    readonly txt4: string;
    readonly txt5: string;
    readonly txt6: string;
    readonly phone: string;
}