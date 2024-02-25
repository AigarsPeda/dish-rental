import dayjs from "dayjs";

const formatDate = (date: Date | undefined | null) => {
  if (!date) return "";

  return dayjs(date).format("DD/MM/YYYY");
};

export default formatDate;