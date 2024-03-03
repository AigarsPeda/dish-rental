import { z } from "zod";

export const OrderSchema = z.object({
  name: z.string(),
  price: z.number(),
  orderId: z.string(),
  quantity: z.number(),
  imageURL: z.string(),
  productId: z.number(),
  endDate: z.string().or(z.date()),
  startDate: z.string().or(z.date()),
});

export type OrderType = z.infer<typeof OrderSchema>;
