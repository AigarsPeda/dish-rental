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

import "~/styles/globals.css";
import { LOCAL_STORAGE_KEYS } from "../../hardcoded";
import { GlobalAppStateSchema } from "../types/appState.schema";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [appState, dispatch] = useReducer(globalAppReducer, initialAppState);

  useEffect(() => {
    const savedAppState = localStorage.getItem(LOCAL_STORAGE_KEYS.shoppingCart);
    if (savedAppState) {
      const parsedAppState = JSON.parse(savedAppState);

      const validAppState = GlobalAppStateSchema.parse(parsedAppState);

      console.log("validAppState", validAppState);

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
