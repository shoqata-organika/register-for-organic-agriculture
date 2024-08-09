import { Code } from '@/api/types/code_category';
import { LandParcel } from '@/api/types/land_parcel';
import { Member } from '@/api/types/user';
import { Zone } from '@/api/types/zone';
import axios from 'axios';

export async function generateLotCode(
  member: Member,
  cropId: number,
  partOfCrop: Code,
  date: Date,
  landParcel?: LandParcel,
  zone?: Zone,
) {
  console.log('generateLotCode', {
    member,
    cropId,
    partOfCrop,
    date,
    landParcel,
    zone,
  });

  const result = await axios.get<string>('/members/lotCode', {
    params: {
      cropId,
      partOfCropId: partOfCrop.id,
      date,
      zoneId: zone?.id,
      landParcelId: landParcel?.id,
    },
  });

  return result.data;
}
