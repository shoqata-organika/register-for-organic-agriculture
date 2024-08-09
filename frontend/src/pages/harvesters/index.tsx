import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import { ExternalLink } from 'lucide-react';
import AddButton from '@/components/AddButton';
import ExportButton from '@/components/ExportButton';
import { getHarvesters } from '@/api/user';
import { getZones } from '@/api/zones';
import { Harvester, HarvesterView } from '@/api/types/harvester';
import { Zone } from '@/api/types/zone';
import { deleteHarvester, exportHarvesters } from '@/api/harvester';
import HarvestersForm from './form';
import useCustomState, { State } from '@/hooks/useCustomState';
import { UserIcon } from '@heroicons/react/24/outline';

const state = new State<HarvesterView, { zones: Zone[] }>({
  zones: [],
}).getState();

const Harvesters = () => {
  const {
    state: harvesters,
    dispatch,
    onClose,
    onEdit,
  } = useCustomState(state);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async function () {
      const harvesters = await getHarvesters();
      const zones = await getZones();

      return Promise.all([harvesters, zones])
        .then((response) =>
          dispatch({
            type: 'UPDATE_STATE',
            payload: {
              list: response[0],
              zones: response[1],
            },
          }),
        )
        .catch((error) => console.error(error));
    })();
  }, []);

  useEffect(() => {
    getHarvesters()
      .then((response) =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: response,
          },
        }),
      )
      .catch((error) => console.error(error));
  }, [harvesters.rerender]);

  async function deleteFn(activity: Harvester): Promise<void> {
    deleteHarvester(activity.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: harvesters.list.filter((item) => item.id !== activity.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  return (
    <div>
      {harvesters.overlay && (
        <HarvestersForm
          onClose={onClose}
          harvester={harvesters.item}
          zones={harvesters.zones}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Harvester')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() => exportHarvesters(i18n.language)}
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
                        src={row.original?.image}
                      />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                  </div>
                );
              },
            },
            {
              accessorKey: 'first_name',
              header: t('First name'),
            },
            {
              accessorKey: 'last_name',
              header: t('Last name'),
            },
            {
              accessorKey: 'code',
              header: t('Code'),
            },
            {
              accessorKey: 'address',
              header: t('Address'),
            },
            {
              accessorKey: 'legal_status',
              header: t('Legal Status'),
              cell: ({ row }: any) => {
                return t(row.original.legal_status);
              },
            },
            {
              accessorKey: 'zone.code',
              header: t('Zone Code'),
            },
            {
              accessorKey: 'contract_file',
              header: t('Contract File'),
              cell: ({ row }: any) => {
                const fileLink = row.original.contract_file || '';

                return (
                  <a
                    className="flex gap-1 items-center justify-center"
                    href={fileLink}
                    target="_blank"
                  >
                    <span>{fileLink ? t('Contract') : ''}</span>
                    {fileLink && <ExternalLink className="w-4 h-4" />}
                  </a>
                );
              },
            },
          ],
        })}
        data={harvesters.list}
      />
    </div>
  );
};

export default Harvesters;
