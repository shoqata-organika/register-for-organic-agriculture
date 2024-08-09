import axios from 'axios';
import { mapFromObjToFormData } from '@/utils/mapFromObjToFormData';
import handleFileDownload from './file_download';

import {
  ContractedFarmer,
  ContractedFarmerView,
} from './types/contracted_farmers';

export async function getAllContractedFarmers(): Promise<
  ContractedFarmerView[]
> {
  return await axios
    .get<ContractedFarmerView[]>('/contracted_farmer')
    .then((res) => res.data);
}

export async function addContractedFarmer(contracted_farmer: ContractedFarmer) {
  const data = mapFromObjToFormData(contracted_farmer);

  return await axios.post<ContractedFarmer>('/contracted_farmer', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
}

export async function updateContractedFarmer(
  contracted_farmer: ContractedFarmer,
) {
  const requestBody = {
    ...contracted_farmer,
  };

  const data = mapFromObjToFormData(requestBody);

  return await axios.put<ContractedFarmer>(
    `/contracted_farmer/${contracted_farmer.id}`,
    data,
  );
}

export async function deleteContractedFarmer(id: number) {
  return await axios.delete<ContractedFarmerView>(`/contracted_farmer/${id}`);
}

export async function exportContractedFarmers(lan: string) {
  return axios
    .get(`/contracted_farmer/export?language=${lan}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('contracted_farmers.xlsx'));
}
