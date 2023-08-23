import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bookings', schema: 'public', synchronize: true })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carId: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rental_cost: number;
}
