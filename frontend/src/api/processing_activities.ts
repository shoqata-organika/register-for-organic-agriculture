import axios, { AxiosResponse } from 'axios';
import {
  DetailedProcessingActivity,
  ProcessingActivity,
  ProcessingType,
} from './types/processing_activity';
import handleFileDownload from './file_download';

export async function createProcessingActivity(
  activity: ProcessingActivity,
  type?: ProcessingType,
): Promise<ProcessingActivity> {
  return axios
    .post(`/processing_activities?type=${type}`, activity)
    .then((response: AxiosResponse) => response.data);
}

export async function updateProcessingActivity(
  activity: ProcessingActivity,
): Promise<ProcessingActivity> {
  return axios
    .put(`/processing_activities/${activity.id}`, activity)
    .then((response: AxiosResponse) => response.data);
}

export async function getProcessingActivities(
  type?: ProcessingType,
): Promise<DetailedProcessingActivity[]> {
  const url = type
    ? `/processing_activities?type=${type}`
    : '/processing_activities';

  return axios.get(url).then((response: AxiosResponse) => response.data);
}

export async function exportProcessingActivities(
  lang: string,
  type?: ProcessingType,
  ids?: Array<number>,
) {
  const url = type
    ? `/processing_activities/export?type=${type}&language=${lang}`
    : `/processing_activities/export?language=${lang}`;

  const fileName = type === ProcessingType.DRYING ? 'drying' : 'processing';

  return axios
    .get(url + `&ids=${ids?.join(',')}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload(`${fileName}_activities.xlsx`));
}
