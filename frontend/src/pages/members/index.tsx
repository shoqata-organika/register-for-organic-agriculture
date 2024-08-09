import { useEffect } from 'react';
import { MemberView } from '@/api/types/user';
import MemberForm from './form';
import useCustomState, { State } from '@/hooks/useCustomState';
import { getMembers } from '@/api/members';

const state = new State<MemberView>().getState();

function Members() {
  const { state: members, dispatch, onClose } = useCustomState(state);

  useEffect(() => {
    (async function () {
      try {
        const members = await getMembers();

        dispatch({ type: 'UPDATE_STATE', payload: { list: members } });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [members.rerender]);

  return (
    <div>
      <MemberForm member={members.list[0]} onClose={onClose} />
    </div>
  );
}

export default Members;
