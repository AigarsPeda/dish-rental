import { z } from "zod";

export const OrderSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});

export type OrderType = z.infer<typeof OrderSchema>;
