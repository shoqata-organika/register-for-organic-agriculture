import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/TableComponent';
import { filterPipeline } from '@/utils/filterPipeline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/datepicker';
import { SlidersHorizontal } from 'lucide-react';
import { withActionColumns } from '@/components/withActionColumns';
import useCustomState, { State } from '@/hooks/useCustomState';
import { formatDate } from '@/utils/formatDate';
import CleaningActivitiesForm from './form';
import { CleaningActivity } from '@/api/types/cleaning_activity';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import { getProcessingUnits } from '@/api/processing_units';
import {
  deleteCleaningActivity,
  getCleaningActivities,
  exportCleaningActivities,
} from '@/api/cleaning_activity';
import ExportButton from '@/components/ExportButton';
import AddButton from '@/components/AddButton';

type LocalState = {
  processingUnits: ProcessingUnitView[];
};
const state = new State<CleaningActivity, LocalState>({
  processingUnits: [],
}).getState();

interface Filters {
  from_date?: Date;
  to_date?: Date;
}

const filters: Filters = {
  from_date: undefined,
  to_date: undefined,
};

function filterBy(type: keyof Filters, val?: any) {
  return (array: CleaningActivity[]): CleaningActivity[] => {
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

const CleaningActivities = () => {
  const { state: items, dispatch, onClose, onEdit } = useCustomState(state);
  const [filter, setFilter] = useState<Filters>(filters);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getCleaningActivities().then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });

    getProcessingUnits().then((response) => {
      dispatch({
        type: 'UPDATE_STATE',
        payload: { processingUnits: response },
      });
    });
  }, [items.rerender]);

  async function deleteFn(cleaningActivity: CleaningActivity): Promise<void> {
    deleteCleaningActivity(cleaningActivity.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: items.list.filter((item) => item.id !== cleaningActivity.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  const filteredList = filterPipeline(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
  )(items.list);

  return (
    <div>
      {items.overlay && (
        <CleaningActivitiesForm
          onClose={onClose}
          item={items.item}
          processingUnits={items.processingUnits}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Activity')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() =>
            exportCleaningActivities(
              i18n.language,
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
          columns: [
            {
              accessorKey: 'date',
              header: t('Date'),
              cell: ({ row }: any) => {
                return formatDate(row.getValue('date'));
              },
            },
            {
              accessorKey: 'processingUnit',
              header: t('Processing Unit'),
              cell: ({ row }: any) => {
                return row.getValue('processingUnit')?.name;
              },
            },
            {
              accessorKey: 'cleaning_tool',
              header: t('Cleaning Tool'),
            },
            {
              accessorKey: 'cleaned_device',
              header: t('Cleaned Device'),
            },
            {
              accessorKey: 'reason_of_cleaning',
              header: t('Reason of Cleaning'),
            },
            {
              accessorKey: 'area',
              header: t('Cleaning Area'),
            },
            {
              accessorKey: 'notes',
              header: t('Notes'),
            },
            {
              accessorKey: 'person',
              header: t('Responsible Person'),
              cell: ({ row }: any) => {
                return row.getValue('person')?.name;
              },
            },
          ],
        })}
        data={filteredList}
      />
    </div>
  );
};

export default CleaningActivities;
