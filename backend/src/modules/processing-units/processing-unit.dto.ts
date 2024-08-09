import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

export class ProcessingUnitDto {
  @IsString()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  member_id: number;

  @IsOptional()
  @IsString()
  address: string;

  @IsString()
  ownership_status: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value !== 'undefined') return new Date(value);
    else return undefined;
  })
  @IsDate()
  contract_start_date: Date;

  @IsOptional()
  @Transform(({ value }) => {
    if (value !== 'undefined') return new Date(value);
    else return undefined;
  })
  @IsDate()
  contract_end_date: Date;

  @IsOptional()
  @IsString()
  type_of_processing: string;

  @IsNumber()
  total_area: number;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;
}
