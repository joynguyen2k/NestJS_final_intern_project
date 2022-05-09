import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../order/entity/order.entity";
import { User } from "./user.entity";

@Entity()
export class AddressShipping extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({nullable:false})
    name: string;
    @Column({nullable: false})
    phone: string;
    @Column({nullable: false})
    address: string;
    @ManyToOne(_type => User, user => user.addressShipping)
    user: User;
    @OneToMany(_type => Order, order => order.addressShipping)
    @JoinColumn({referencedColumnName: 'addressShippingId'})
    order: Order[];
}