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
  description: z.string().min(1),
  categories: z.array(z.string()),
  availablePieces: z.number().min(0),
  imagesData: z.array(ImageDataSchema),
});

export type ImageDataType = z.infer<typeof ImageDataSchema>;
export type NewPostType = z.infer<typeof NewPostSchema>;
