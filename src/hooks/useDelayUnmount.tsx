import { useEffect, useState } from "react";

const useDelayUnmount = (isMounted: boolean, delayTime: number) => {
  const [isAnimation, setIsAnimation] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isMounted && !shouldRender) {
      setShouldRender(true);
    }

    if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setIsAnimation(false), delayTime);
    }

    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (shouldRender) {
      timeoutId = setTimeout(() => setIsAnimation(true), delayTime);
    }

    return () => clearTimeout(timeoutId);
  }, [delayTime, shouldRender]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isAnimation) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime + 100);
    }

    return () => clearTimeout(timeoutId);
  }, [isAnimation, delayTime]);

  return { shouldRender, isAnimation };
};

export default useDelayUnmount;
