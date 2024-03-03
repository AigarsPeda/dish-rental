import { z } from "zod";

export const OrderSchema = z.object({
  orderId: z.string(),
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  imageURL: z.string(),
});

export type OrderType = z.infer<typeof OrderSchema>;
