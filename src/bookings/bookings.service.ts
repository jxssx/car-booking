import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Car } from 'src/entities/car.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  calculateRentalCost,
  getAmountOfDays,
  getStringsToDates,
  validateInterval,
} from 'src/utils/bookings';
import { GetRentalCostDto } from './dto/get-rental-cost.dto';
import { IsBookingAvailableDto } from './dto/is-booking-available.dto';
import { GetReportDto } from './dto/get-report.dto';
import { Tariff } from 'src/entities/tariff.entity';

type CarUsagePercentage = Record<string, number>;

export interface ReportResult {
  carUsagePercentage: CarUsagePercentage;
  overallUsagePercentage: number;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
    @InjectRepository(Tariff)
    private readonly tariffsRepository: Repository<Tariff>,
  ) {}

  async getTariffs(): Promise<Tariff[]> {
    return await this.tariffsRepository.find();
  }

  async isBookingAvailable({
    carId,
    startDate,
    endDate,
  }: IsBookingAvailableDto): Promise<boolean> {
    const [startDateFormatted, endDateFormatted] = getStringsToDates(
      startDate,
      endDate,
    );

    const intervalError = validateInterval(
      startDateFormatted,
      endDateFormatted,
    );

    if (intervalError) {
      throw new BadRequestException(intervalError);
    }

    const car = await this.carsRepository.findOne({
      where: {
        id: carId,
      },
    });

    if (!car) {
      throw new NotFoundException(`The car with id ${carId} was not found`);
    }

    // Временной интервал между бронированиями - 3 дня.
    const bookingOffset = 3;

    const startDateWithOffset = new Date(startDate);
    const endDateWithOffset = new Date(endDate);

    startDateWithOffset.setDate(startDateWithOffset.getDate() - bookingOffset);
    endDateWithOffset.setDate(endDateWithOffset.getDate() + bookingOffset);

    const overlappingBookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.carId = :carId', { carId })
      .andWhere(
        '(booking.start_date, booking.end_date) OVERLAPS (:startDate, :endDate)',
        {
          startDate: startDateWithOffset,
          endDate: endDateWithOffset,
        },
      )
      .getCount();

    return overlappingBookings === 0;
  }

  async getRentalCost({
    startDate,
    endDate,
  }: GetRentalCostDto): Promise<number> {
    const [startDateFormatted, endDateFormatted] = getStringsToDates(
      startDate,
      endDate,
    );

    const intervalError = validateInterval(
      startDateFormatted,
      endDateFormatted,
    );
    if (intervalError) {
      throw new BadRequestException(intervalError);
    }

    const tariffsArr = (await this.getTariffs()).map((tariff) => [
      tariff.interval,
      tariff.price,
    ]);
    const tariffs = Object.fromEntries(tariffsArr);

    return calculateRentalCost(startDateFormatted, endDateFormatted, tariffs);
  }

  async createBooking({
    carId,
    startDate,
    endDate,
  }: CreateBookingDto): Promise<Booking> {
    if (!(await this.isBookingAvailable({ carId, startDate, endDate }))) {
      throw new ConflictException(
        `This car can't be booked for this time interval`,
      );
    }

    const rentalCost = await this.getRentalCost({
      startDate,
      endDate,
    });
    const booking = this.bookingsRepository.create({
      carId,
      startDate,
      endDate,
      rentalCost,
    });

    this.bookingsRepository.save(booking);
    return booking;
  }

  async getReport({ year, monthNumber }: GetReportDto): Promise<ReportResult> {
    if (
      year < 0 ||
      year > new Date().getFullYear() ||
      monthNumber < 0 ||
      monthNumber > 11
    )
      throw new BadRequestException('Invalid year or month number');
    const startOfMonth = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endOfMonth = new Date(Date.UTC(year, monthNumber, 1));
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();

    const overlaps = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where(
        '(booking.start_date, booking.end_date) OVERLAPS (:startOfMonth, :endOfMonth)',
        {
          startOfMonth,
          endOfMonth,
        },
      )
      .getMany();

    // Обращаемся к нашему сервису машин (в данном случае к репозиторию, в рамках задания)
    const cars = await this.carsRepository.find();

    const carUsageMap = new Map<number, number>();
    let totalDaysInRent = 0;

    cars.forEach((car: Car) => {
      carUsageMap.set(car.id, 0);
    });

    overlaps.forEach((booking) => {
      const { startDate, endDate } = booking;

      const bookingStart = startDate > startOfMonth ? startDate : startOfMonth;
      const bookingEnd = endDate < endOfMonth ? endDate : endOfMonth;

      const daysInRent = getAmountOfDays(bookingStart, bookingEnd);

      totalDaysInRent += daysInRent;

      const carId = booking.carId;
      carUsageMap.set(carId, carUsageMap.get(carId) + daysInRent);
    });

    const carUsagePercentage = {};
    carUsageMap.forEach((daysInRent, carId) => {
      const car = cars.find((car) => car.id === carId);
      const usagePercentage = (daysInRent / daysInMonth) * 100;
      carUsagePercentage[`${car.brand}(${car.licensePlate})`] = usagePercentage;
    });

    const overallUsagePercentage =
      (totalDaysInRent / (daysInMonth * cars.length)) * 100;

    return {
      carUsagePercentage,
      overallUsagePercentage,
    };
  }
}
