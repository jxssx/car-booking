import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tariffs', schema: 'public' })
export class Tariff {
  @PrimaryColumn()
  interval: string;

  @Column()
  price: string;
}
