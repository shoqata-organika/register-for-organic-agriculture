import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import ExportButton from '@/components/ExportButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import useCustomState, { State } from '@/hooks/useCustomState';
import { getTotal } from '@/utils';
import { formatArea } from '@/utils/formatArea';
import { InventoryLocation } from '@/api/types/inventory';
import {
  deleteLocation,
  getLocations,
  exportInventoryLocations,
} from '@/api/inventory';
import InventoryLocationsForm from './form';

const state = new State<InventoryLocation>().getState();

const InventoryLocations = () => {
  const { state: locations, dispatch, onClose, onEdit } = useCustomState(state);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getLocations().then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });
  }, [locations.rerender]);

  async function deleteFn(location: InventoryLocation): Promise<void> {
    deleteLocation(location.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: locations.list.filter((item) => item.id !== location.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  return (
    <div>
      {locations.overlay && (
        <InventoryLocationsForm onClose={onClose} location={locations.item} />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Storage')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() => exportInventoryLocations(i18n.language)}
          title={t('Download')}
        />
      </div>

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
              accessorKey: 'area',
              header: t('Area (sqm)'),
              cell: ({ row }: any) => {
                return formatArea(row.original.area, 'square-meter');
              },
              footer: getTotal(locations.list, (location) => location.area),
            },
          ],
        })}
        data={locations.list}
      />
    </div>
  );
};

export default InventoryLocations;
