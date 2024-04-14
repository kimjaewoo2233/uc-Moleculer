import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'user'})
export class User {
    
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  age!: number;

}