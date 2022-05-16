import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ItemsStatus } from "../items-status.enum";

export class CreateItemsDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String})
    name: string;
    @ApiProperty({type: String, required: false})
    barcode: string;
    @ApiProperty({type: Number, required: false})
    importPrice: number;
    @ApiProperty({type: Number})
    price: number;
    @ApiProperty({type: Number})
    weight: number;
    @ApiProperty( { type: 'string', format: 'binary' } )
    avatar: any;
    @ApiProperty({type: Number})
    quantity: number;
    @ApiProperty({type: String, required: false})
    description: string;
    @ApiProperty({type: String, required: false})
    categoryId: string;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    images: any;
}