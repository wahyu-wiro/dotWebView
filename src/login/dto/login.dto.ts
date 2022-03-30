import { IsNotEmpty } from 'class-validator';
export class loginDTO
{
    readonly phone: string;
    readonly phoneCode: string;
    readonly deviceId: string;
    filter: string;
}