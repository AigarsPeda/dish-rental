import { LOCAL_STORAGE_KEYS } from "hardcoded";
import { type GlobalAppStateType } from "~/types/appState.schema";
import { type OrderType } from "~/types/order.schema";

export type GlobalAppStateActionType =
  | SetNameType
  | RemoveNameType
  | SetStateFromLocalStorageType;

const saveStateToLocalStorage = (state: GlobalAppStateType) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.shoppingCart, JSON.stringify(state));
};

const globalAppReducer = (
  state: GlobalAppStateType,
  action: GlobalAppStateActionType,
): GlobalAppStateType => {
  switch (action.type) {
    case "SET_STATE_FROM_LOCAL_STORAGE": {
      saveStateToLocalStorage(action.payload);
      return action.payload;
    }

    case "ADD_ORDER_ITEM": {
      const newsState = {
        ...state,
        orders: [...state.orders, action.payload],
      };

      saveStateToLocalStorage(newsState);

      return newsState;
    }
    case "REMOVE_ORDER_ITEM": {
      const newState = {
        ...state,
        orders: state.orders.filter(
          (order) => order.orderId !== action.payload.id,
        ),
      };

      saveStateToLocalStorage(newState);

      return newState;
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

interface SetStateFromLocalStorageType {
  type: "SET_STATE_FROM_LOCAL_STORAGE";
  payload: GlobalAppStateType;
}
