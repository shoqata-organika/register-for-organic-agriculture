import axios from 'axios';
import { LandParcel } from './types/land_parcel';
import { Zone } from './types/zone';
import { mapFromObjToFormData } from '@/utils/mapFromObjToFormData';
import handleFileDownload from './file_download';

export const getZones = async (): Promise<Zone[]> => {
  return axios.get<Zone[]>('/zones').then((response) => {
    return response.data;
  });
};

export const createZone = async (zone: Partial<Zone>) => {
  const data = mapFromObjToFormData(zone);

  return axios
    .post<LandParcel>('/zones', data)
    .then((response) => response.data);
};

export const updateZone = async (id: number, zone: Partial<Zone>) => {
  const data = mapFromObjToFormData(zone);

  return axios
    .put<LandParcel>(`/zones/${id}`, data)
    .then((response) => response.data);
};

export const deleteZone = async (id: number) => {
  return axios.delete(`/zones/${id}`).then((response) => response.data);
};

export async function exportZones(lang: string) {
  return axios
    .get(`/zones/export?language=${lang}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('zones.xlsx'));
}
