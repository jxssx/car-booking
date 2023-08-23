import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bookings', schema: 'public' })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // Не создаем связь, т.к. для нас cars - отдельный сервис
  @Column()
  carId: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rentalCost: number;
}
