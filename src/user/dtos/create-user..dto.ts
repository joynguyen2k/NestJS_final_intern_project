import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { Role } from "../role.enum";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    username: string;
    @MaxLength(10)
    phone: string;
    @IsString()
    // @Matches('')
    email: string;
    @Matches('')
    password: string;
    dateOfBirth: Date;
    avatar: string;
    @IsOptional()
    @IsEnum(Role)
    role: Role;
    verify: boolean;
    createdAt: Date;
    updatedAt: Date;
}