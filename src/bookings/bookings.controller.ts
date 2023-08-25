import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookingsService, ReportResult } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetRentalCostDto } from './dto/get-rental-cost.dto';
import { IsBookingAvailableDto } from './dto/is-booking-available.dto';
import { GetReportDto } from './dto/get-report.dto';
import { Booking } from 'src/entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  createBooking(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.createBooking(dto);
  }

  @Get('available')
  isBookingAvailable(@Body() dto: IsBookingAvailableDto): Promise<boolean> {
    return this.bookingsService.isBookingAvailable(dto);
  }

  @Get('cost')
  getRentalCost(@Body() dto: GetRentalCostDto): Promise<number> {
    return this.bookingsService.getRentalCost(dto);
  }

  @Get('report')
  getReport(@Body() dto: GetReportDto): Promise<ReportResult> {
    return this.bookingsService.getReport(dto);
  }
}
