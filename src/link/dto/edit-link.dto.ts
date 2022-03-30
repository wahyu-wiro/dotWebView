// ./src/customer/dto/create-page.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';
export class EditLinkDTO
 {
    readonly name: string;
    readonly link: string;
    linkId: string;
}   