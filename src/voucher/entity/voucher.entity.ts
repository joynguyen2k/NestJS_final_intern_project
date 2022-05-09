import { Order } from "src/order/entity/order.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { VoucherType } from "../enum/voucher.enum";

@Entity()
export class Voucher extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type:'varchar', nullable: false, unique: true})
    code: string;
    @Column({nullable: false})
    type: VoucherType;
    @Column({type:'varchar'})
    description: string;
    @Column({type:'float', nullable: false})
    discount: number;
    @Column({type: 'float', nullable: true})
    max: number;
    @Column({type: 'float', nullable: true})
    min: number;
    @Column({type: 'float', nullable: false})
    quantity: number;
    @Column({type:'timestamptz', nullable: false})
    startVoucher: Date;
    @Column({type:'timestamptz', nullable: false})
    endVoucher: Date;
    @OneToMany(_type => Order, order => order.voucher)
    @JoinColumn({referencedColumnName: 'voucher_id'})
    order: Order[]
    
}