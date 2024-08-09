import axios from 'axios';
import { CropType } from './types/crop';
import {
  Member,
  MemberResource,
  MemberView,
  ResourceType,
  MemberCropView,
  MemberCrop,
} from './types/user';
import handleFileDownload from './file_download';

export async function getMembers(): Promise<MemberView[]> {
  return await axios.get<MemberView[]>('/members').then((res) => res.data);
}

export async function createMember(member: Member): Promise<Member> {
  return await axios.post<Member>('/members', member).then((res) => res.data);
}

export async function updateMember(member: Member): Promise<Member> {
  return await axios
    .put<Member>(`/members/${member.id}`, member)
    .then((res) => res.data);
}

export async function deleteMember(id: number): Promise<void> {
  return await axios.delete(`/members/${id}`);
}

export async function getResources(
  type: ResourceType,
): Promise<MemberResource[]> {
  return await axios
    .get<MemberResource[]>(`/users/resources?resource_type=${type}`)
    .then((res) => res.data);
}

export async function getMemberCrops(
  type: CropType,
): Promise<MemberCropView[]> {
  return await axios
    .get<MemberCropView[]>(`/members/crops?type=${type}`)
    .then((res) => res.data);
}

export async function getMemberCrop(cropId: number): Promise<MemberCropView> {
  return await axios
    .get<MemberCropView>(`/members/crop?cpId=${cropId}`)
    .then((res) => res.data);
}

export async function createMemberCrop(data: MemberCrop): Promise<MemberCrop> {
  return await axios
    .post<MemberCrop>('/members/crops', data)
    .then((res) => res.data);
}

export async function updateMemberCrop(data: MemberCrop): Promise<MemberCrop> {
  return await axios
    .put<MemberCrop>(`/members/crops`, data)
    .then((res) => res.data);
}

export async function deleteMemberCrop(id: number): Promise<MemberCrop> {
  return await axios
    .delete<MemberCrop>(`/members/crops/${id}`)
    .then((res) => res.data);
}

export const exportMemberCrops = async (lang: string, type: string) => {
  const extension = type === 'CROPS' ? 'crops' : 'bma_crops';

  return axios
    .get(`/members/export_crops?language=${lang}&type=${type}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload(`member_${extension}.xlsx`));
};
