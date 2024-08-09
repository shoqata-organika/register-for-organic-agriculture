const LOCAL_STORAGE_KEY = 'orms-user-language/v2';

export const getUserLanguage = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || 'sq';
};

export const setUserLanguage = (lang: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, lang);
};
