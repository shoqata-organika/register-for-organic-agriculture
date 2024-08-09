import axios from 'axios';
import { MemberResource, ResourceType } from './types/user';

export const getMemberResources = async (
  resourceTypes: ResourceType[],
): Promise<MemberResource[]> => {
  return axios
    .get(`/resources?resource_types=${resourceTypes.join(',')}`)
    .then((response) => {
      return response.data;
    });
};

export const deleteMemberResource = async (id: string): Promise<void> => {
  return axios.delete(`/resources/${id}`);
};

export const createMemberResource = async (
  resource: Partial<MemberResource>,
): Promise<MemberResource> => {
  return axios.post('/resources', resource).then((response) => {
    return response.data;
  });
};

export const updateMemberResource = async (
  id: string,
  resource: Partial<MemberResource>,
): Promise<MemberResource> => {
  return axios.put(`/resources/${id}`, resource).then((response) => {
    return response.data;
  });
};
