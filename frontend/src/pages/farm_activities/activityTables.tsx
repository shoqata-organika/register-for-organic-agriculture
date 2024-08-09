import { formatDate } from '@/utils/formatDate';
import { getTotal } from '@/utils';
import { ExternalLink } from 'lucide-react';
import { FarmActivityType, FarmActivityView } from '@/api/types/farm_activity';
import { ta } from '@/utils/localized_attribute';
import { TFunction } from 'i18next';
import { formatTime } from '@/utils/format-time';

interface Props {
  t: TFunction;
  data: any;
  language: string;
  list: Array<FarmActivityView>;
}

const defaultCol = ({ t }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
  },
  {
    accessorKey: 'activity_type',
    header: t('Activity Type'),
    cell: ({ row }: any) => {
      const code = row.getValue('activity_type');
      return t(code);
    },
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'comments',
    header: t('Comments'),
  },
];

const harvesting = ({ t, language, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'crop',
    header: t('Crop'),
    cell: ({ row }: any) => {
      if (row.original.crop) {
        return ta(row.original.crop, 'name', language);
      }
    },
  },
  {
    accessorKey: 'partOfCrop',
    header: t('Part of crop'),
    cell: ({ row }: any) => {
      if (row.original.partOfCrop) {
        return ta(row.original.partOfCrop, 'name', language);
      }
    },
  },
  {
    accessorKey: 'time_spent',
    header: t('Time Spent'),
    cell: ({ row }: any) => {
      if (row.original.time_spent) {
        return formatTime(parseFloat(row.original.time_spent));
      }
    },
    footer: formatTime(parseFloat(getTotal(list, (item) => item.time_spent))),
  },
  {
    accessorKey: 'quantity',
    header: t('Harvesting Quantity'),
    footer: getTotal(list, (item) => item.quantity),
  },
  {
    accessorKey: 'details.packaging_type',
    header: t('Packaging Type'),
    cell: ({ row }: any) => {
      return t(row.original.details?.packaging_type);
    },
  },
];

const bed_preparations = ({ t, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'quantity',
    header: t('Fuel Used'),
    footer: getTotal(list, (item) => item.quantity),
  },
  {
    accessorKey: 'cost',
    header: t('Cost'),
    footer: getTotal(list, (item) => item.cost),
  },
];

const milling = ({ t, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'quantity',
    header: t('Fuel Used'),
    footer: getTotal(list, (item) => item.quantity),
  },
  {
    accessorKey: 'cost',
    header: t('Cost'),
    footer: getTotal(list, (item) => item.cost),
  },
];

const land_ploughing = ({ t, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'details.depth',
    header: t('Depth'),
  },
  {
    accessorKey: 'details.devices',
    header: t('Devices'),
    cell: ({ row }: any) => {
      const devices =
        row.original.details?.devices?.map((device: any) => device?.name) || [];

      return devices.join(', ');
    },
  },
  {
    accessorKey: 'quantity',
    header: t('Fuel Used'),
    footer: getTotal(list, (item) => item.quantity),
  },
  {
    accessorKey: 'cost',
    header: t('Cost'),
    footer: getTotal(list, (item) => item.cost),
  },
];

const irrigation = ({ t }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'details.method',
    header: t('Irrigation Method'),
    cell: ({ row }: any) => {
      return t(row.original.details?.method);
    },
  },
  {
    accessorKey: 'details.frequency',
    header: t('Frequency'),
  },
  {
    accessorKey: 'details.frequency_unit',
    header: t('Frequency Unit'),
    cell: ({ row }: any) => {
      return t(row.original.details?.frequency_unit);
    },
  },
  {
    accessorKey: 'details.source',
    header: t('Source'),
    cell: ({ row }: any) => {
      return t(row.original.details?.source);
    },
  },
];

const fertilization = ({ t, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'details.product.name',
    header: t('Product'),
  },
  {
    accessorKey: 'details.type',
    header: t('Type'),
    cell: ({ row }: any) => {
      return t(row.original.details?.type);
    },
  },
  {
    accessorKey: 'details.origin',
    header: t('Origin'),
    cell: ({ row }: any) => {
      return t(row.original.details?.origin);
    },
  },
  {
    accessorKey: 'details.subtype',
    header: t('Sub type'),
    cell: ({ row }: any) => {
      return t(row.original.details?.subtype);
    },
  },
  {
    accessorKey: 'details.producer.name',
    header: t('Producer'),
  },
  {
    accessorKey: 'details.supplier.name',
    header: t('Supplier'),
  },
  {
    accessorKey: 'quantity',
    header: t('Applied Quantity'),
    footer: getTotal(list, (item) => item.quantity),
  },

  {
    accessorKey: 'details.remaining_quantity',
    header: t('Remaining Quantity'),
    footer: getTotal(list, (item) => item.details?.remaining_quantity),
  },
  {
    accessorKey: 'details.n_quantity',
    header: t('Nitrogen Quantity'),
    footer: getTotal(list, (item) => item.details?.n_quantity),
  },
  {
    accessorKey: 'details.devices',
    header: t('Devices'),
    cell: ({ row }: any) => {
      const devices =
        row.original.details?.devices?.map((device: any) => device?.name) || [];

      return devices.join(', ');
    },
  },
  {
    accessorKey: 'details.fuel_used',
    header: t('Fuel Used'),
    footer: getTotal(list, (item) => item.details?.fuel_used),
  },
];

const seed_planting = ({ t, language, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'crop',
    header: t('Crop'),
    cell: ({ row }: any) => {
      if (row.original.crop) {
        return ta(row.original.crop, 'name', language);
      }
    },
  },
  {
    accessorKey: 'details.material_type',
    header: t('Material Type'),
    cell: ({ row }: any) => {
      return t(row.original.details?.material_type);
    },
  },
  {
    accessorKey: 'details.material_origin',
    header: t('Material Origin'),
    cell: ({ row }: any) => {
      return t(row.original.details?.material_origin);
    },
  },
  {
    accessorKey: 'details.status',
    header: t('Status'),
    cell: ({ row }: any) => {
      return t(row.original.details?.status);
    },
  },
  {
    accessorKey: 'details.distance',
    header: t('Distance'),
  },
  {
    accessorKey: 'quantity',
    header: t('Applied Quantity'),
    footer: getTotal(list, (item) => item.quantity),
  },

  {
    accessorKey: 'details.remaining_quantity',
    header: t('Remaining Quantity'),
    footer: getTotal(list, (item) => item.details?.remaining_quantity),
  },
  {
    accessorKey: 'details.type',
    header: t('Type'),
    cell: ({ row }: any) => {
      return t(row.original.details?.type);
    },
  },
  {
    accessorKey: 'time_spent',
    header: t('Time Spent'),
    cell: ({ row }: any) => {
      if (row.original.time_spent) {
        return formatTime(parseFloat(row.original.time_spent));
      }
    },
    footer: formatTime(parseFloat(getTotal(list, (item) => item.time_spent))),
  },
  {
    accessorKey: 'details.persons',
    header: t('Persons'),
    footer: getTotal(list, (item) => item.details?.persons),
  },
  {
    accessorKey: 'details.devices',
    header: t('Devices'),
    cell: ({ row }: any) => {
      const devices =
        row.original.details?.devices?.map((device: any) => device?.name) || [];

      return devices.join(', ');
    },
  },
  {
    accessorKey: 'details.fuel_used',
    header: t('Fuel Used'),
    footer: getTotal(list, (item) => item.details?.fuel_used),
  },
];

const soil_analysis = ({ t, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'details.ph_level',
    header: t('pH Level'),
    footer: getTotal(list, (item) => item.details?.ph_level),
  },
  {
    accessorKey: 'details.n_level',
    header: t('N Level'),
    footer: getTotal(list, (item) => item.details?.n_level),
  },
  {
    accessorKey: 'details.p_level',
    header: t('P Level'),
    footer: getTotal(list, (item) => item.details?.p_level),
  },
  {
    accessorKey: 'details.k_level',
    header: t('K Level'),
    footer: getTotal(list, (item) => item.details?.k_level),
  },
  {
    accessorKey: 'file',
    header: t('Analysis Document'),
    cell: ({ row }: any) => {
      const fileLink = row.original.file || '';

      return (
        <a
          className="flex gap-1 items-center justify-center"
          href={fileLink}
          target="_blank"
        >
          <span>{fileLink ? t('Document') : ''}</span>
          {fileLink && <ExternalLink className="w-4 h-4" />}
        </a>
      );
    },
  },
];

const grazingManagement = ({ t, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'details.type',
    header: t('Type'),
    cell: ({ row }: any) => {
      return t(row.original.details?.type);
    },
  },
  {
    accessorKey: 'time_spent',
    header: t('Time Spent'),
    cell: ({ row }: any) => {
      if (row.original.time_spent) {
        return formatTime(parseFloat(row.original.time_spent));
      }
    },
    footer: formatTime(parseFloat(getTotal(list, (item) => item.time_spent))),
  },
  {
    accessorKey: 'details.persons',
    header: t('Persons'),
    footer: getTotal(list, (item) => item.details?.persons),
  },
  {
    accessorKey: 'details.devices',
    header: t('Devices'),
    cell: ({ row }: any) => {
      const devices =
        row.original.details?.devices?.map((device: any) => device?.name) || [];

      return devices.join(', ');
    },
  },
  {
    accessorKey: 'details.fuel_used',
    header: t('Fuel Used'),
    footer: getTotal(list, (item) => item.details?.fuel_used),
  },
];

const crop_protection = ({ t, data, language, list }: Props) => [
  {
    accessorKey: 'date',
    header: t('Date'),
    cell: ({ row }: any) => {
      const date = new Date(row.getValue('date'));
      return formatDate(date);
    },
    footer: t('Total'),
  },
  {
    accessorKey: 'landParcel.code',
    header: t('Land Parcel'),
  },
  {
    accessorKey: 'landParcel.location',
    header: t('Location'),
  },
  {
    accessorKey: 'crop',
    header: t('Crop'),
    cell: ({ row }: any) => {
      if (row.original.crop) {
        return ta(row.original.crop, 'name', language!);
      }
    },
  },
  {
    accessorKey: 'details.disease_id',
    header: t('Disease'),
    cell: ({ row }: any) => {
      const disease = data.diseases.find(
        (item: any) => item.id === row.original.details.disease_id,
      );

      return ta(disease, 'name', language!);
    },
  },
  {
    accessorKey: 'details.active_ingredient',
    header: t('Active Ingredient'),
  },
  {
    accessorKey: 'details.supplier.name',
    header: t('Supplier'),
  },
  {
    accessorKey: 'quantity',
    header: t('Applied Quantity'),
    footer: getTotal(list, (item) => item.quantity),
  },
  {
    accessorKey: 'details.cu_quantity',
    header: t('Copper Quantity'),
    footer: getTotal(list, (item) => item.details?.cu_quantity),
  },
  {
    accessorKey: 'details.remaining_quantity',
    header: t('Remaining Quantity'),
    footer: getTotal(list, (item) => item.details?.remaining_quantity),
  },
];

export default {
  all_items: defaultCol,
  land_preparation: milling,
  [FarmActivityType.HARVESTING]: harvesting,
  [FarmActivityType.MILLING]: milling,
  [FarmActivityType.LAND_PLOUGHING]: land_ploughing,
  [FarmActivityType.IRRIGATION]: irrigation,
  [FarmActivityType.FERTILIZATION]: fertilization,
  [FarmActivityType.SEED_PLANTING]: seed_planting,
  [FarmActivityType.SOIL_ANALYSIS]: soil_analysis,
  [FarmActivityType.BED_PREPARATION]: bed_preparations,
  [FarmActivityType.CROP_PROTECTION]: crop_protection,
  [FarmActivityType.GRAZING_MANAGEMENT]: grazingManagement,
};
