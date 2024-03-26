import dayjs from "dayjs";

export const formatDate = (date: undefined | null | Date | number | string) => {
  if (!date) return "";

  return dayjs(date).format("DD/MM/YYYY");
};
