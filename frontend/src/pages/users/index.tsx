import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddButton from '@/components/AddButton';
import DataTable from '@/components/TableComponent';
import { withActionColumns } from '@/components/withActionColumns';
import { User } from '@/api/types/user';
import UsersForm from './form';
import useCustomState, { State } from '@/hooks/useCustomState';
import { deleteUser, getUsers } from '@/api/user';

const state = new State<User>().getState();

const Users = () => {
  const { state: users, dispatch, onClose, onEdit } = useCustomState(state);

  const { t } = useTranslation();

  useEffect(() => {
    getUsers().then((response) => {
      dispatch({ type: 'UPDATE_STATE', payload: { list: response } });
    });
  }, [users.rerender]);

  async function deleteFn(user: User): Promise<void> {
    deleteUser(user.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: users.list.filter((item) => item.id !== user.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  return (
    <div>
      {users.overlay && <UsersForm onClose={onClose} user={users.item} />}

      <AddButton
        title={t('New User')}
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
              accessorKey: 'first_name',
              header: t('First name'),
            },
            {
              accessorKey: 'last_name',
              header: t('Last name'),
            },
            {
              accessorKey: 'username',
              header: t('Username'),
            },
            {
              accessorKey: 'email',
              header: t('Email'),
            },
          ],
        })}
        data={users.list}
      />
    </div>
  );
};

export default Users;
