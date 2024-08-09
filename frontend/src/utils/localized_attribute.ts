export const ta = (entity: any, attribute: string, locale: string): string => {
  const localizedAttribute = `${attribute}_${locale}`;
  return entity[localizedAttribute] || entity[attribute];
};
