import { IsString, IsUUID } from "class-validator";

export class ForgotPasswordDto{
    @IsString()
    password: string;
}