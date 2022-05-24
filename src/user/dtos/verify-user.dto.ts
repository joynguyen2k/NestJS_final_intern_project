import { IsString, IsUUID } from "class-validator";

export class VerifyUserDto{
    email: string;
    verifyCode: string;
}