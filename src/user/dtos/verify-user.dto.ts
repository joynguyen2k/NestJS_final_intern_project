import { IsString, IsUUID } from "class-validator";

export class VerifyUserDto{
    // @IsString()
    email: string;
    // @IsUUID()
    verifyCode: string;
}