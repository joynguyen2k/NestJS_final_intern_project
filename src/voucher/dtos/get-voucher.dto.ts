import { IsOptional, IsString } from "class-validator";

export class GetVoucherDto{
    @IsOptional()
    @IsString()
    keyword:string;
    order: string;
    by:string;
    size: number;
    page:number;
}