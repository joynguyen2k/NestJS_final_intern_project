import { Voucher } from "src/voucher/entity/voucher.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order-status.enum";
import { AddressShipping } from "../../user/entities/addressShipping.entity";
import { Order } from "./order.entity";
import { Items } from "src/items/entities/items.entity";
import { ItemFlashsale } from "src/flashsale/entities/item-flashsale.entity";

@Entity()
export class OrderDetail extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type:'float', nullable:false})
    quantity: number;
    @Column({type:'float', nullable:false})
    price: number;
    @ManyToOne(_type => Order, order => order.orderDetail)
    order: Order;
    @ManyToOne(_type=> Items, items => items.orderDetail)
    items: Items;
    @ManyToOne(_type=> ItemFlashsale, itemFlashsale => itemFlashsale.orderDetail)
    itemFlashsale: ItemFlashsale;
    @Column({type:'timestamptz'})
    createdAt: Date;
    @Column({type:'timestamptz', nullable: true})
    updatedAt: Date;
}