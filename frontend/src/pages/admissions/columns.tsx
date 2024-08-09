import { ta } from '@/utils/localized_attribute';
import { formatDate } from '@/utils/formatDate';
import { TFunction, i18n } from 'i18next';
import { getTotal } from '@/utils';
import { AdmissionEntryView } from '@/api/types/admission';

const collection = (
  t: TFunction,
  i18n: i18n,
  list: Array<AdmissionEntryView>,
) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      return formatDate(new Date(row.getValue('date')));
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'admission_no',
    header: t('Admission Number'),
  },
  {
    accessorKey: 'zone',
    header: t('Zone Code'),
    cell: ({ row }: any) => {
      return row.original.zone?.code;
    },
  },
  {
    accessorKey: 'crop',
    header: t('Crop'),
    cell: ({ row }: any) => {
      return ta(row.getValue('crop'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'partOfCrop',
    header: t('Part Of Crop'),
    cell: ({ row }: any) => {
      return ta(row.getValue('partOfCrop'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'cropState',
    header: t('Crop State'),
    cell: ({ row }: any) => {
      return t(row.getValue('cropState'));
    },
  },
  {
    accessorKey: 'cropStatus',
    header: t('Crop Status'),
    cell: ({ row }: any) => {
      return t(row.getValue('cropStatus'));
    },
  },
  {
    accessorKey: 'harvester',
    header: t('Harvester'),
    cell: ({ row }: any) => {
      const farmer = row.original.harvester;

      return farmer
        ? `${farmer?.code} - ${farmer?.first_name || farmer?.name}`
        : '';
    },
  },
  {
    accessorKey: 'net_quantity',
    header: t('Weight'),
    footer: getTotal(list, (item) => item.net_quantity),
  },
];

const purchased = (
  t: TFunction,
  i18n: i18n,
  list: Array<AdmissionEntryView>,
) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      return formatDate(new Date(row.getValue('date')));
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'admission_no',
    header: t('Admission Number'),
  },
  {
    accessorKey: 'landParcel',
    header: t('Land Parcel Code'),
    cell: ({ row }: any) => {
      return row.original.landParcel?.code;
    },
  },
  {
    accessorKey: 'landParcel',
    header: t('Parcel Ownership'),
    cell: ({ row }: any) => {
      if (row.original.landParcel?.contracted_farmer_id) {
        return t('Farmers');
      } else {
        return t('Member');
      }
    },
  },
  {
    accessorKey: 'crop',
    header: t('Crop'),
    cell: ({ row }: any) => {
      return ta(row.getValue('crop'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'partOfCrop',
    header: t('Part Of Crop'),
    cell: ({ row }: any) => {
      return ta(row.getValue('partOfCrop'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'cropState',
    header: t('Crop State'),
    cell: ({ row }: any) => {
      return t(row.getValue('cropState'));
    },
  },
  {
    accessorKey: 'cropStatus',
    header: t('Crop Status'),
    cell: ({ row }: any) => {
      return t(row.getValue('cropStatus'));
    },
  },
  {
    accessorKey: 'contractedFarmer',
    header: t('Farmer'),
    cell: ({ row }: any) => {
      const farmer = row.original.contractedFarmer;

      return farmer
        ? `${farmer?.code} - ${farmer?.first_name || farmer?.name}`
        : '';
    },
  },
  {
    accessorKey: 'net_quantity',
    header: t('Net Quantity'),
    footer: getTotal(list, (item) => item.net_quantity),
  },
  {
    accessorKey: 'gross_quantity',
    header: t('Gross Quantity'),
    footer: getTotal(list, (item) => item.gross_quantity),
  },
];

export default {
  collection,
  purchased,
};
