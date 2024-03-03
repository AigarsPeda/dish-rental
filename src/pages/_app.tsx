import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useReducer } from "react";
import NavBar from "~/components/NavBar/NavBar";
import {
  GlobalAppContext,
  initialAppState,
} from "~/context/GlobalAppContext/GlobalAppContext";
import globalAppReducer from "~/context/GlobalAppContext/GlobalAppContextReducer";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [appState, dispatch] = useReducer(globalAppReducer, initialAppState);

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
