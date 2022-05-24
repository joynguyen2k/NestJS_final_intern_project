import { IsNumber, IsString } from "class-validator";

export class StatusCode{
    statusCode: number;
    message: string;
    data: object;
}