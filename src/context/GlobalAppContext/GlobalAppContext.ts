import { createContext } from "react";
import { type GlobalAppStateActionType } from "~/context/GlobalAppContext/GlobalAppContextReducer";
import { type GlobalAppStateType } from "~/types/appState.schema";

// export interface GlobalAppStateType {
//   orders: OrderType[];
//   theme: "light" | "dark";
// }

export interface IAppContext {
  appState: GlobalAppStateType;
  dispatch: React.Dispatch<GlobalAppStateActionType>;
}

export const initialAppState: GlobalAppStateType = {
  orders: [],
  theme: "light",
};

export const GlobalAppContext = createContext<IAppContext>({
  appState: initialAppState,
  dispatch: () => null,
});
