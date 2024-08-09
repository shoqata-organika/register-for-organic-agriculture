import axios from 'axios';
import { CodeCategory, Code } from './types/code_category';

export const getCodeCategories = async (
  api_names: string[],
): Promise<CodeCategory[]> => {
  return axios
    .get<CodeCategory[]>(
      `/code_categories/by_api_names/?names=
        ${api_names.join(',')}`,
    )
    .then((response) => {
      return response.data;
    });
};

export const getCodeCategory = async (
  api_name: string,
): Promise<CodeCategory> => {
  return axios
    .get<CodeCategory>(`/code_categories/${api_name}`)
    .then((response) => {
      return response.data;
    });
};

export async function createCode(code: Code) {
  return axios.post<Code>('/code_categories/code', code).then((response) => {
    return response.data;
  });
}

export async function updateCode(code: Code) {
  return axios.put<Code>('/code_categories/code', code).then((response) => {
    return response.data;
  });
}
