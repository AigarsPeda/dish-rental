import { useRouter } from "next/router";

const useRedirect = () => {
  const router = useRouter();

  // return current path
  const getCurrentPath = () => {
    return router.pathname;
  };

  // go back to previous page
  const goBack = () => {
    router.back();
  };

  const redirectToPath = (path: string, redirectPathname?: string) => {
    router
      .push({
        pathname: path,

        // if isRedirectQuery is true, add redirect query to the path to redirect to after login
        ...(redirectPathname && {
          query: {
            redirect: encodeURI(redirectPathname),
            // if id is provided, add id to the query
            // ...(id && { redirectId: id }),
          },
        }),
      })
      .catch((err) => console.error(err));
  };

  return { goBack, getCurrentPath, redirectToPath };
};

export default useRedirect;
