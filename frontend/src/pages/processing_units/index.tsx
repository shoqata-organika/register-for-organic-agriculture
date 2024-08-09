import { useEffect, useState } from 'react';
import {
  getProcessingUnits,
  exportProcessingUnits,
} from '@/api/processing_units';
import { useTranslation } from 'react-i18next';
import { filterPipeline } from '@/utils/filterPipeline';
import { Filter } from '@/components/filter';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { deleteProcessingUnit } from '@/api/processing_units';
import { ExternalLink } from 'lucide-react';
import AddButton from '@/components/AddButton';
import { unique } from '@/utils';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import { getTotal } from '@/utils';
import ProcessingUnitForm from './processing-unit-form';
import useCustomState, { State } from '@/hooks/useCustomState';
import DataTable from '@/components/TableComponent';
import ExportButton from '@/components/ExportButton';
import { formatDate } from '@/utils/formatDate';
import { withActionColumns } from '@/components/withActionColumns';
import { formatArea } from '@/utils/formatArea';

const state = new State<ProcessingUnitView>().getState();

interface Filters {
  name?: string;
}

const filters: Filters = {
  name: undefined,
};

function filterBy(type: keyof Filters, val?: any) {
  return (array: ProcessingUnitView[]): ProcessingUnitView[] => {
    if (!array.length) return [];

    if (!val) return array;

    switch (type) {
      case 'name': {
        return array.filter((item) => {
          return item.id === +val;
        });
      }

      default:
        return array;
    }
  };
}

function ProcessingUnits() {
  const { state: units, dispatch, onClose, onEdit } = useCustomState(state);
  const [filter, setFilter] = useState<Filters>(filters);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getProcessingUnits().then((data) =>
      dispatch({
        type: 'UPDATE_STATE',
        payload: { list: data },
      }),
    );
  }, [units.rerender]);

  async function deleteFn(unit: ProcessingUnitView): Promise<void> {
    deleteProcessingUnit(unit.id!)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: units.list.filter((item) => item.id !== unit.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  const filteredList = filterPipeline(filterBy('name', filter.name))(
    units.list,
  );

  return (
    <div>
      {units.overlay && (
        <ProcessingUnitForm processingUnit={units.item} onClose={onClose} />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Processing Unit')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() =>
            exportProcessingUnits(
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
          <Filter
            label={t('Name')}
            items={unique(
              units.list?.map((unit) => ({
                value: unit.id,
                label: unit.name,
              })) || [],
            )}
            value={filter.name}
            onChange={(value) => {
              setFilter((prev) => ({ ...prev, name: value }));
            }}
          />
        </div>
      )}

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          columns: [
            {
              accessorKey: 'name',
              header: t('Name'),
              footer: t('Total'),
            },
            {
              accessorKey: 'ownership_status',
              header: t('Ownership Status'),
              cell: ({ row }: any) => {
                return t(row.original.ownership_status);
              },
            },
            {
              accessorKey: 'contract_start_date',
              header: t('Contract Start Date'),
              cell: ({ row }: any) => {
                return formatDate(row.original.contract_start_date);
              },
            },
            {
              accessorKey: 'contract_end_date',
              header: t('Contract End Date'),
              cell: ({ row }: any) => {
                return formatDate(row.original.contract_end_date);
              },
            },
            {
              accessorKey: 'type_of_processing',
              header: t('Type of Processing'),
            },
            {
              accessorKey: 'total_area',
              header: t('Total Area (sqm)'),
              cell: ({ row }: any) => {
                return formatArea(row.original.total_area, 'square-meter');
              },
              footer: getTotal(filteredList, (item) => item.total_area),
            },
            {
              accessorKey: 'address',
              header: t('Address'),
            },
            {
              accessorKey: 'latitude',
              header: t('Latitude'),
            },
            {
              accessorKey: 'longitude',
              header: t('Longitude'),
            },
            {
              accessorKey: 'file',
              header: t('Map Document'),
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
          ],
        })}
        data={filteredList}
      />
    </div>
  );
}

export default ProcessingUnits;
