import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import { ExternalLink } from 'lucide-react';
import ExportButton from '@/components/ExportButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import { Zone } from '@/api/types/zone';
import { getTotal } from '@/utils';
import { deleteZone, getZones, exportZones } from '@/api/zones';
import useCustomState, { State } from '@/hooks/useCustomState';
import ZonesForm from './form';

const state = new State<Zone>().getState();

const Zones = () => {
  const { state: zones, dispatch, onClose, onEdit } = useCustomState(state);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    getZones().then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });
  }, [zones.rerender]);

  async function deleteFn(zone: Zone): Promise<void> {
    deleteZone(zone.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: zones.list.filter((item) => item.id !== zone.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  return (
    <div>
      {zones.overlay && <ZonesForm onClose={onClose} zone={zones.item} />}

      <div className="flex justify-between">
        <AddButton
          title={t('New Zone')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() => exportZones(i18n.language)}
          title={t('Download')}
        />
      </div>

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          columns: [
            {
              accessorKey: 'code',
              header: t('Code'),
              footer: t('Total'),
            },
            {
              accessorKey: 'name',
              header: t('Name'),
            },
            {
              accessorKey: 'total_area',
              header: t('Total Area'),
              footer: getTotal(zones.list, (zone) => zone.total_area),
            },
            {
              accessorKey: 'longitude',
              header: t('Longitude'),
            },
            {
              accessorKey: 'latitude',
              header: t('Latitude'),
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
        data={zones.list}
      />
    </div>
  );
};

export default Zones;
