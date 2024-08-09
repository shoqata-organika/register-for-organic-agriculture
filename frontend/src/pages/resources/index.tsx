import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import useCustomState, { State } from '@/hooks/useCustomState';
import { MemberResource, ResourceType } from '@/api/types/user';
import {
  deleteMemberResource,
  getMemberResources,
} from '@/api/member_resource';
import ResourceForm from './form';

const state = new State<MemberResource>().getState();

interface Props {
  resourceTypes: ResourceType[];
}
const MemberResources = ({ resourceTypes }: Props) => {
  const { state: resources, dispatch, onClose, onEdit } = useCustomState(state);
  const { t } = useTranslation();

  useEffect(() => {
    getMemberResources(resourceTypes).then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });
  }, [resources.rerender]);

  async function deleteFn(resource: MemberResource): Promise<void> {
    deleteMemberResource(resource.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: resources.list.filter((item) => item.id !== resource.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  return (
    <div>
      {resources.overlay && (
        <ResourceForm
          onClose={onClose}
          resource={resources.item}
          resourceTypes={resourceTypes}
        />
      )}

      <AddButton
        title={t('New Resource')}
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
              accessorKey: 'name',
              header: t('Name'),
            },
            {
              accessorKey: 'resource_type',
              header: t('Resource Type'),
              cell: ({ row }: any) => {
                return t(row.getValue('resource_type'));
              },
            },
          ],
        })}
        data={resources.list}
      />
    </div>
  );
};

export default MemberResources;
