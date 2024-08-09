import { useEffect, useState } from 'react';
import { TFunction, i18n } from 'i18next';
import { getCodeCategories } from '../../api/code_category';
import { useTranslation } from 'react-i18next';
import { filterPipeline } from '@/utils/filterPipeline';
import { Code } from '../../api/types/code_category';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/datepicker';
import { SlidersHorizontal } from 'lucide-react';
import AddButton from '@/components/AddButton';
import DataTable from '@/components/TableComponent';
import { getTotal } from '@/utils';
import { withActionColumns } from '@/components/withActionColumns';
import { deleteFarmActivity } from '@/api/farm_activities';
import ProcessingActivityForm from './form';
import { InventoryItem } from '@/api/types/inventory';
import {
  DetailedProcessingActivity,
  ProcessingActivityView,
} from '@/api/types/processing_activity';
import {
  getProcessingActivities,
  exportProcessingActivities,
} from '@/api/processing_activities';
import ExportButton from '@/components/ExportButton';
import { formatDate } from '@/utils/formatDate';
import useCustomState, { State } from '@/hooks/useCustomState';
import { ta } from '@/utils/localized_attribute';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import { ProcessingType } from '@/api/types/processing_activity';
import { getProcessingUnits } from '@/api/processing_units';

const processing_columns = (
  t: TFunction,
  i18n: i18n,
  list: DetailedProcessingActivity[],
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
    header: t('Admission No'),
  },
  {
    accessorKey: 'zone',
    header: t('Zone/Land Parcel'),
    cell: ({ row }: any) => {
      return row.getValue('zone')?.name || row.getValue('landParcel')?.name;
    },
  },
  {
    accessorKey: 'processing_unit',
    header: t('Processing Unit'),
    cell: ({ row }: any) => {
      return ta(row.getValue('processing_unit'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'type',
    header: t('Type'),
    cell: ({ row }: any) => {
      return t(row.original?.type);
    },
  },
  {
    accessorKey: 'admissionEntry.admission',
    header: t('Origin'),
    cell: ({ row }: any) => {
      return t(row.original.admissionEntry?.admission?.type);
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
    header: t('Part of Crop'),
    cell: ({ row }: any) => {
      return ta(row.getValue('partOfCrop'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'processing_method',
    header: t('Processing Method'),
    cell: ({ row }: any) => {
      if (!row.getValue('processing_method')) return;

      return ta(row.getValue('processing_method'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'processing_type',
    header: t('Processing Type'),
    cell: ({ row }: any) => {
      return t(row.getValue('processing_type'));
    },
  },
  {
    accessorKey: 'gross_quantity',
    header: t('Gross Quantity'),
    footer: getTotal(list, (item) => item.gross_quantity),
  },
  {
    accessorKey: 'net_quantity',
    header: t('Net Quantity'),
    footer: getTotal(list, (item) => item.net_quantity),
  },
  {
    accessorKey: 'firo',
    header: t('Firo'),
  },
  {
    accessorKey: 'notes',
    header: t('Notes'),
  },
  {
    accessorKey: 'lot_code',
    header: t('Lot Code'),
  },
];

const dried_columns = (
  t: TFunction,
  i18n: i18n,
  list: DetailedProcessingActivity[],
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
    header: t('Admission No'),
  },
  {
    accessorKey: 'zone',
    header: t('Zone/Land Parcel'),
    cell: ({ row }: any) => {
      return row.getValue('zone')?.name || row.getValue('landParcel')?.code;
    },
  },
  {
    accessorKey: 'processing_unit',
    header: t('Processing Unit'),
    cell: ({ row }: any) => {
      return ta(row.getValue('processing_unit'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'admissionEntry.admission',
    header: t('Origin'),
    cell: ({ row }: any) => {
      return t(row.original.admissionEntry?.admission?.type);
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
    header: t('Part of Crop'),
    cell: ({ row }: any) => {
      return ta(row.getValue('partOfCrop'), 'name', i18n.language);
    },
  },
  {
    accessorKey: 'drier_number',
    header: t('Drier Number'),
  },
  {
    accessorKey: 'drier_temp',
    header: t('Drier Temperature'),
    cell: ({ row }: any) => {
      if (!row.original.drier_temp) return;

      return `${row.original.drier_temp}℃`;
    },
  },
  {
    accessorKey: 'drying_start_date',
    header: t('Drying Start Date'),
    cell: ({ row }: any) => {
      return formatDate(row.original.drying_start_date);
    },
  },
  {
    accessorKey: 'drying_end_date',
    header: t('Drying Start Date'),
    cell: ({ row }: any) => {
      return formatDate(row.original.drying_end_date);
    },
  },
  {
    accessorKey: 'drier_start_hour',
    header: t('Drier Start Time'),
    cell: ({ row }: any) => {
      const hours = row.original?.drier_start_hour;

      if (!hours) return '';

      return hours < 10 ? `0${hours}:00` : `${hours}:00`;
    },
  },
  {
    accessorKey: 'drier_end_hour',
    header: t('Drier End Time'),
    cell: ({ row }: any) => {
      const hours = row.original?.drier_end_hour || 0;

      if (!hours) return '';

      return hours < 10 ? `0${hours}:00` : `${hours}:00`;
    },
  },
  {
    accessorKey: 'processing_type',
    header: t('Processing Type'),
    cell: ({ row }: any) => {
      return t(row.getValue('processing_type'));
    },
  },
  {
    accessorKey: 'gross_quantity',
    header: t('Gross Quantity'),
    footer: getTotal(list, (item) => item.gross_quantity),
  },
  {
    accessorKey: 'net_quantity',
    header: t('Net Quantity'),
    footer: getTotal(list, (item) => item.net_quantity),
  },
  {
    accessorKey: 'firo',
    header: t('Firo'),
  },
  {
    accessorKey: 'notes',
    header: t('Notes'),
  },
  {
    accessorKey: 'lot_code',
    header: t('Lot Code'),
  },
];

interface LocalState {
  crops: Code[];
  processingMethods: Code[];
  processingUnits: ProcessingUnitView[];
  processingTypes: Code[];
  inventoryItems: InventoryItem[];
  driedItems: DetailedProcessingActivity[];
}

interface Filters {
  from_date?: Date;
  to_date?: Date;
}

const filters: Filters = {
  from_date: undefined,
  to_date: undefined,
};

const state = new State<DetailedProcessingActivity, LocalState>({
  crops: [],
  processingMethods: [],
  processingUnits: [],
  processingTypes: [],
  inventoryItems: [],
  driedItems: [],
}).getState();

function filterBy(type: keyof Filters, val?: any) {
  return (
    array: DetailedProcessingActivity[],
  ): DetailedProcessingActivity[] => {
    if (!array.length) return [];

    if (!val) return array;

    switch (type) {
      case 'from_date': {
        const filterDate = new Date(val).getTime();

        return array.filter((item) => {
          return new Date(item.date).getTime() >= filterDate;
        });
      }

      case 'to_date': {
        const filterDate = new Date(val).getTime();

        return array.filter((item) => {
          return new Date(item.date).getTime() <= filterDate;
        });
      }
      default:
        return array;
    }
  };
}

function ProcessingActivities({ type }: { type?: ProcessingType }) {
  const { state: activities, dispatch } = useCustomState(state);
  const [filter, setFilter] = useState<Filters>(filters);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async function () {
      const procCodes = await getCodeCategories([
        'PROCESSING_METHODS',
        'PROCESSING_TYPES',
      ]).then((response) => {
        const procCodes =
          response.find((r) => r.api_name === 'PROCESSING_METHODS')?.codes ||
          [];

        const procTypes =
          response.find((r) => r.api_name === 'PROCESSING_TYPES')?.codes || [];

        return [procCodes, procTypes];
      });

      const crops = await getCodeCategories(['CROPS', 'BMA_CROPS']).then(
        (response) => {
          const crops = response[0]?.codes || [];
          const bma_crops = response[1]?.codes || [];

          return crops.concat(bma_crops);
        },
      );

      const processingUnits = await getProcessingUnits();

      return Promise.all([procCodes, crops, processingUnits])
        .then((data) => {
          dispatch({
            type: 'UPDATE_STATE',
            payload: {
              processingMethods: data[0][0],
              processingTypes: data[0][1],
              crops: data[1],
              processingUnits: data[2],
            },
          });
        })
        .catch((error) => console.error(error));
    })();
  }, []);

  useEffect(() => {
    getProcessingActivities(type).then((response) => {
      dispatch({ type: 'UPDATE_LIST', payload: { list: response } });
    });

    setFilter(filters);
    setShowFilter(false);
  }, [activities.rerender, type]);

  async function deleteFn(activity: ProcessingActivityView): Promise<void> {
    deleteFarmActivity(activity.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: activities.list.filter((item) => item.id !== activity.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  function onEdit(activityId: number): void {
    dispatch({
      type: 'QUEUE_FOR_UPDATE',
      payload: {
        item: activities.list.find((it) => it.id === activityId),
      },
    });
  }

  function onClose(shouldRerender: boolean = false) {
    dispatch({
      type: 'RESET_OVERLAY_AND_ITEM',
      payload: {
        overlay: false,
        item: null,
        rerender: shouldRerender ? ++activities.rerender : activities.rerender,
      },
    });
  }

  // Remove Drying from processing types if page is not drying activities
  const filteredProcessingTypes = !type
    ? activities.processingTypes.filter((pt) => pt.name !== 'Drying')
    : activities.processingTypes;

  const title = type ? 'New Drying Activity' : 'New Processing Activity';

  const filteredList = filterPipeline(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
  )(activities.list);

  return (
    <div>
      {activities.overlay && (
        <ProcessingActivityForm
          processingMethods={activities.processingMethods}
          processingTypes={filteredProcessingTypes}
          processingUnits={activities.processingUnits}
          type={type}
          crops={activities.crops}
          onClose={onClose}
          processingActivity={activities.item}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t(title)}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() =>
            exportProcessingActivities(
              i18n.language,
              type,
              filteredList.map((item) => item.id),
            )
          }
          title={t('Download')}
        />
      </div>

      <Button
        className="flex mt-8 mb-4 bg-gray-800 items-center gap-4"
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <span className="text-lg">{t('Filter Data')}</span>
        <SlidersHorizontal className="h-4" />
      </Button>

      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          <div>
            <p className="text-sm font-semibold">{t('From Date')}:</p>
            <div className="flex items-center gap-1">
              <DatePicker
                date={filter.from_date}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, from_date: value }))
                }
              />

              {filter.from_date && (
                <Button
                  type="button"
                  className="bg-transparent hover:bg-transparent p-0"
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, from_date: undefined }))
                  }
                >
                  <XMarkIcon
                    className="h-5 w-5 text-red-500 hover:text-red-700"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">{t('To Date')}:</p>
            <div className="flex items-center gap-1">
              <DatePicker
                date={filter.to_date}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, to_date: value }))
                }
              />

              {filter.to_date && (
                <Button
                  type="button"
                  className="bg-transparent hover:bg-transparent p-0"
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, to_date: undefined }))
                  }
                >
                  <XMarkIcon
                    className="h-5 w-5 text-red-500 hover:text-red-700"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          canEdit: () => false,
          canDelete: () => false,
          columns:
            type === ProcessingType.DRYING
              ? dried_columns(t, i18n, filteredList)
              : processing_columns(t, i18n, filteredList),
        })}
        data={filteredList}
      />
    </div>
  );
}

export default ProcessingActivities;
