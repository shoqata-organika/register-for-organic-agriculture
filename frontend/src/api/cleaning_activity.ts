import axios from 'axios';
import { CleaningActivity } from './types/cleaning_activity';
import handleFileDownload from './file_download';

export const getCleaningActivities = async (): Promise<CleaningActivity[]> => {
  return axios.get('/cleaning_activities').then((response) => {
    return response.data;
  });
};

export const createCleaningActivity = async (
  data: Partial<CleaningActivity>,
): Promise<CleaningActivity> => {
  return axios.post('/cleaning_activities', data).then((response) => {
    return response.data;
  });
};

export const updateCleaningActivity = async (
  id: number,
  data: Partial<CleaningActivity>,
): Promise<CleaningActivity> => {
  return axios.put(`/cleaning_activities/${id}`, data).then((response) => {
    return response.data;
  });
};

export const deleteCleaningActivity = async (id: number): Promise<void> => {
  return axios.delete(`/cleaning_activities/${id}`);
};

export async function exportCleaningActivities(
  lang: string,
  ids: Array<number>,
) {
  return axios
    .get(`/cleaning_activities/export?language=${lang}&ids=${ids.join(',')}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('cleaning_activities.xlsx'));
}
