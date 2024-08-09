import { useEffect, useState } from 'react';
import { getTotal } from '@/utils';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/TableComponent';
import { filterPipeline } from '@/utils/filterPipeline';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { DatePicker } from '@/components/datepicker';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { withActionColumns } from '@/components/withActionColumns';
import { TFunction } from 'i18next';
import useCustomState, { State } from '@/hooks/useCustomState';
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
import { formatDate } from '@/utils/formatDate';
import InputsForm from './inputs-form';
import ExportButton from '@/components/ExportButton';
import AddButton from '@/components/AddButton';

type LocalState = {
  locations: InventoryLocation[];
};
const state = new State<InventoryItem, LocalState>({
  locations: [],
}).getState();

export type AllowedInventoryItemType =
  | InventoryItemType.INPUT
  | InventoryItemType.PLANTING_MATERIAL;

interface Props {
  type: AllowedInventoryItemType;
}

const getColumns = (
  type: AllowedInventoryItemType,
  t: TFunction,
  list: InventoryItem[],
) => {
  const baseColumns = [
    {
      accessorKey: 'date',
      header: t('Date'),
      cell: ({ row }: any) => {
        return formatDate(row.getValue('date'));
      },
      footer: t('Total'),
    },
    {
      accessorKey: 'name',
      header: t('Product Name'),
      cell: ({ row }: any) => {
        return t(row.getValue('name'), row.getValue('name'));
      },
    },
    {
      accessorKey: 'producer.name',
      header: t('Producer'),
    },
    {
      accessorKey: 'sku',
      header: t('SKU'),
    },
    {
      accessorKey: 'purchaseDate',
      header: t('Purchase Date'),
      cell: ({ row }: any) => {
        return formatDate(row.getValue('purchaseDate'));
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
      footer: getTotal(list, (item) => item.quantity),
    },
    {
      accessorKey: 'cost',
      header: t('Price'),
      footer: getTotal(list, (item) => item.cost),
    },
    {
      accessorKey: 'packageType',
      header: t('Package Type'),
      cell: ({ row }: any) => {
        return t(row.getValue('packageType'));
      },
    },
  ];
  if (type === InventoryItemType.INPUT) {
    return baseColumns;
  } else {
    return baseColumns.filter(
      (column) => column.accessorKey !== 'producer.name',
    );
  }
};

function filterBy(type: keyof Filters, val?: any) {
  return (array: InventoryItem[]): InventoryItem[] => {
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

interface Filters {
  from_date?: Date;
  to_date?: Date;
}

const filters: Filters = {
  from_date: undefined,
  to_date: undefined,
};

const InputsInventory = ({ type }: Props) => {
  const { state: items, dispatch, onClose, onEdit } = useCustomState(state);
  const [filter, setFilter] = useState(filters);
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

  const filteredList = filterPipeline(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
  )(items.list);

  return (
    <div>
      {items.overlay && (
        <InputsForm
          onClose={onClose}
          item={items.item}
          locations={items.locations}
          type={type}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Admission')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

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
          columns: getColumns(type, t, filteredList),
        })}
        data={filteredList}
      />
    </div>
  );
};

export default InputsInventory;
