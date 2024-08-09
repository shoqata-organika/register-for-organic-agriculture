import axios from 'axios';
import {
  InventoryItem,
  InventoryItemType,
  InventoryLocation,
  StoreInventoryItemDto,
} from './types/inventory';
import handleFileDownload from './file_download';

export const getLocations = async (): Promise<InventoryLocation[]> => {
  return axios.get('/inventory_locations').then((response) => {
    return response.data;
  });
};

export const deleteLocation = async (id: number): Promise<void> => {
  return axios.delete(`/inventory_locations/${id}`);
};

export const createLocation = async (
  location: Partial<InventoryLocation>,
): Promise<InventoryLocation> => {
  return axios.post('/inventory_locations', location).then((response) => {
    return response.data;
  });
};

export const updateLocation = async (
  id: number,
  location: Partial<InventoryLocation>,
): Promise<InventoryLocation> => {
  return axios.put(`/inventory_locations/${id}`, location).then((response) => {
    return response.data;
  });
};

export const getInventoryItems = async (
  type: InventoryItemType,
): Promise<InventoryItem[]> => {
  return axios.get(`/inventory_items?type=${type}`).then((response) => {
    return response.data;
  });
};

export const getDriedInventoryItems = async (): Promise<InventoryItem[]> => {
  return axios.get(`/inventory_items/dried_items`).then((response) => {
    return response.data;
  });
};

export const getInventoryItemsForSale = async (): Promise<InventoryItem[]> => {
  return axios.get(`/inventory_items/sale`).then((response) => {
    return response.data;
  });
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
  return axios.delete(`/inventory_items/${id}`);
};

export const createInventoryItem = async (
  item: StoreInventoryItemDto,
): Promise<InventoryItem> => {
  return axios.post('/inventory_items', item).then((response) => {
    return response.data;
  });
};

export const updateInventoryItem = async (
  id: number,
  item: Partial<StoreInventoryItemDto>,
): Promise<InventoryItem> => {
  return axios.put(`/inventory_items/${id}`, item).then((response) => {
    return response.data;
  });
};

export const getInventoryItem = async (id: number): Promise<InventoryItem> => {
  return axios.get(`/inventory_items/${id}`).then((response) => {
    return response.data;
  });
};

export const exportInventoryItems = async (
  type: string,
  lang: string,
  ids: Array<number>,
) => {
  return axios
    .get(
      `/inventory_items/export?type=${type}&language=${lang}&ids=${ids.join(',')}`,
      {
        responseType: 'blob',
      },
    )
    .then(handleFileDownload(`${type.split('_')[0]}_inventory_items.xlsx`));
};

export const exportInventoryLocations = async (lang: string) => {
  return axios
    .get(`/inventory_locations/export?language=${lang}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('inventory_items.xlsx'));
};
