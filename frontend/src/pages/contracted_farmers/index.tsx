import { useEffect } from 'react';
import {
  getAllContractedFarmers,
  deleteContractedFarmer,
  exportContractedFarmers,
} from '@/api/contracted_farmers';
import AddButton from '@/components/AddButton';
import ExportButton from '@/components/ExportButton';
import { UserIcon } from '@heroicons/react/24/outline';
import { ContractedFarmerView } from '@/api/types/contracted_farmers';
import ContractedFarmersForm from './form';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import useCustomState, { State } from '@/hooks/useCustomState';

const state = new State<ContractedFarmerView>().getState();

function ContractedFarmers() {
  const {
    state: contractedFarmers,
    dispatch,
    onClose,
    onEdit,
  } = useCustomState(state);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async function () {
      const contractedFarmers = await getAllContractedFarmers();

      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          list: contractedFarmers,
        },
      });
    })();
  }, [contractedFarmers.rerender]);

  async function deleteFn(activity: ContractedFarmerView): Promise<void> {
    deleteContractedFarmer(activity.id).then(() =>
      dispatch({
        type: 'UPDATE_LIST',
        payload: {
          list: contractedFarmers.list.filter(
            (item) => item.id !== activity.id,
          ),
        },
      }),
    );
  }

  return (
    <div>
      {contractedFarmers.overlay && (
        <ContractedFarmersForm
          contractedFarmer={contractedFarmers.item}
          onClose={onClose}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
          title={t('New Contracted Farmer')}
        />

        <ExportButton
          onClick={() => exportContractedFarmers(i18n.language)}
          title={t('Download')}
        />
      </div>

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          columns: [
            {
              header: t('Photo'),
              cell: ({ row }: any) => {
                return (
                  <div className="pl-1">
                    {row.original?.image ? (
                      <img
                        className="block h-8 w-8 rounded-full bg-gray-50"
                        src={row.original.image}
                      />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                  </div>
                );
              },
            },
            {
              accessorKey: 'code',
              header: t('Code'),
            },
            {
              accessorKey: 'name',
              header: t('Name'),
            },
            {
              accessorKey: 'personal_num',
              header: t('Personal Number'),
            },
            {
              accessorKey: 'address',
              header: t('Address'),
            },
            {
              accessorKey: 'external_id',
              header: t('External Id'),
            },
          ],
        })}
        data={contractedFarmers.list}
      />
    </div>
  );
}

export default ContractedFarmers;
