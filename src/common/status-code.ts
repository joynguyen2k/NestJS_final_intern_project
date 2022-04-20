import { IsNumber, IsString } from "class-validator";

export class StatusCode{
    @IsNumber()
    statusCode: number;
    @IsString()
    message: string;
}