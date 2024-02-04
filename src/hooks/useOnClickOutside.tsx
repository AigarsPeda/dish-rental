import type { RefObject } from "react";
import { useEffect } from "react";

type Event = MouseEvent | TouchEvent;

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: ({ event, element }: { event: Event; element: T }) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const element = ref?.current;

      if (!element || element.contains((event?.target as Node) || null)) {
        return;
      }

      handler({ event, element });
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
