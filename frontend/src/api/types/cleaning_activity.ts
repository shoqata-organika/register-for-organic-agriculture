import { ProcessingUnit } from './processing_unit';
import { MemberResource } from './user';

export interface CleaningActivity {
  id: number;
  date: string;
  processing_unit_id?: number;
  processingUnit?: ProcessingUnit;
  notes?: string;
  cleaning_tool?: string;
  area?: string;
  cleaned_device?: string;
  reason_of_cleaning?: string;
  person?: MemberResource;
}
