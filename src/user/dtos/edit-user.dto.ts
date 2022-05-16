import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class EditMyProfileDto{
    @IsString()
    @ApiProperty({type: String, required: false})
    name: string;
    @MaxLength(10)
    @ApiProperty({type: String, required: false})
    phone: string;
    @IsString()
    @ApiProperty({type: String, required: false})
    @Matches(' /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}|)$/g')
    email: string;
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({type: String, required: false})
    password: string;
    @ApiProperty({type: Date, required: false})
    dateOfBirth: Date;
    @ApiProperty( { type: 'string', format: 'binary', required: false } )
    avatar: string;
}