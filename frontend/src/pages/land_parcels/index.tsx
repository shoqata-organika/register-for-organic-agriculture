import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import { formatDate } from '@/utils/formatDate';
import { getTotal } from '@/utils';
import { ExternalLink } from 'lucide-react';
import DataTable from '@/components/TableComponent';
import { ta } from '@/utils/localized_attribute';
import { getMemberCrops } from '@/api/members';
import { withActionColumns } from '@/components/withActionColumns';
import { LandParcelView } from '@/api/types/land_parcel';
import {
  deleteLandParcel,
  exportLandParcels,
  getLandParcels,
} from '@/api/land_parcel';
import useCustomState, { State } from '@/hooks/useCustomState';
import { Code } from '@/api/types/code_category';
import LandParcelsForm from './form';
import ExportButton from '@/components/ExportButton';
import { formatArea } from '@/utils/formatArea';
import { CropType } from '@/api/types/crop';

const state = new State<LandParcelView, { crops: Code[] }>({
  crops: [],
}).getState();

const LandParcels = () => {
  const { state: landParcels, dispatch, onClose } = useCustomState(state);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async function () {
      const parcels = await getLandParcels();
      const memberCrops = await getMemberCrops(CropType.BMA_CROPS);

      return Promise.all([parcels, memberCrops])
        .then((data) => {
          dispatch({
            type: 'UPDATE_STATE',
            payload: {
              list: data[0],
              crops: data[1].map((mcp) => mcp.crop),
            },
          });
        })
        .catch((error) => console.error(error));
    })();
  }, [landParcels.rerender]);

  const subParcels = useMemo(() => {
    return landParcels.list
      .map((parcel) => {
        return parcel.subParcels.map((sp) => ({
          ...sp,
          crops: parcel.crops.filter((cp) => {
            return cp.sub_parcel_id === sp.id;
          }),
          landParcel: parcel,
        }));
      })
      .flat();
  }, [landParcels.list]);

  async function deleteFn(activity: LandParcelView): Promise<void> {
    deleteLandParcel(activity.id).then(() =>
      dispatch({
        type: 'UPDATE_LIST',
        payload: {
          list: landParcels.list.filter((item) => item.id !== activity.id),
        },
      }),
    );
  }

  function onEdit(itemId: number | string): void {
    const landParcel = landParcels.list.find((parcel) =>
      parcel.subParcels.find((sp) => sp.id === itemId),
    );

    dispatch({
      type: 'QUEUE_FOR_UPDATE',
      payload: {
        item: landParcel,
      },
    });
  }

  return (
    <div>
      {landParcels.overlay && (
        <LandParcelsForm
          crops={landParcels.crops}
          onClose={onClose}
          landParcel={landParcels.item}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Land Parcel')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() => exportLandParcels(i18n.language)}
          title={t('Download')}
        />
      </div>
      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          canDelete: () => false,
          columns: [
            {
              accessorKey: 'landParcel.code',
              header: t('Land Parcel Code'),
              footer: t('Total'),
            },
            {
              accessorKey: 'landParcel.total_area',
              header: t('Total Area'),
              cell: ({ row }: any) => {
                return formatArea(row.original?.landParcel.total_area);
              },
              footer: getTotal(landParcels.list, (parcel) => parcel.total_area),
            },
            {
              accessorKey: 'code',
              header: t('Sub Parcel Code'),
            },
            {
              accessorKey: 'area',
              header: t('Sub Parcel Area'),
              cell: ({ row }: any) => {
                return formatArea(row.original?.area);
              },
              footer: getTotal(subParcels, (sp) => sp.area),
            },
            {
              accessorKey: 'crops',
              header: t('Crops'),
              cell: ({ row }: any) => {
                const crops =
                  row.original.crops.map((cp: any) =>
                    ta(cp.crop, 'name', i18n.language),
                  ) || [];

                return crops.join(', ');
              },
            },
            {
              accessorKey: 'landParcel.cadastral_no',
              header: t('Cadastral Number'),
            },
            {
              accessorKey: 'landParcel.location',
              header: t('Location'),
            },
            {
              accessorKey: 'landParcel.applied_standards',
              header: t('Applied Standards'),
            },
            {
              accessorKey: 'organic_transition_date',
              header: t('Organic Transition Date'),
              cell: ({ row }: any) => (
                <span>
                  {row.original?.landParcel.organic_transition_date
                    ? formatDate(
                        new Date(
                          row.original?.landParcel.organic_transition_date,
                        ),
                      )
                    : ''}
                </span>
              ),
            },
            {
              accessorKey: 'buffer_zone',
              header: t('Buffer Zone'),
              cell: ({ row }: any) => {
                return formatArea(row.original?.landParcel.buffer_zone);
              },
              footer: getTotal(subParcels, (sp) => sp.landParcel?.buffer_zone),
            },
            {
              accessorKey: 'file',
              header: t('Map Document'),
              cell: ({ row }: any) => {
                const fileLink = row.original.landParcel.file || '';

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
        data={subParcels}
      />
    </div>
  );
};

export default LandParcels;
