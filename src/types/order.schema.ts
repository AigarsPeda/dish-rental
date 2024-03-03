import { z } from "zod";

export const OrderSchema = z.object({
  order_id: z.string(),
  product_id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  start_date: z.date(),
  end_date: z.date(),
});

export type OrderType = z.infer<typeof OrderSchema>;
