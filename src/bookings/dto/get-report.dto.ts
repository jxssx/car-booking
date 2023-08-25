import { IsInt, IsNotEmpty } from 'class-validator';

export class GetReportDto {
  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsInt()
  @IsNotEmpty()
  monthNumber: number;
}
