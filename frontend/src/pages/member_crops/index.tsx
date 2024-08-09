import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ta } from '@/utils/localized_attribute';
import AddButton from '@/components/AddButton';
import ExportButton from '@/components/ExportButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import { AdmissionType } from '@/api/types/admission';
import { getMemberCrops } from '@/api/members';
import { exportMemberCrops } from '@/api/members';
import useCustomState, { State } from '@/hooks/useCustomState';
import { MemberCropView } from '@/api/types/user';
import { deleteMemberCrop } from '@/api/members';
import { CropType } from '@/api/types/crop';
import CropsForm from './form';

const state = new State<MemberCropView>().getState();

export default function MemberCrops({ type }: { type: AdmissionType }) {
  const { state: crops, onEdit, dispatch, onClose } = useCustomState(state);
  const { t, i18n } = useTranslation();
  const isCollection = type === AdmissionType.COLLECTION;
  const cropType = isCollection ? CropType.CROPS : CropType.BMA_CROPS;

  async function deleteFn(crop: MemberCropView): Promise<void> {
    deleteMemberCrop(crop.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: crops.list.filter((cp) => cp.id !== crop.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    getMemberCrops(cropType)
      .then((memberCrops) => {
        dispatch({
          type: 'UPDATE_STATE',
          payload: { list: memberCrops },
        });
      })
      .catch(console.error);
  }, [crops.rerender, type]);

  return (
    <div>
      {crops.overlay && (
        <CropsForm type={type} onClose={onClose} crop={crops.item} />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Crop')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() => exportMemberCrops(i18n.language, cropType)}
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
              header: t('Previous Crop Code'),
              cell: ({ row }: any) => {
                const crop = row.original.crop;

                if (crop) {
                  return crop.code;
                }
              },
            },
            {
              accessorKey: 'code',
              header: t('Modified Crop Code'),
            },
            {
              accessorKey: 'name',
              header: t('Crop Name'),
              cell: ({ row }: any) => {
                const crop = row.original.crop;
                if (crop) {
                  return ta(crop, 'name', i18n.language);
                }
              },
            },
          ],
        })}
        data={crops.list}
      />
    </div>
  );
}
