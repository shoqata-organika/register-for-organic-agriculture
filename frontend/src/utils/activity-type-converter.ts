import { MemberView, Member } from '@/api/types/user';
import { LandParcelView, LandParcel } from '@/api/types/land_parcel';
import { FarmActivity, FarmActivityView } from '@/api/types/farm_activity';

export function fromLandParcelViewToInitType(
  lp: LandParcelView | null,
): LandParcel | null {
  if (!lp) return null;

  return Object.entries(lp).reduce((data, [key, val]: [string, unknown]) => {
    if (val === null) {
      val = undefined;
    }

    if (
      (key === 'contract_start_date' ||
        key === 'contract_end_date' ||
        key === 'organic_transition_date') &&
      typeof val === 'string'
    ) {
      val = new Date(val);
    }

    if (key === 'parcel_crops' && Array.isArray(val) && val.length > 0) {
      val = val.map((item) => ({
        ...item,
        to_date: new Date(item.to_date),
        from_date: new Date(item.from_date),
      }));
    }

    return { ...data, [key]: val };
  }, {}) as LandParcel;
}

export function fromMemberViewToInitType(
  member: MemberView | null,
): Member | object {
  if (!member) return {};

  const credentials = JSON.parse(member.owner);

  return {
    code: member.code,
    business_name: member.business_name,
    business_no: member.business_no,
    website_url: member.website_url,
    owner_first_name: credentials?.first_name,
    owner_last_name: credentials?.last_name,
    farmer_no: member.farmer_no,
    latitude: Number(member.latitude),
    longitude: Number(member.longitude),
    legal_status: member.legal_status,
    applied_standards: member.applied_standards,
    activities: member.activities,
    email: member.email,
  };
}

export function farmFromViewToInitType(
  act: FarmActivityView | null,
): FarmActivity | null {
  if (!act) return null;

  return {
    id: act.id,
    date: new Date(act.date),
    land_parcel_id: act.landParcel.id,
    crop_id: act.crop?.id,
    time_spent: act.time_spent,
    comments: act.comments || undefined,
    quantity: act.quantity,
    _tempId: undefined,
    details: act.details,
    activity_type: act.activity_type.toString(),
    cost: act.cost,
  };
}
