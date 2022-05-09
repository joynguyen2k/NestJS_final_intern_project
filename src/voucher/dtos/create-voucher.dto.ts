import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { VoucherType } from "../enum/voucher.enum";

export class CreateVoucherDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    code: string;
    @IsEnum(VoucherType)
    @ApiProperty()

    type: VoucherType;
    @IsString()
    @ApiProperty()
    description: string;
    @IsNotEmpty()
    @ApiProperty()
    
    discount: number;
    min: number;
    max: number;
    @IsNotEmpty()
    @ApiProperty()

    quantity: number;
    @IsNotEmpty()
    @ApiProperty()
    @IsDate()
    @Type(()=>Date)
    startVoucher: Date;
    @IsNotEmpty()
    @ApiProperty()
    @IsDate()
    @Type(()=>Date)
    endVoucher: Date;

}