import dayjs from "dayjs";

export const formatDate = (date: Date | undefined | null | number | string) => {
  if (!date) return "";

  return dayjs(date).format("DD/MM/YYYY");
};
