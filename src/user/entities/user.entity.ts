import { Category } from "src/category/entities/category.entity";
import { Order } from "src/order/entity/order.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role.enum";
import { AddressShipping } from "./addressShipping.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({nullable:false})
  username: string;
  @Column({nullable:true})
  phone: string;
  @Column({nullable:true})
  email: string;
  @Column({nullable:false})
  password: string;
  @Column({nullable:true})
  dateOfBirth: Date;
  @Column({nullable:true})
  avatar: string;
  @Column({nullable:true})
  role: Role;
  @Column({nullable:true})
  verify: boolean;
  @Column({nullable:true})
  verifyCode: string;
  @Column({type: 'timestamptz', nullable: true})
  createdAt: Date;
  @Column({type: 'timestamptz', nullable: true})
  updatedAt: Date;
  @OneToMany(_type => AddressShipping, addressShipping => addressShipping.user)
  addressShipping: AddressShipping;
  @OneToMany(_type => Order, order => order.user )
  order: Order[]
}