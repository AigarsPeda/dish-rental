import { type DBImageType } from "~/types/product.schema";

const getTitleImage = (
  images: DBImageType[] | undefined,
  titleImageName: string | undefined | null,
) => {
  return images?.find((image) => image.name === titleImageName);
};

export default getTitleImage;
