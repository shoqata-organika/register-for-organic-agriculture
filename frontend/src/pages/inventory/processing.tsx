import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import { filterState, filterBy } from './filters';
import { filterPipeline } from '@/utils/filterPipeline';
import { Button } from '@/components/ui/button';
import { getTotal } from '@/utils';
import useCustomState, { State } from '@/hooks/useCustomState';
import { Filter } from '@/components/filter';
import { SlidersHorizontal } from 'lucide-react';
import { DatePicker } from '@/components/datepicker';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { unique } from '@/utils';
import ExportButton from '@/components/ExportButton';
import {
  InventoryItem,
  InventoryItemType,
  InventoryLocation,
} from '@/api/types/inventory';
import {
  deleteInventoryItem,
  getInventoryItems,
  exportInventoryItems,
  getLocations,
} from '@/api/inventory';
import { Admission } from '@/api/types/admission';
import { ta } from '@/utils/localized_attribute';
import { formatDate } from '@/utils/formatDate';
import ProcessingInventoryForm from './processing-form';

type LocalState = {
  admissions: Admission[];
  locations: InventoryLocation[];
};
const state = new State<InventoryItem, LocalState>({
  admissions: [],
  locations: [],
}).getState();

const ProcessingInventory = ({ type }: { type: InventoryItemType }) => {
  const { state: items, dispatch, onClose, onEdit } = useCustomState(state);
  const [filter, setFilter] = useState(filterState());
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getInventoryItems(type).then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });

    getLocations().then((response) => {
      dispatch({
        type: 'UPDATE_STATE',
        payload: { locations: response },
      });
    });
  }, [items.rerender]);

  async function deleteFn(inventoryItem: InventoryItem): Promise<void> {
    deleteInventoryItem(inventoryItem.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: items.list.filter((item) => item.id !== inventoryItem.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  const filteredList = filterPipeline<InventoryItem>(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
    filterBy('admission', filter.admission),
    filterBy('crop', filter.crop, i18n.language),
  )(items.list);

  return (
    <div>
      {items.overlay && (
        <ProcessingInventoryForm
          onClose={onClose}
          item={items.item}
          locations={items.locations}
        />
      )}

      <div className="flex item-center justify-between">
        <Button
          className="flex mb-8 bg-gray-900 items-center gap-4"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <span className="text-lg">{t('Filter Data')}</span>
          <SlidersHorizontal className="h-4" />
        </Button>

        <ExportButton
          onClick={() =>
            exportInventoryItems(
              type,
              i18n.language,
              filteredList.map((item) => item.id),
            )
          }
          title={t('Download')}
        />
      </div>

      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          <div>
            <p className="text-sm font-semibold">{t('From Date')}</p>

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
                  className="bg-transparent hover:bg-transparent p-1"
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, from_date: undefined }))
                  }
                >
                  <XMarkIcon
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">{t('To Date')}</p>
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
                  className="bg-transparent hover:bg-transparent p-1"
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, to_date: undefined }))
                  }
                >
                  <XMarkIcon
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
          </div>

          <Filter
            label={t('Admission')}
            items={items.list.map((item) => ({
              value: item.admissionEntry.admission_id!,
              label: item.admissionEntry.admission!.admission_no!,
            }))}
            value={filter.admission}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, admission: value }))
            }
          />

          <Filter
            label={t('Crop')}
            items={Array.from(
              unique(
                items.list.map((item) => ({
                  value: item.id,
                  label: ta(item.crop, 'name', i18n.language),
                })),
              ),
            )}
            value={filter.crop}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, crop: value }))
            }
          />
        </div>
      )}

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          columns: [
            {
              accessorKey: 'sku',
              header: t('Lot Code'),
              footer: t('Total'),
            },
            {
              accessorKey: 'date',
              header: t('Date'),
              cell: ({ row }: any) => {
                return formatDate(row.getValue('date'));
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
              accessorKey: 'inventoryLocation',
              header: t('Location'),
              cell: ({ row }: any) => {
                return row.getValue('inventoryLocation')?.name;
              },
            },
            {
              accessorKey: 'quantity',
              header: t('Quantity'),
              footer: getTotal(filteredList, (item) => item.quantity),
            },
            {
              accessorKey: 'packageType',
              header: t('Package Type'),
              cell: ({ row }: any) => {
                return t(row.getValue('packageType'));
              },
            },
          ],
        })}
        data={filteredList}
      />
    </div>
  );
};

export default ProcessingInventory;
