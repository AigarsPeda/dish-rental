import { type OrderType } from "~/types/order.schema";

const getSumOfOrders = (orders: OrderType[]) => {
  return orders?.reduce((acc, order) => {
    return Math.round((acc + order.price) * 100) / 100;
  }, 0);
};

export default getSumOfOrders;
