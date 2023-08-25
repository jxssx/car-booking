import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetRentalCostDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
