import axios from 'axios';
import { Admission } from './types/admission';
import handleFileDownload from './file_download';

type ActivityType = 'harvesting' | 'collection';

export async function createAdmission(admission: Admission) {
  return await axios.post<Admission>(`/admissions`, {
    ...admission,
  });
}

export async function updateAdmission(
  admission: Admission,
  type: ActivityType,
) {
  return await axios.put<Admission>(`/admissions/update/${type}`, admission);
}

export async function getAdmissions(type?: string) {
  const url = type ? `/admissions?type=${type}` : '/admissions';
  return await axios.get<Admission[]>(url);
}

export async function getAdmission(id: number) {
  return await axios.get<Admission>(`/admissions/${id}`);
}

export const exportAdmissions = async (
  type: string,
  lan: string,
  admissionIds?: Array<number>,
) => {
  const ids = admissionIds?.join(',');

  return axios
    .get(`/admissions/export?type=${type}&language=${lan}&admids=${ids}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload(`${type}_admissions.xlsx`));
};
