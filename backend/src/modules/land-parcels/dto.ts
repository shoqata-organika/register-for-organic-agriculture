import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

function TransformSpecialStrings() {
  return Transform(({ value }) => {
    if (value === 'null') {
      return null;
    } else if (value === 'undefined') {
      return undefined;
    }

    return value;
  });
}

export class LandParcelDto {
  @Type(() => Date)
  @IsDate()
  organic_transition_date?: Date;

  @Type(() => Date)
  @IsDate()
  contract_start_date?: Date;

  @Type(() => Date)
  @IsDate()
  contract_end_date?: Date;

  @IsOptional()
  @IsString()
  @TransformSpecialStrings()
  buffer_zone?: number | null;
}
