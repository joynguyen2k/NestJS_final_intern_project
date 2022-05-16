import { ApiProperty } from "@nestjs/swagger";
import { ItemFlashsaleDto } from "./create-item-flashsale.dto";

export class CreateFlashsaleDto{
    @ApiProperty({type: String})
    name: string;
    @ApiProperty({type: String, required: false})
    description: string;
    @ApiProperty({type: Date})
    startSale: Date;
    @ApiProperty({type: Date})
    endSale: Date;
    @ApiProperty({type: 'array'})
    itemFlashsale:ItemFlashsaleDto[]
}