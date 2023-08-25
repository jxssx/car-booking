import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Car } from 'src/entities/car.entity';
import { Tariff } from 'src/entities/tariff.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
    providers: [BookingsService],
    controllers: [BookingsController],
    imports: [TypeOrmModule.forFeature([Booking, Car, Tariff])],
})
export class BookingsModule {}
