const TOKEN_KEY = 'orms-token';

const roles: string[] | null = null;
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  return localStorage.removeItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  return localStorage.setItem(TOKEN_KEY, token);
};

export const setRoles = (roles: string[]) => {
  localStorage.setItem('orms-roles', JSON.stringify(roles));
};

export const getRoles = () => {
  if (roles) {
    return roles;
  }

  const rls = localStorage.getItem('orms-roles');
  return rls ? JSON.parse(rls) : [];
};

export const hasRole = (role: string) => {
  return getRoles().includes(role);
};

export const hasAnyRole = (roles: string[]) => {
  return roles.some((role) => hasRole(role));
};

export const logOut = () => {
  clearToken();
};
