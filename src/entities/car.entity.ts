import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cars', schema: 'public' })
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licensePlate: string;
}
