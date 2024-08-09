import axios from 'axios';
import { FarmActivityView, FarmActivity } from './types/farm_activity';
import { mapFromObjToFormData } from '@/utils/mapFromObjToFormData';
import handleFileDownload from './file_download';

export async function getFarmActivities(): Promise<FarmActivityView[]> {
  const response = await axios.get<FarmActivityView[]>('/farm_activities');

  return response.data;
}

export async function createFarmActivity(
  activity: FarmActivity,
): Promise<void> {
  // transform details to json because formData converts it to '[Object object]'
  activity.details = JSON.stringify(activity.details);

  const data = mapFromObjToFormData(activity);

  await axios.post<FarmActivity>('/farm_activities', data);
}

export async function deleteFarmActivity(activityId: number): Promise<void> {
  await axios.delete<FarmActivityView>(`/farm_activities/delete/${activityId}`);
}

export async function editFarmActivity(
  activityId: number,
  activity: FarmActivity,
): Promise<FarmActivityView> {
  // transform details to json because formData converts it to '[Object object]'
  activity.details = JSON.stringify(activity.details);

  const data = mapFromObjToFormData(activity);

  const newActivity = await axios.put<FarmActivityView>(
    `/farm_activities/update/${activityId}`,
    data,
  );

  return newActivity.data;
}

export const exportFarmActivities = async (
  lan: string,
  ids?: Array<number>,
) => {
  return axios
    .get(`/farm_activities/export?language=${lan}&ids=${ids?.join(',')}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('farm_activities.xlsx'));
};
