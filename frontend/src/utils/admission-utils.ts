import { Admission, AdmissionEntryView } from '@/api/types/admission';
import { ta } from './localized_attribute';
import { InventoryItemType } from '@/api/types/inventory';
import { TFunction } from 'i18next';

export const getArea = (admission: Admission) => {
  if (admission.type === 'collection') {
    return admission.zone?.code;
  } else if (admission.type === 'harvesting') {
    return admission.landParcel?.code;
  } else {
    return '';
  }
};

export function getInventoryType(
  type: InventoryItemType,
  t: TFunction<'translation', unknown>,
) {
  switch (type) {
    case InventoryItemType.DRIED_PRODUCT: {
      return t('Dried Product');
    }

    case InventoryItemType.PURCHASED_PRODUCT: {
      return t('Purchased Product');
    }

    case InventoryItemType.HARVESTED_PRODUCT: {
      return t('Harvested Product');
    }

    case InventoryItemType.COLLECTED_PRODUCT: {
      return t('Collected Product');
    }

    default: {
      return type;
    }
  }
}

export const getAdmissionType = (
  admission: Admission,
  t: TFunction<'translation', undefined>,
) => {
  if (admission.type === 'harvesting') {
    return t('Harvesting');
  } else if (admission.type === 'collection') {
    return t('Collection');
  } else {
    return t('Purchase');
  }
};

export const getAdmissionDisplayName = (
  admission: Admission,
  t: TFunction<'translation', undefined>,
) => {
  if (admission.type === 'harvesting') {
    // eslint-disable-next-line prettier/prettier
    return `${admission.admission_no} - ${getAdmissionType(admission, t)}`;
  } else if (admission.type === 'collection') {
    // eslint-disable-next-line prettier/prettier
    return `${admission.admission_no} - ${admission.harvester
      ?.code} - ${getAdmissionType(admission, t)}`;
  } else {
    // eslint-disable-next-line prettier/prettier
      return `${admission.admission_no} - ${admission.contractedFarmer?.code} - ${getAdmissionType(admission, t)}`;
  }
};

export const getAdmissionSubject = (admission: Admission) => {
  if (admission.type === 'collection') {
    if (admission.harvester)
      return `${admission.harvester?.code} - ${admission.harvester?.first_name} ${admission.harvester?.last_name}`;
    else return '';
  } else if (admission.type === 'harvesting') {
    return '';
  } else {
    if (admission.contractedFarmer)
      return `${admission.contractedFarmer?.code} - ${admission.contractedFarmer?.name}`;
    else return '';
  }
};

export const getAdmissionEntryDisplayName = (
  entry: AdmissionEntryView,
  language: string,
) => {
  if (entry.crop && !entry.partOfCrop)
    return `${ta(entry.crop, 'name', language)} - ${entry.net_quantity}`;

  return `${ta(entry.crop, 'name', language)} - ${ta(
    entry.partOfCrop,
    'name',
    language,
  )} - ${entry.net_quantity}`;
};
