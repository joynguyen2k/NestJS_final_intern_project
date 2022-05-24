import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ItemsStatus } from "../items-status.enum";

export class UpdateItemsDto{
    @ApiProperty({type: String, required: false})
    name: string;
    @ApiProperty({type: String, required: false})
    barcode: string;
    @ApiProperty({type: String, required: false})
    importPrice: number;
    @ApiProperty({type: Number, required: false})
    price: number;
    @ApiProperty({type: Number, required: false})
    weight: number;
    // @ApiProperty( { type: 'string', format: 'binary', required: false } )
    // avatar: any;
    @ApiProperty({type: Number, required: false})
    quantity: number;
    @ApiProperty({type: String, required: false})
    description: string;
    @IsOptional()
    @IsEnum(ItemsStatus)
    @ApiProperty({enum:ItemsStatus, required: false})
    status: ItemsStatus;
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
    images:  Array<Express.Multer.File>;
}