import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useEffect, useReducer } from "react";
import NavBar from "~/components/NavBar/NavBar";
import {
  GlobalAppContext,
  initialAppState,
} from "~/context/GlobalAppContext/GlobalAppContext";
import globalAppReducer from "~/context/GlobalAppContext/GlobalAppContextReducer";
import { api } from "~/utils/api";
import { LOCAL_STORAGE_KEYS } from "hardcoded";
import { GlobalAppStateSchema } from "~/types/appState.schema";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [appState, dispatch] = useReducer(globalAppReducer, initialAppState);

  useEffect(() => {
    const savedAppState = localStorage.getItem(LOCAL_STORAGE_KEYS.shoppingCart);
    if (savedAppState) {
      const validAppState = GlobalAppStateSchema.parse(
        JSON.parse(savedAppState),
      );

      const { lastOrderUpdateTime } = validAppState;

      // if one hour has passed since the last order update, clear the orders
      if (
        lastOrderUpdateTime &&
        new Date(lastOrderUpdateTime) <
          new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      ) {
        dispatch({ type: "CLEAR_ORDERS" });
        return;
      }

      dispatch({
        type: "SET_STATE_FROM_LOCAL_STORAGE",
        payload: validAppState,
      });
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <GlobalAppContext.Provider value={{ appState, dispatch }}>
        <NavBar />
        <Component {...pageProps} />
      </GlobalAppContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
