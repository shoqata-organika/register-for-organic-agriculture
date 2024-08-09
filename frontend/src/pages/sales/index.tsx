import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import { Filter } from '@/components/filter';
import { unique } from '@/utils';
import ExportButton from '@/components/ExportButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import { Button } from '@/components/ui/button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DatePicker } from '@/components/datepicker';
import { SlidersHorizontal } from 'lucide-react';
import SalesForm from './form';
import { deleteSale, getSales, exportSales } from '@/api/accounting';
import { Sale } from '@/api/types/accounting';
import useCustomState, { State } from '@/hooks/useCustomState';
import { filterPipeline } from '@/utils/filterPipeline';
import { getTotal } from '@/utils';
import { formatMoney } from '@/utils/formatMoney';
import { formatDate } from '@/utils/formatDate';
import { ta } from '@/utils/localized_attribute';

const state = new State<Sale>().getState();

interface Filters {
  from_date?: Date;
  to_date?: Date;
  customer?: string;
  type?: string;
  crop?: string;
}

function filterBy(type: keyof Filters, val?: any) {
  return (array: Sale[]): Sale[] => {
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

      case 'customer': {
        return array.filter((item) => {
          return item?.customer.id === val;
        });
      }

      case 'type': {
        return array.filter((item) => {
          return item.type === val;
        });
      }

      default:
        return array;
    }
  };
}

const filterState: Filters = {
  from_date: undefined,
  to_date: undefined,
};

const Sales = () => {
  const { state: sales, dispatch, onClose, onEdit } = useCustomState(state);
  const [filter, setFilter] = useState<Filters>(filterState);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getSales().then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });
  }, [sales.rerender]);

  async function deleteFn(sale: Sale): Promise<void> {
    deleteSale(sale.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: sales.list.filter((item) => item.id !== sale.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  const filteredList = filterPipeline(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
    filterBy('customer', filter.customer),
    filterBy('type', filter.type),
  )(sales.list);

  const crops = filteredList.map((item) => item.inventoryItem?.crop);

  return (
    <div>
      {sales.overlay && <SalesForm onClose={onClose} sale={sales.item} />}

      <div className="flex justify-between">
        <AddButton
          title={t('New Sale')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() =>
            exportSales(
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

          <Filter
            label={t('Customer')}
            items={unique(
              sales.list.map((sale) => ({
                value: sale.customer_id,
                label: sale.customer.name,
              })) || [],
            )}
            value={filter.customer}
            onChange={(value) => {
              setFilter((prev) => ({ ...prev, customer: value }));
            }}
          />

          <Filter
            label={t('Sale Type')}
            items={unique(
              sales.list.map((sale) => ({
                value: sale.type,
                label: t(sale.type),
              })) || [],
            )}
            value={filter.type}
            onChange={(value) => {
              setFilter((prev) => ({ ...prev, type: value }));
            }}
          />

          <Filter
            label={t('Crop')}
            items={unique(
              crops.map((crop) => ({
                value: crop!.id,
                label: ta(crop, 'name', i18n.language),
              })) || [],
            )}
            value={filter.type}
            onChange={(value) => {
              setFilter((prev) => ({ ...prev, type: value }));
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
              accessorKey: 'date',
              header: t('Date'),
              cell: ({ row }: any) => {
                const date = new Date(row.getValue('date'));

                return formatDate(date);
              },
              footer: t('Total'),
            },
            {
              accessorKey: 'customer',
              header: t('Customer'),
              cell: ({ row }: any) => {
                return row.getValue('customer')?.name;
              },
            },
            {
              accessorKey: 'product',
              header: t('Product/Service'),
              cell: ({ row }: any) => {
                return row.original.type === 'product'
                  ? `${ta(row.original.inventoryItem.crop, 'name', i18n.language)} - ${ta(row.original.inventoryItem.partOfCrop, 'name', i18n.language)}`
                  : row.getValue('description');
              },
            },
            {
              accessorKey: 'quantity',
              header: t('Quantity'),
            },
            {
              accessorKey: 'price',
              header: t('Price'),
              cell: ({ row }: any) => {
                const amount = parseFloat(row.getValue('price'));

                return formatMoney(amount);
              },
              footer: getTotal(filteredList, (item) => item.price),
            },
            {
              accessorKey: 'total',
              header: t('Total'),
              cell: ({ row }: any) => {
                const total =
                  parseFloat(row.getValue('price')) *
                  parseFloat(row.getValue('quantity'));

                return formatMoney(total);
              },
            },
          ],
        })}
        data={filteredList}
      />
    </div>
  );
};

export default Sales;
