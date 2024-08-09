import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { Code } from '../code-categories/code.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { ActivityDetails } from '../activities/farm-activity.entity';
import { ActivityType } from '../activities/farm-activity.entity';
import { CropState } from '../activities/types';

export class FarmActivityDto {
  id: number | null;

  @IsDateString()
  date: string;

  @IsNotEmpty()
  land_parcel_id?: number;

  @IsNotEmpty()
  activity_type: ActivityType;

  @IsOptional()
  cropState: CropState;

  cost?: number;

  crop_id?: number;

  file?: any;

  part_of_crop_id?: number;

  landParcel: LandParcel;

  crop: Code;

  partOfCrop: Code;

  time_spent?: number;

  quantity: number;

  comments?: string;

  details?: ActivityDetails;
}
