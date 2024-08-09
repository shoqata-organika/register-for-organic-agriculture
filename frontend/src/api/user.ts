import axios from 'axios';
import { Zone } from './types/zone';
import { HarvesterView } from './types/harvester';
import { Member } from './types/user';
import { User } from './types/user';
import * as jose from 'jose';

export const getMe = async () => {
  return axios.get('users/me').then((response) => {
    return response;
  });
};

export const getZones = async (): Promise<Zone[]> => {
  return axios.get<Zone[]>('users/zones').then((response) => {
    return response.data;
  });
};

export const getHarvesters = async (): Promise<HarvesterView[]> => {
  return axios.get<HarvesterView[]>('users/harvesters').then((response) => {
    return response.data;
  });
};

type AuthResult = {
  access_token?: string;
  roles?: string[];
  error?: string;
};

export const signup = async (data: Member): Promise<any> => {
  return axios
    .post<AuthResult>('auth/signup', data)
    .then((response) => response.data)
    .catch(() => {
      return { error: 'An error occurred' };
    });
};

export const login = async (
  username: string,
  password: string,
): Promise<AuthResult> => {
  return axios
    .post<AuthResult>('auth/login', { username, password })
    .then((response) => {
      const decodedToken = jose.decodeJwt(response.data.access_token!);
      if (!decodedToken) {
        return { error: 'Invalid token' };
      }

      const parsedToken = decodedToken as {
        roles: string[];
        member_id: number;
      };

      return {
        access_token: response.data.access_token,
        roles: parsedToken.roles,
        member_id: parsedToken.member_id,
      };
    })
    .catch((err) => {
      if (err.response.status === 401) {
        return { error: 'Invalid username or password' };
      }

      return { error: 'An error occurred' };
    });
};

export const getUsers = async (): Promise<User[]> => {
  return axios.get<User[]>('/users').then((response) => {
    return response.data;
  });
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  return axios.post<User>('/users', user).then((response) => {
    return response.data;
  });
};

export const updateUser = async (
  id: number,
  user: Partial<User>,
): Promise<User> => {
  return axios.put<User>(`/users/${id}`, user).then((response) => {
    return response.data;
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  return axios.delete<void>(`/users/${id}`).then((response) => {
    return response.data;
  });
};
