import { CategoryBanner } from 'src/category-banner/entities/category-banner.entity';
import { Items } from 'src/items/entities/items.entity';
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryStatus } from '../enums/category.enums';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column()
  status: CategoryStatus;
  @Column({type:'timestamptz'})
  createdAt: Date;
  @Column({type:'timestamptz', nullable:true})
  updatedAt: Date;

  @OneToMany(_type => CategoryBanner, categoryBanner => categoryBanner.category)
  @JoinColumn({referencedColumnName: 'categoryId'})
  categoryBanner: CategoryBanner[]
  
  @OneToMany(_type => Items, items => items.category)
  @JoinColumn({referencedColumnName: 'id'})
  items: Items[]
}
