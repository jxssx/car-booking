import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Car } from 'src/entities/car.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Car) private readonly carsRepository: Repository<Car>,
  ) {}

  async getAllBookings() {
    const bookings = await this.bookingsRepository.find();
    return bookings;
  }

  async createBooking({ carId, startDate, endDate }: CreateBookingDto) {
    const car = await this.carsRepository.findOne({
      where: {
        id: carId,
      },
    });

    console.log(car);

    if (!car) {
      throw new BadRequestException(`The car with id ${carId} was not found`);
    }

    const booking = this.bookingsRepository.create({
      carId,
      startDate,
      endDate,
      rentalCost: 1000,
    });

    this.bookingsRepository.save(booking);
  }
}
