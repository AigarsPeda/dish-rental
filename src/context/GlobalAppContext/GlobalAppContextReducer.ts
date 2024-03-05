import { LOCAL_STORAGE_KEYS } from "hardcoded";
import { type GlobalAppStateType } from "~/types/appState.schema";
import { type OrderType } from "~/types/order.schema";

export type GlobalAppStateActionType =
  | SetNameType
  | RemoveNameType
  | ClearOrdersType
  | SetStateFromLocalStorageType;

const saveStateToLocalStorage = (state: GlobalAppStateType) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.shoppingCart, JSON.stringify(state));
};

const globalAppReducer = (
  state: GlobalAppStateType,
  action: GlobalAppStateActionType,
): GlobalAppStateType => {
  let newState;

  switch (action.type) {
    case "SET_STATE_FROM_LOCAL_STORAGE":
      newState = action.payload;
      break;

    case "ADD_ORDER_ITEM":
      newState = {
        ...state,
        orders: [...state.orders, action.payload],
      };
      break;

    case "REMOVE_ORDER_ITEM":
      newState = {
        ...state,
        orders: state.orders.filter(
          (order) => order.orderId !== action.payload.id,
        ),
      };
      break;

    case "CLEAR_ORDERS":
      newState = {
        ...state,
        orders: [],
      };
      break;

    default:
      return state;
  }

  // Save state to local storage
  newState.lastOrderUpdateTime = new Date();
  saveStateToLocalStorage(newState);

  return newState;
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

interface SetStateFromLocalStorageType {
  type: "SET_STATE_FROM_LOCAL_STORAGE";
  payload: GlobalAppStateType;
}

interface ClearOrdersType {
  type: "CLEAR_ORDERS";
}
