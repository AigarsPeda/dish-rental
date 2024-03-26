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

// export type OderFormType = {
//   orderId: string;
//   orders: OrderType[];
//   client: {
//     name: string;
//     email: string;
//     phone: string;
//     billingAddress: string;
//     deliveryAddress: string;
//   };
// };

export const OrderFormSchema = z.object({
  orderId: z.string(),
  orders: z.array(OrderSchema),
  client: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    billingAddress: z.string(),
    deliveryAddress: z.string(),
  }),
});

export type OrderFormType = z.infer<typeof OrderFormSchema>;
