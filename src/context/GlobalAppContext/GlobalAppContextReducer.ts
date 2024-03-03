import { type GlobalAppStateType } from "~/context/GlobalAppContext/GlobalAppContext";
import { type OrderType } from "~/types/order.schema";

export type GlobalAppStateActionType = SetNameType | RemoveNameType;

const globalAppReducer = (
  state: GlobalAppStateType,
  action: GlobalAppStateActionType,
): GlobalAppStateType => {
  switch (action.type) {
    case "ADD_ORDER_ITEM": {
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    }
    case "REMOVE_ORDER_ITEM": {
      return {
        ...state,
        orders: state.orders.filter(
          (order) => order.orderId !== action.payload.id,
        ),
      };
    }

    default:
      return state;
  }
};

export default globalAppReducer;

interface SetNameType {
  type: "ADD_ORDER_ITEM";
  payload: OrderType;
}

interface RemoveNameType {
  type: "REMOVE_ORDER_ITEM";
  payload: {
    id: string;
  };
}
