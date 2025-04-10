export const formatDate = (date: string) => {
  return date.slice(8) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4);
};
