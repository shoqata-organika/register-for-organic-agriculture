import { Type } from 'class-transformer';
import { BasicMemberResource } from '../members/member-resource.entity';

export class CleaningActivityDto {
  id?: number | null;

  @Type(() => Date)
  date: Date;

  processing_unit_id?: number;

  cleaned_device?: string;

  reason_of_cleaning?: string;

  notes?: string;

  cleaning_tool?: string;

  area?: string;
  person?: BasicMemberResource;
}
