import { z } from "zod";

export const ImageDataSchema = z.object({
  url: z.string(),
  key: z.string(),
  name: z.string(),
  size: z.number(),
  serverData: z.unknown(),
});

export const NewPostSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  isPublished: z.boolean(),
  description: z.string().min(1),
  categories: z.array(z.string()),
  availablePieces: z.number().min(0),
  imagesData: z.array(ImageDataSchema),
});

export type ImageDataType = z.infer<typeof ImageDataSchema>;
export type NewPostType = z.infer<typeof NewPostSchema>;

export const DBImageSchema = z.object({
  id: z.number(),
  key: z.string(),
  url: z.string(),
  name: z.string(),
  size: z.number(),
  postId: z.number(),
});

export type DBImageType = z.infer<typeof DBImageSchema>;

export const DBPostSchema = z.object({
  id: z.number(),
  price: z.number(),
  createdAt: z.date(),
  createdById: z.string(),
  isPublished: z.boolean(),
  name: z.string().nullish(),
  availablePieces: z.number(),
  updatedAt: z.date().nullable(),
  categories: z.string().nullish(),
  description: z.string().nullish(),
  images: z.array(DBImageSchema),
});

export type DBPostType = z.infer<typeof DBPostSchema>;
