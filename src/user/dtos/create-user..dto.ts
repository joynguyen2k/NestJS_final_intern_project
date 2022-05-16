import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "../role.enum";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({type: String})
    name: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({type: String})
    username: string;
    @MaxLength(10)
    @ApiProperty({type: String, required: false})
    phone: string;
    @IsString()
    @ApiProperty({type: String})
    // @Matches(' /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}|)$/g')
    email: string;
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({type: String})
    password: string;
    @ApiProperty({type: Date})
    dateOfBirth: Date;
    @ApiProperty( { type: 'string', format: 'binary' } )
    avatar: string;
}