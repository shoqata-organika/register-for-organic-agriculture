import axios from 'axios';
import { MemberView, APPROVAL_STATUS } from './types/user';

export async function getAllMembers(): Promise<MemberView[]> {
  return axios
    .get<MemberView[]>('/admin/members')
    .then((response) => response.data);
}

export async function updateMember(
  status: APPROVAL_STATUS,
  memberId: number,
): Promise<MemberView> {
  return axios
    .post<MemberView>(`/admin/members?status=${status}&id=${memberId}`)
    .then((response) => response.data);
}
