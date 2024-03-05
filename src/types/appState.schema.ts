import { z } from "zod";
import { OrderSchema } from "~/types/order.schema";

export const GlobalAppStateSchema = z.object({
  orders: z.array(OrderSchema),
  lastOrderUpdateTime: z.string().or(z.date()).nullish(),
  theme: z.enum(["light", "dark"]),
});

export type GlobalAppStateType = z.infer<typeof GlobalAppStateSchema>;
