import axios from 'axios';
import { mapFromObjToFormData } from '@/utils/mapFromObjToFormData';
import { ProcessingUnit, ProcessingUnitView } from './types/processing_unit';
import handleFileDownload from './file_download';

export async function getProcessingUnits(): Promise<ProcessingUnitView[]> {
  return await axios
    .get<ProcessingUnitView[]>('/processing_unit')
    .then((response) => response.data);
}

export async function createProcessingUnit(p_unit: ProcessingUnit) {
  const data = mapFromObjToFormData(p_unit);

  return await axios.post<ProcessingUnit>('/processing_unit', data);
}

export async function updateProcessingUnit(p_unit: ProcessingUnit) {
  const data = mapFromObjToFormData(p_unit);

  return await axios.put<ProcessingUnit>(`/processing_unit/${p_unit.id}`, data);
}

export async function deleteProcessingUnit(id: number) {
  return await axios.delete<ProcessingUnit>(`/processing_unit/${id}`);
}

export async function exportProcessingUnits(lang: string, ids?: Array<number>) {
  return axios
    .get(`/processing_unit/export?language=${lang}&ids=${ids?.join(',')}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('processing_units.xlsx'));
}
