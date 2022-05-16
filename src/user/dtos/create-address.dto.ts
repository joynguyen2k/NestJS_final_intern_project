import { ApiProperty } from "@nestjs/swagger";

export class CreateAddressDto{
    @ApiProperty({type: String})
    name: string;
    @ApiProperty({type: String})
    phone: string;
    @ApiProperty({type: String})
    address: string;
}