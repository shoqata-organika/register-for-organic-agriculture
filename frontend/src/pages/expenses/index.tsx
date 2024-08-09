import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import SalesForm from './form';
import { getTotal } from '@/utils';
import { deleteExpense, getExpenses } from '@/api/accounting';
import { Expense } from '@/api/types/accounting';
import useCustomState, { State } from '@/hooks/useCustomState';
import { formatMoney } from '@/utils/formatMoney';
import { formatDate } from '@/utils/formatDate';

const state = new State<Expense>().getState();

const Expenses = () => {
  const { state: expenses, dispatch, onClose, onEdit } = useCustomState(state);

  const { t } = useTranslation();

  useEffect(() => {
    getExpenses().then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });
  }, [expenses.rerender]);

  async function deleteFn(activity: Expense): Promise<void> {
    deleteExpense(activity.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: expenses.list.filter((item) => item.id !== activity.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  return (
    <div>
      {expenses.overlay && (
        <SalesForm onClose={onClose} expense={expenses.item} />
      )}

      <AddButton
        title={t('New Expense')}
        onClick={() =>
          dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
        }
      />

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
              accessorKey: 'type',
              header: t('Type'),
              cell: ({ row }: any) => {
                return t(`expenses_${row.getValue('type')}`);
              },
            },
            {
              accessorKey: 'supplier',
              header: t('Supplier'),
              cell: ({ row }: any) => {
                return row.getValue('supplier')?.name;
              },
            },
            {
              accessorKey: 'product',
              header: t('Description'),
            },
            {
              accessorKey: 'quantity',
              header: t('Quantity'),
              footer: getTotal(expenses.list, (item) => item.quantity),
            },
            {
              accessorKey: 'price',
              header: t('Price'),
              cell: ({ row }: any) => {
                const amount = parseFloat(row.getValue('price'));

                return formatMoney(amount);
              },
              footer: getTotal(expenses.list, (item) => item.price),
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
              footer: formatMoney(
                +getTotal(expenses.list, (item) => {
                  const total =
                    parseFloat(item.price.toString()) *
                    parseFloat(item.quantity.toString());

                  return total;
                }),
              ),
            },
          ],
        })}
        data={expenses.list}
      />
    </div>
  );
};

export default Expenses;
