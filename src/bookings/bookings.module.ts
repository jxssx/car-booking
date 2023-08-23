import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Car } from 'src/entities/car.entity';

@Module({
  providers: [BookingsService],
  controllers: [BookingsController],
  imports: [TypeOrmModule.forFeature([Booking, Car])],
})
export class BookingsModule {}