import axios from 'axios';
import { Expense, Sale } from './types/accounting';
import handleFileDownload from './file_download';

export const getSales = async (): Promise<Sale[]> => {
  return axios.get('/sales').then((response) => {
    return response.data;
  });
};

export const createSale = async (data: Partial<Sale>): Promise<Sale> => {
  return axios.post('/sales', data).then((response) => {
    return response.data;
  });
};

export const updateSale = async (
  id: number,
  data: Partial<Sale>,
): Promise<Sale> => {
  return axios.put(`/sales/${id}`, data).then((response) => {
    return response.data;
  });
};

export const deleteSale = async (id: number): Promise<void> => {
  return axios.delete(`/sales/${id}`);
};

export const deleteExpense = async (id: number): Promise<void> => {
  return axios.delete(`/expenses/${id}`);
};

export const getExpenses = async (): Promise<Expense[]> => {
  return axios.get('/expenses').then((response) => {
    return response.data;
  });
};

export const createExpense = async (
  data: Partial<Expense>,
): Promise<Expense> => {
  return axios.post('/expenses', data).then((response) => {
    return response.data;
  });
};

export const updateExpense = async (
  id: number,
  data: Partial<Expense>,
): Promise<Expense> => {
  return axios.put(`/expenses/${id}`, data).then((response) => {
    return response.data;
  });
};

export async function exportSales(lan: string, ids: Array<number>) {
  return axios
    .get(`/sales/export?language=${lan}&ids=${ids.join(',')}`, {
      responseType: 'blob',
    })
    .then(handleFileDownload('sales.xlsx'));
}
