import { Voucher } from "src/voucher/entity/voucher.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order-status.enum";
import { AddressShipping } from "../../user/entities/addressShipping.entity";
import { OrderDetail } from "./order-detail.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    // @Column({nullable:true})
    // voucherId: string;
    @ManyToOne(_type => Voucher, voucher => voucher.order)
    @JoinColumn({referencedColumnName: 'id'})
    voucher: Voucher;
    @Column({nullable: false})
    addressShippingId: string;
    @ManyToOne(_type => AddressShipping, addressShipping => addressShipping.order)
    @JoinColumn({referencedColumnName: 'id'})
    addressShipping: AddressShipping;
    @OneToMany(_type=> OrderDetail, orderDetail => orderDetail.order)
    orderDetail: OrderDetail[]
    @ManyToOne(_type => User, user => user.order)
    user: User;
    @Column({type: 'varchar', nullable: false})
    status: OrderStatus;
    @Column({type:'float', nullable:false})
    shippingPrice: number;
    @Column({type:'float', nullable:false})
    itemsPrice: number;
    @Column({type:'float', nullable:false})
    total: number;
    @Column({type:'timestamptz'})
    createdAt: Date;
    @Column({type:'timestamptz', nullable: true})
    updatedAt: Date;
}