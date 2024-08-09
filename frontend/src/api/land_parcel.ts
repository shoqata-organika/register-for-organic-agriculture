import axios from 'axios';
import { LandParcel, LandParcelView } from './types/land_parcel';
import { mapFromObjToFormData } from '@/utils/mapFromObjToFormData';
import handleFileDownload from './file_download';

export const getLandParcels = async (): Promise<LandParcelView[]> => {
  return axios.get<LandParcelView[]>('/land_parcels').then((response) => {
    return response.data;
  });
};

export const getContractedFarmerLandParcels = async (
  contracted_farmer_id: number,
): Promise<LandParcelView[]> => {
  return axios
    .get<
      LandParcelView[]
    >(`/contracted_farmer/${contracted_farmer_id}/land_parcels`)
    .then((response) => {
      return response.data;
    });
};

export const createLandParcel = async (landParcel: Partial<LandParcel>) => {
  const data = mapFromObjToFormData({
    ...landParcel,
    subParcels: JSON.stringify(landParcel.subParcels),
    crops: JSON.stringify(landParcel.crops),
  });

  return axios
    .post<LandParcel>('/land_parcels', data)
    .then((response) => response.data);
};

export const updateLandParcel = async (
  id: number,
  landParcel: Partial<LandParcel>,
) => {
  const data = mapFromObjToFormData({
    ...landParcel,
    subParcels: JSON.stringify(landParcel.subParcels),
    crops: JSON.stringify(landParcel.crops),
  });

  return axios
    .put<LandParcelView>(`/land_parcels/${id}`, data)
    .then((response) => {
      return response.data;
    });
};

export const deleteLandParcel = async (id: number) => {
  return axios.delete(`/land_parcels/${id}`).then((response) => response.data);
};

export const getCrops = async (landParcelId: number) => {
  return axios
    .get(`/land_parcels/${landParcelId}/crops?`)
    .then((response) => response.data);
};

export const exportLandParcels = async (lang: string) => {
  return axios
    .get(`/land_parcels/export?language=${lang}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('land_parcels.xlsx'));
};
