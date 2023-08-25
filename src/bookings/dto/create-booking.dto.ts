import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
    @IsInt()
    @IsNotEmpty()
    carId: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}
