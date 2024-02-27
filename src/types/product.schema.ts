import { z } from "zod";

export const ImageDataSchema = z.object({
  url: z.string(),
  key: z.string(),
  name: z.string(),
  size: z.number(),
  serverData: z.unknown(),
});

export const NewProductSchema = z.object({
  titleImage: z.string(),
  name: z.string().min(1),
  price: z.number().min(0),
  isPublished: z.boolean(),
  availableDatesEnd: z.date(),
  availableDatesStart: z.date(),
  description: z.string().min(1),
  categories: z.array(z.string()),
  availablePieces: z.number().min(0),
  imagesData: z.array(ImageDataSchema),
});

export type ImageDataType = z.infer<typeof ImageDataSchema>;
export type NewProductType = z.infer<typeof NewProductSchema>;

export const DBImageSchema = z.object({
  id: z.number(),
  key: z.string(),
  url: z.string(),
  name: z.string(),
  size: z.number(),
  postId: z.number(),
});

export type DBImageType = z.infer<typeof DBImageSchema>;

export const DBProductSchema = z.object({
  id: z.number(),
  price: z.number(),
  createdAt: z.date(),
  createdById: z.string(),
  isPublished: z.boolean(),
  name: z.string().nullish(),
  availablePieces: z.number(),
  updatedAt: z.date().nullable(),
  images: z.array(DBImageSchema),
  titleImage: z.string().nullish(),
  description: z.string().nullish(),
  availableDatesEnd: z.number().nullish(),
  availableDatesStart: z.number().nullish(),
  categories: z.array(z.string()).nullish(),
});

export type DBProductType = z.infer<typeof DBProductSchema>;
