export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};
