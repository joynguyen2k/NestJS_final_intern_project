import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    username: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}