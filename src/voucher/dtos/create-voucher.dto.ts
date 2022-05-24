import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { VoucherType } from "../enum/voucher.enum";

export class CreateVoucherDto{
    // @IsNotEmpty()
    @IsString()
    @ApiProperty({type: String})
    code: string;
    @IsEnum(VoucherType)
    @ApiProperty({enum:VoucherType})
    type: VoucherType;
    @IsString()
    @ApiProperty({type: String, required: false})
    description: string;
    // @IsNotEmpty()
    @ApiProperty({type: Number})
    discount: number;
    @ApiProperty({type: Number, required: false})
    min: number;
    @ApiProperty({type: Number, required: false})
    max: number;
    // @IsNotEmpty()
    @ApiProperty({type: Number})
    quantity: number;
    // @IsNotEmpty()
    @IsDateString()
    @Type(()=>Date)
    @ApiProperty({type: Date})
    startVoucher: Date;
    // @IsNotEmpty()
    @ApiProperty()
    @IsDateString()
    @Type(()=>Date)
    @ApiProperty({type: Date})
    endVoucher: Date;
}