import axios from 'axios';
import { Harvester, HarvesterView } from './types/harvester';
import { mapFromObjToFormData } from '@/utils/mapFromObjToFormData';
import handleFileDownload from './file_download';

export const getHarvesters = async (): Promise<Harvester[]> => {
  return axios
    .get<Harvester[]>('/harvesters')
    .then((response) => response.data);
};

export const createHarvester = async (harvester: Partial<Harvester>) => {
  const data = mapFromObjToFormData(harvester);

  return axios
    .post<Harvester>('/harvesters', data)
    .then((response) => response.data);
};

export const updateHarvester = async (
  id: number,
  harvester: Partial<Harvester | HarvesterView>,
) => {
  const data = mapFromObjToFormData(harvester);

  return axios
    .put<Harvester>(`/harvesters/${id}`, data)
    .then((response) => response.data);
};

export const deleteHarvester = async (id: number) => {
  return axios.delete(`/harvesters/${id}`).then((response) => response.data);
};

export async function exportHarvesters(lang: string) {
  return axios
    .get(`/harvesters/export?language=${lang}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('harvesters.xlsx'));
}
