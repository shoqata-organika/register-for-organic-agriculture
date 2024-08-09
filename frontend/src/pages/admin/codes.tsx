import { useEffect } from 'react';
import { cn } from '@/utils';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/TableComponent';
import AddButton from '@/components/AddButton';
import { getCodeCategory } from '@/api/code_category';
import { Code, API_NAMES } from '@/api/types/code_category';
import { withActionColumns } from '@/components/withActionColumns';
import CodesForm from './code-form';
import useCustomState, { State } from '@/hooks/useCustomState';

const state = new State<Code>().getState();

export default function AdminCodes({ type }: { type: API_NAMES }) {
  const { state: codes, onEdit, dispatch, onClose } = useCustomState(state);
  const { t } = useTranslation();
  const onlyCrops = type === API_NAMES.CROPS || type === API_NAMES.BMA_CROPS;

  useEffect(() => {
    getCodeCategory(type).then((response) => {
      dispatch({
        type: 'UPDATE_STATE',
        payload: { list: response.codes },
      });
    });
  }, [codes.rerender, type]);

  return (
    <div className={cn('p-4')}>
      {codes.overlay && (
        <CodesForm type={type} onClose={onClose} code={codes.item} />
      )}

      <AddButton
        title={t('New Data')}
        onClick={() =>
          dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
        }
      />

      <DataTable
        columns={withActionColumns({
          onDelete: () => {},
          canDelete: () => false,
          onEdit,
          columns: [
            {
              accessorKey: 'name',
              header: t('English'),
            },
            {
              accessorKey: 'name_sq',
              header: t('Shqip'),
            },
            {
              accessorKey: 'name_sr',
              header: t('Srpski'),
            },
            ...(onlyCrops
              ? [
                  {
                    accessorKey: 'code',
                    header: t('Code'),
                  },
                ]
              : []),
          ],
        })}
        data={codes.list}
      />
    </div>
  );
}
